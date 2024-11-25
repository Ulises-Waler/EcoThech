import { AuthButton } from '@bundly/ic-react';
import React, { useState } from 'react';
import './Login.css'; 

function Login({ onLogin }) {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="login-container" >
            <h2 className='mt-5'>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Usuario:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <br />
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit">Entrar</button>
                <div>
                    <center><h3>Internet Identity</h3></center>
                    <center><AuthButton /></center>
                </div>
            </form>
        </div>
    );
}

export default Login;
