import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import './Desoname.css'; 

function Desoname({ token, onLogout }) {
    const [datos, setDatos] = useState({
        luz: null,
        humedad_suelo: null,
        temperatura: null,
        humedad_ambiental: null,
        predicciones: null,
        enfermedad: null,
        recomendacion: {
            condiciones: "",
            fertilizacion: "",
            enfermedad: ""
        }
    });

    const [exiting, setExiting] = useState(false); 

    useEffect(() => {
        axios.get('http://localhost:5000/api/predicciones', {
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                setDatos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener predicciones:', error);
                alert('Error al obtener datos. Por favor, intente nuevamente.');
                onLogout();
            });
    }, [token, onLogout]);

    const handleLogout = () => {
        setExiting(true); 
        setTimeout(() => {
            onLogout(); 
        }, 300); 
    };

    return (
        <CSSTransition
            in={!exiting}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div className="dashboard-container">
                <h1>Datos del Tomate</h1>
                <div className="conditions-section">
                    <h2>Condiciones del Cultivo</h2>
                    <p>Luz: {datos.luz}</p>
                    <p>Humedad del Suelo: {datos.humedad_suelo}</p>
                    <p>Temperatura: {datos.temperatura}</p>
                    <p>Humedad Ambiental: {datos.humedad_ambiental}</p>
                    <p>Predicción de Condiciones: {datos.predicciones}</p>
                    <p>Presencia de Enfermedades: {datos.enfermedad ? "Sí" : "No"}</p>
                </div>
                <div className="recommendations-section">
                    <h2>Recomendaciones</h2>
                    <p>{datos.recomendacion.condiciones}</p>
                    <p>{datos.recomendacion.fertilizacion}</p>
                    <p>{datos.recomendacion.enfermedad}</p>
                </div>
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </div>
        </CSSTransition>
    );
}

export default Desoname;


