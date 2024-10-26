import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ParentVerification.css'

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
    <div className="parent-verification">
      <h2>Complete Parent Account Setup</h2>
      {status === 'pending' && (
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Create Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength="8"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              minLength="8"
            />
          </div>
          <button type="submit">Complete Verification</button>
        </form>
      )}
      {status === 'success' && (
        <div className="verification-status success">
          <i className="fas fa-check-circle"></i>
          <p>Account verified successfully!</p>
          <p>You will be redirected to login shortly...</p>
        </div>
      )}
    </div>
  );
};

export default ParentVerification;