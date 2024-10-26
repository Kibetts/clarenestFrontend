import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/AccountCreation.css'

const AccountCreation = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [error, setError] = useState('');
  const { token, role } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/create-${role}-account/${token}`, {
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
        alert('Account created successfully! Please check your email to verify your account.');
        navigate('/login');
      } else {
        setError(data.message || 'Error creating account');
      }
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="account-creation">
      <h2>Create Your Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Password</label>
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
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
              required
            />
            I agree to the terms and conditions
          </label>
        </div>
        <button type="submit" disabled={!formData.agreedToTerms}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default AccountCreation;