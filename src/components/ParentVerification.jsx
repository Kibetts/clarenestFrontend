import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ParentVerification.css';

const ParentVerification = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState('pending');
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/parents/verify/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('An error occurred during verification. Please try again.');
        }
    };

    return (
        <div className="parent-verify">
            <div className="parent-verify-container">
                <h2 className="parent-verify-title">Complete Parent Account Setup</h2>
                
                {status === 'pending' && (
                    <form onSubmit={handleSubmit} className="parent-verify-form">
                        {error && (
                            <div className="parent-verify-error">
                                {error}
                            </div>
                        )}
                        
                        <div className="parent-verify-field">
                            <label className="parent-verify-label">Create Password</label>
                            <input
                                type="password"
                                className="parent-verify-input"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                                minLength="8"
                            />
                        </div>
                        
                        <div className="parent-verify-field">
                            <label className="parent-verify-label">Confirm Password</label>
                            <input
                                type="password"
                                className="parent-verify-input"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                required
                                minLength="8"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="parent-verify-button"
                        >
                            Complete Verification
                        </button>
                    </form>
                )}
                
                {status === 'success' && (
                    <div className="parent-verify-success">
                        <div className="parent-verify-icon">✓</div>
                        <p className="parent-verify-message">Account verified successfully!</p>
                        <p className="parent-verify-redirect">You will be redirected to login shortly...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentVerification;