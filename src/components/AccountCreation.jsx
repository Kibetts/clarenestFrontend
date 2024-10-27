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
    // Validate that we have both token and role
    if (!token || !role) {
      setError('Invalid account creation link');
    } else {
      console.log('Valid parameters received:', { role, token });
    }
  }, [token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {

      //to remove console logs
      console.log('Attempting account creation for:', role);
      console.log('Using token:', token);

      const endpoint = `http://localhost:5000/api/auth/create-${role}-account/${token}`;
      console.log('Making request to:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        alert('Account created successfully! Please check your email to verify your account.');
        navigate('/login');
      } else {
        setError(data.message || 'Error creating account');
      }
    } catch (err) {
      console.error('Account creation error:', err);
      setError('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !role) {
    return (
      <div className="account-creation">
        <h2>Invalid Account Creation Link</h2>
        <p>Please check your email and try again with the correct link.</p>
      </div>
    );
  }

  return (
  <>
    <div className="account-creation">
      <h2>Create Your {role.charAt(0).toUpperCase() + role.slice(1)} Account</h2>
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
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label >Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
            minLength="8"
            disabled={loading}
          />
        </div>
        <div className="form-group">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
              required
              disabled={loading}
            />
          <label>
            I agree to the terms and conditions
          </label>
        </div>
        <button 
          type="submit" 
          disabled={!formData.agreedToTerms || loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
    </> 
    );
  
};

export default AccountCreation;