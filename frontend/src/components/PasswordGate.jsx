import React, { useState } from 'react';
import './PasswordGate.css';

const PasswordGate = ({ onAuthenticated }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'hunzaden') {
            onAuthenticated();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="password-gate">
            <div className="password-card">
                <div className="password-header">
                    <h1 className="password-title">Hunza Den</h1>
                    <p className="password-subtitle">Review Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label className="password-label">Developer Access</label>
                        <input
                            type="password"
                            className="password-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                    </div>

                    {error && <div className="password-error">{error}</div>}

                    <button type="submit" className="password-submit">
                        Access System
                    </button>
                </form>

                <div className="password-footer">
                    <p>🔒 Secure Access Required</p>
                </div>
            </div>
        </div>
    );
};

export default PasswordGate;
