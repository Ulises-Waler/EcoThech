const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;
const secretKey = 'mysecretkey';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
    {
        id: 1,
        username: 'Calvillo_2024',
        password: bcrypt.hashSync('UTC2024', 7) 
    }
];

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
        
    });
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 });
    res.json({ auth: true, token });


    
});

const X = tf.randomNormal([100, 4]);  
const y_condiciones = tf.randomUniform([100, 1]); 
const y_enfermedades = tf.randomUniform([100, 1], 0, 2, 'int32');

const { X_train, y_condiciones_train, y_enfermedades_train, X_test, y_condiciones_test, y_enfermedades_test } = tf.tidy(() => {
    return {
        X_train: X.slice([0, 0], [80, 4]),
        y_condiciones_train: y_condiciones.slice([0, 0], [80, 1]),
        y_enfermedades_train: y_enfermedades.slice([0, 0], [80, 1]),
        X_test: X.slice([80, 0], [20, 4]),
        y_condiciones_test: y_condiciones.slice([80, 0], [20, 1]),
        y_enfermedades_test: y_enfermedades.slice([80, 0], [20, 1])
    };
});

const model_condiciones = tf.sequential();
model_condiciones.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }));
model_condiciones.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model_condiciones.add(tf.layers.dense({ units: 1 }));

const model_enfermedades = tf.sequential();
model_enfermedades.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }));
model_enfermedades.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model_enfermedades.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

model_condiciones.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['mae'] });
model_enfermedades.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

async function trainModel() {
    try {
        await model_condiciones.fit(X_train, y_condiciones_train, {
            epochs: 50,
            batchSize: 32,
            validationData: [X_test, y_condiciones_test]
        });
        await model_enfermedades.fit(X_train, y_enfermedades_train, {
            epochs: 50,
            batchSize: 32,
            validationData: [X_test, y_enfermedades_test]
        });
        console.log("Modelos entrenados exitosamente.");
    } catch (error) {
        console.error("Error al entrenar los modelos:", error);
    }
}

trainModel();

app.get('/api/predicciones', authenticateToken, async (req, res) => {
    try {
        const new_data = tf.tensor2d([[0.8, 0.6, 25.0, 50.0]]);
        const predictions_condiciones = model_condiciones.predict(new_data);
        const predictions_enfermedades = model_enfermedades.predict(new_data);
        const [pred_condiciones, pred_enfermedades] = await Promise.all([predictions_condiciones.array(), predictions_enfermedades.array()]);
        const recommendation = generateRecommendation(pred_condiciones[0][0], pred_enfermedades[0][0]);

        res.json({
            predicciones: pred_condiciones[0][0],
            luz: 0.8,
            humedad_suelo: 0.6,
            temperatura: 25.0,
            humedad_ambiental: 50.0,
            enfermedad: pred_enfermedades[0][0] > 0.5,
            recomendacion: recommendation
        });
    } catch (error) {
        console.error("Error al predecir:", error);
        res.status(500).send("Error al predecir.");
    }
});

function generateRecommendation(prediction_condiciones, prediction_enfermedades) {
    let condiciones = "";
    let fertilizacion = "";
    let enfermedad = "";

    if (prediction_condiciones > 0.8) {
        condiciones = "Se recomienda reducir la luz y aumentar la humedad del suelo.";
        fertilizacion = "Se recomienda aplicar fertilizante, ya que los datos indican condiciones óptimas para el crecimiento.";
    } else if (prediction_condiciones < 0.2) {
        condiciones = "Se recomienda aumentar la luz y disminuir la humedad del suelo.";
        fertilizacion = "Se recomienda verificar la necesidad de fertilizante, ya que las condiciones podrían no ser óptimas.";
    } else {
        condiciones = "Los datos de los sensores indican que las condiciones son adecuadas.";
        fertilizacion = "No se recomienda fertilizante en este momento, ya que las condiciones son adecuadas.";
    }

    if (prediction_enfermedades > 0.5) {
        enfermedad = "Se detectó la presencia de enfermedades. Se recomienda aplicar tratamientos adecuados.";
    } else {
        enfermedad = "No se detectaron enfermedades en el cultivo.";
    }

    return { condiciones, fertilizacion, enfermedad };
}

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
