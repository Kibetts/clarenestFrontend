import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SuccessPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="success-container">
      <div className="success-box">
        <h1 className="success-title">Application Submitted Successfully!</h1>
        <p className="success-message">
          Thank you for your application. We have received your submission and will get back to you shortly.
        </p>
        <button className="success-button" onClick={handleGoBack}>
          Go Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
