import React, { useState } from 'react';
import axios from 'axios';
import Desoname from './Desoname';
import Login from './Login';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

function XD() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [inProp, setInProp] = useState(true);

    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setInProp(true);
        } catch (error) {
            console.error('Error en el inicio de sesión:','Usuario:', username, error);
            alert('Usuario o contraseña incorrectos');} 
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setInProp(true);
    };

    return (
        <div className="App">
            <TransitionGroup>
                <CSSTransition
                    key={token ? 'desoname' : 'login'}
                    timeout={500}
                    classNames="fade"
                >
                    {token ? (
                        <Desoname token={token} onLogout={handleLogout} />
                    ) : (
                        <Login onLogin={handleLogin} />
                    )}
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

export default XD;
