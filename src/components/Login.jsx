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
            const response = await fetch('https://clarenest.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
    
            const token = data.token || data.data?.token;
            const userRole = data.data?.user?.role || data.user?.role;
    
            if (!token || !userRole) {
                throw new Error('Invalid response structure');
            }
    
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
    
            switch (userRole) {
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
                    navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password');
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