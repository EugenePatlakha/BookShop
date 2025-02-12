import React, { useState } from 'react';
import '../styles/Modal.css';

const LoginModal = ({ onClose, onRegister, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const resetFields = () => {
        setEmail('');
        setPassword('');
    };

    const validateFields = () => {
        if (!email || !password) {
            setError('Email and password are required');
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        if (!validateFields()) return;

        const result = await onLogin({ email, password });
        if (result.success) {
            resetFields();
            onClose();
        } else {
            setError(result.error || 'An unexpected error occurred');
        }
    };

    return (
        <div className="modal-overlay" onClick={() => { resetFields(); onClose(); }}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Login</h2>
                {error && <p className="modal-error-message">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setError('')}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setError('')}
                />
                <button className="modal-button" onClick={handleLogin}>Submit</button>
                <p>
                    Don't have an account?{' '}
                    <span className="modal-link" onClick={() => { resetFields(); onClose(); onRegister(); }}>
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
