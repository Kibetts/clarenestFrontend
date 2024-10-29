import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/AccountCreation.css';

const AccountCreation = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        agreedToTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token, role } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !role) {
            setError('Invalid account creation link');
        }
    }, [token, role]);

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }
    
        try {
            // Update this endpoint construction
            const endpoint = `https://clarenest.onrender.com/api/auth/create-${role.toLowerCase()}-account/${token}`;
            
            console.log('Submitting to endpoint:', endpoint); // Debug log
    
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Add Accept header
                },
                body: JSON.stringify({
                    password: formData.password
                })
            });
    
            // First log the raw response
            const responseText = await response.text();
            console.log('Raw response:', responseText);
    
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error('Failed to parse response:', error);
                throw new Error('Invalid server response format');
            }
    
            if (response.ok) {
                alert('Account created successfully! Please check your email to verify your account.');
                navigate('/login');
            } else {
                throw new Error(data.message || 'Failed to create account');
            }
        } catch (err) {
            console.error('Account creation error:', err);
            setError(err.message || 'Error creating account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token || !role) {
        return (
            <div className="account-creation">
                <div className="account-creation-error">
                    <h2 className="account-creation-error-title">Invalid Account Creation Link</h2>
                    <p className="account-creation-error-message">
                        Please check your email and try again with the correct link.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="account-creation">
            <div className="account-creation-container">
                <h2 className="account-creation-title">
                    Create Your {role.charAt(0).toUpperCase() + role.slice(1)} Account
                </h2>
                
                {error && (
                    <div className="account-creation-error">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="account-creation-form">
                    <div className="account-creation-field">
                        <label className="account-creation-label">Password</label>
                        <input
                            type="password"
                            className="account-creation-input"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                            minLength="8"
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                        <small className="password-requirements">
                            Password must be at least 8 characters long
                        </small>
                    </div>
                    
                    <div className="account-creation-field">
                        <label className="account-creation-label">Confirm Password</label>
                        <input
                            type="password"
                            className="account-creation-input"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                            minLength="8"
                            disabled={loading}
                            placeholder="Confirm your password"
                        />
                    </div>
                    
                    <div className="account-creation-terms">
                        <label className="account-creation-checkbox-label">
                            <input
                                type="checkbox"
                                className="account-creation-checkbox"
                                checked={formData.agreedToTerms}
                                onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                                required
                                disabled={loading}
                            />
                            I agree to the terms and conditions
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`account-creation-button ${loading ? 'loading' : ''}`}
                        disabled={!formData.agreedToTerms || loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountCreation;