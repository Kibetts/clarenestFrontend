import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            console.log('Login response:', data); // For debugging
    
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
    
            if (!data.token) {
                throw new Error('No token received from server');
            }
    
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.data.user.id);
            localStorage.setItem('role', data.data.user.role);
    
            // Navigate based on role
            const role = data.data.user.role;
            switch (role) {
                case 'student':
                    navigate('/dashboard/student');
                    break;
                case 'tutor':
                    navigate('/dashboard/tutor');
                    break;
                case 'parent':
                    navigate('/dashboard/parent');
                    break;
                case 'admin':
                    navigate('/dashboard/admin');
                    break;
                default:
                    throw new Error('Invalid user role');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login">
            <div className="login-wrapper">
                <div className="login-card">
                    <h2 className="login-title">Welcome Back</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label className="login-label" htmlFor="email">Email</label>
                            <input
                                className="login-input"
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form-group">
                            <label className="login-label" htmlFor="password">Password</label>
                            <input
                                className="login-input"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="login-error">{error}</p>}
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <p className="login-register-text">
                        Don't have an account? Apply as a{' '}
                        <Link className="login-link" to="/apply/student">student</Link> or{' '}
                        <Link className="login-link" to="/apply/tutor">tutor</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;