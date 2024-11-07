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
        <container>
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Usuario:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /> 
                </div>
                <br></br>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Entrar</button>
            <container>
                <center><h3>Internet Identity</h3></center>
                <center><AuthButton></AuthButton></center>
                </container>
            </form>
        </div>
        </container>
    );
}

export default Login;
