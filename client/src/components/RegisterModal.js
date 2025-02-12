import React, { useState } from 'react';
import '../styles/Modal.css';

const RegisterModal = ({ onClose, onLogin, onRegister }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const resetFields = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    const validateFields = () => {
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateFields()) return;

        const result = await onRegister({ firstName, lastName, email, password });
        if (result.success) {
            resetFields();
            onClose();
        } else {
            setError(result.error || 'An unexpected error occurred');
        }
    };

    return (
        <div className="modal-overlay" onClick={() => { resetFields(); onClose();}}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Register</h2>
                {error && <p className="modal-error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setError('')}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setError('')}
                />
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
                <button className="modal-button" onClick={handleRegister}>Submit</button>
                <p>
                    Already have an account?{' '}
                    <span className="modal-link" onClick={() => { resetFields(); onClose(); onLogin(); }}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;
