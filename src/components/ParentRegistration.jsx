import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ParentRegistration.css';

const ParentRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        relationship: 'Parent'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { studentId } = useParams();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || 
            !formData.password || !formData.confirmPassword || !formData.relationship) {
            setError('Please fill in all required fields');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid phone number');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setShowConfirmation(true);
    };

    // const confirmSubmission = async () => {
    //     try {
    //         setLoading(true);
    //         setError('');

    //         const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/parents/register/${studentId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 name: formData.name,
    //                 email: formData.email,
    //                 phone: formData.phone,
    //                 password: formData.password,
    //                 relationship: formData.relationship
    //             }),
    //             credentials: 'include'
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             throw new Error(data.message || 'Registration failed');
    //         }

    //         // Attempt automatic login after successful registration
    //         const loginResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 email: formData.email,
    //                 password: formData.password
    //             }),
    //             credentials: 'include'
    //         });

    //         const loginData = await loginResponse.json();

    //         if (loginResponse.ok) {
    //             // Store token in localStorage
    //             localStorage.setItem('token', loginData.token);
    //             navigate('/parent-dashboard');
    //         } else {
    //             navigate('/login');
    //         }
    //     } catch (err) {
    //         setError(err.message || 'Error registering parent account. Please try again.');
    //     } finally {
    //         setLoading(false);
    //         setShowConfirmation(false);
    //     }
    // };

    const confirmSubmission = async () => {
        try {
            setLoading(true);
            setError('');
    
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/parents/register/${studentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    relationship: formData.relationship
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
    
            // Store token from registration response
            if (data.data && data.data.token) {
                localStorage.setItem('token', data.data.token);
                // Navigate to dashboard directly since we already have the token
                navigate('/parent-dashboard');
            } else {
                // Fallback to login if no token
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Error registering parent account. Please try again.');
        } finally {
            setLoading(false);
            setShowConfirmation(false);
        }
    };

    return (
        <div className="parent-reg">
            <div className="parent-reg-container">
                <div className="parent-reg-card">
                    <h2 className="parent-reg-title">Parent Registration</h2>
                    
                    {error && (
                        <div className="parent-reg-error">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="parent-reg-form">
                        <div className="parent-reg-field">
                            <label className="parent-reg-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="parent-reg-input"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="parent-reg-field">
                            <label className="parent-reg-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="parent-reg-input"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="parent-reg-field">
                            <label className="parent-reg-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="parent-reg-input"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="+1234567890"
                            />
                        </div>

                        <div className="parent-reg-field">
                            <label className="parent-reg-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="parent-reg-input"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        <div className="parent-reg-field">
                            <label className="parent-reg-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="parent-reg-input"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        <div className="parent-reg-field">
                            <label className="parent-reg-label">Relationship to Student</label>
                            <select
                                name="relationship"
                                className="parent-reg-select"
                                value={formData.relationship}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            >
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className={`parent-reg-submit ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>

            {showConfirmation && (
                <div className="parent-reg-modal-overlay">
                    <div className="parent-reg-modal">
                        <h3 className="parent-reg-modal-title">Confirm Registration</h3>
                        <p className="parent-reg-modal-text">
                            Please verify that the following information is correct:
                        </p>
                        <div className="parent-reg-modal-details">
                            <div className="parent-reg-modal-field">
                                <span className="parent-reg-modal-label">Name:</span>
                                <span className="parent-reg-modal-value">{formData.name}</span>
                            </div>
                            <div className="parent-reg-modal-field">
                                <span className="parent-reg-modal-label">Email:</span>
                                <span className="parent-reg-modal-value">{formData.email}</span>
                            </div>
                            <div className="parent-reg-modal-field">
                                <span className="parent-reg-modal-label">Phone:</span>
                                <span className="parent-reg-modal-value">{formData.phone}</span>
                            </div>
                            <div className="parent-reg-modal-field">
                                <span className="parent-reg-modal-label">Relationship:</span>
                                <span className="parent-reg-modal-value">{formData.relationship}</span>
                            </div>
                        </div>
                        <div className="parent-reg-modal-actions">
                            <button 
                                className="parent-reg-modal-cancel"
                                onClick={() => setShowConfirmation(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="parent-reg-modal-confirm"
                                onClick={confirmSubmission}
                                disabled={loading}
                            >
                                Confirm & Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentRegistration;