import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ParentRegistration.css';

const ParentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: ''
  });
  const [error, setError] = useState('');
  const { studentId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/parents/register/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please check your email to verify your account.');
        navigate('/');
      } else {
        setError(data.message || 'Error registering parent account');
      }
    } catch (err) {
      setError('Error registering parent account. Please try again.');
    }
  };

  return (
    <div className="parent-registration">
      <h2>Parent Registration</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Relationship to Student</label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({...formData, relationship: e.target.value})}
            required
          >
            <option value="">Select Relationship</option>
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default ParentRegistration;