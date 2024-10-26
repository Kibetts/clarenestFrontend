import React, { useState, useEffect } from 'react';
import '../css/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    phoneNumber: '',
    grade: '',
    subjects: []
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data.users);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setFormData(user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || '',
      grade: user.grade || '',
      subjects: user.subjects || [],
      password: ''
    } : {
      name: '',
      email: '',
      role: 'student',
      phoneNumber: '',
      grade: '',
      subjects: [],
      password: ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'subjects') {
      // Handle subjects as an array
      const subjects = e.target.value.split(',').map(s => s.trim());
      setFormData({ ...formData, subjects });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.role) {
      showAlert('Please fill in all required fields', 'error');
      return false;
    }
    if (modalMode === 'add' && !formData.password) {
      showAlert('Password is required for new users', 'error');
      return false;
    }
    if (formData.role === 'student' && !formData.grade) {
      showAlert('Grade is required for students', 'error');
      return false;
    }
    if (formData.role === 'tutor' && formData.subjects.length === 0) {
      showAlert('At least one subject is required for tutors', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = modalMode === 'add' 
        ? 'http://localhost:5000/api/users'
        : `http://localhost:5000/api/users/${selectedUser._id}`;

      const response = await fetch(url, {
        method: modalMode === 'add' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save user');
      
      showAlert(
        `User successfully ${modalMode === 'add' ? 'added' : 'updated'}`,
        'success'
      );
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      showAlert('User successfully deleted', 'success');
      fetchUsers();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const handleUpdateFeeStatus = async (userId, feesPaid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/update-fee-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ feesPaid })
        }
      );

      if (!response.ok) throw new Error('Failed to update fee status');
      
      showAlert('Fee status updated successfully', 'success');
      fetchUsers();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <div className="header">
        <h2>User Management</h2>
        <button 
          className="add-button"
          onClick={() => handleShowModal('add')}
        >
          Add New User
        </button>
      </div>

      <div className="user-filters">
        <input 
          type="text" 
          placeholder="Search users..." 
          className="search-input"
          onChange={(e) => {/* Add search functionality */}}
        />
        <select 
          className="role-filter"
          onChange={(e) => {/* Add filter functionality */}}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="parent">Parents</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleShowModal('edit', user)}
                  >
                    Edit
                  </button>
                  {user.role === 'student' && (
                    <button
                      className={`fee-button ${user.feesPaid ? 'paid' : 'unpaid'}`}
                      onClick={() => handleUpdateFeeStatus(user._id, !user.feesPaid)}
                    >
                      {user.feesPaid ? 'Paid' : 'Unpaid'}
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              {formData.role === 'student' && (
                <div className="form-group">
                  <label>Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Grade</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`${i + 1}`}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.role === 'tutor' && (
                <div className="form-group">
                  <label>Subjects (comma-separated)</label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects.join(', ')}
                    onChange={handleInputChange}
                    placeholder="Math, Science, English"
                  />
                </div>
              )}

              {modalMode === 'add' && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {modalMode === 'add' ? 'Add User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default UserManagement;