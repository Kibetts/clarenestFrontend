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
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
    
            const data = await response.json();
            console.log('Login response:', data);
    
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
    
            // Check if the token is in the expected location
            const token = data.token || data.data?.token;
            const userRole = data.data?.user?.role || data.user?.role;
    
            if (!token || !userRole) {
                throw new Error('Invalid response structure');
            }
    
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
    
            // Redirect based on user role
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
        <div className="login-container">
            <h2>Login</h2>
            <form >
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
            <p>
                Don't have an account? Apply as a{' '}
                <Link className='login-options' to="/apply/student">student</Link> or{' '}
                <Link className='login-options' to="/apply/tutor">tutor</Link>.
            </p>
        </div>
    );
}

export default Login;