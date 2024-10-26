import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EmailVerification.css'

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setStatus('error');
      setError('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="email-verification">
      <h2>Email Verification</h2>
      {status === 'verifying' && (
        <div className="verification-status">
          <div className="loading-spinner"></div>
          <p>Verifying your email...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="verification-status success">
          <i className="fas fa-check-circle"></i>
          <p>Email verified successfully!</p>
          <p>You will be redirected to login shortly...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="verification-status error">
          <i className="fas fa-times-circle"></i>
          <p>{error}</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;