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
        if (!token) {
            setError('Missing token in account creation link');
            return;
        }
        
        if (!role) {
            setError('Missing role in account creation link');
            return;
        }

        const validRoles = ['student', 'tutor', 'parent'];
        if (!validRoles.includes(role.toLowerCase())) {
            setError(`Invalid role: ${role}. Expected one of: ${validRoles.join(', ')}`);
            return;
        }

        // If we get here, clear any existing error
        setError('');
    }, [token, role]);

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        // Log initial values
        console.log('Starting account creation with:', {
            role,
            token,
            passwordLength: formData.password.length
        });
    
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
            let endpoint;
            // Log the role being checked
            console.log('Checking role:', role.toLowerCase());
            
            if (role.toLowerCase() === 'parent') {
                endpoint = `http://localhost:5000/api/parents/create-account/${token}`;
            } else {
                endpoint = `http://localhost:5000/api/auth/create-${role.toLowerCase()}-account/${token}`;
            }
            
            console.log('Using endpoint:', endpoint);
    
            const requestBody = {
                password: formData.password
            };
            console.log('Request body:', requestBody);
    
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Raw response:', responseText);
    
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Parsed response data:', data);
            } catch (error) {
                console.error('Failed to parse response:', error);
                throw new Error('Invalid server response format');
            }
    
            if (response.ok) {
                console.log('Account creation successful');
                alert(data.message || 'Account created successfully! Please check your email to verify your account.');
                navigate('/login');
            } else {
                console.error('Server returned error:', data);
                throw new Error(data.message || 'Failed to create account');
            }
        } catch (err) {
            console.error('Account creation error:', {
                error: err,
                message: err.message,
                stack: err.stack
            });
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