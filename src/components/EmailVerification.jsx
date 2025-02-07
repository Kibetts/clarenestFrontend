import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EmailVerification.css';

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
            const response = await fetch(`https://clarenest-6bd4.onrender.com/api/auth/verify-email/${token}`, {
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
            <div className="email-verification-container">
                <h2 className="email-verification-title">Email Verification</h2>
                
                {status === 'verifying' && (
                    <div className="email-verification-status verifying">
                        <div className="email-verification-spinner"></div>
                        <p className="email-verification-message">Verifying your email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="email-verification-status success">
                        <div className="email-verification-icon success">✓</div>
                        <p className="email-verification-message">Email verified successfully!</p>
                        <p className="email-verification-redirect">
                            You will be redirected to login shortly...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="email-verification-status error">
                        <div className="email-verification-icon error">✕</div>
                        <p className="email-verification-message">{error}</p>
                        <button 
                            className="email-verification-button"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;