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
        subjects: [],
        temporaryAccessDuration: '' 
    });
    const [filters, setFilters] = useState({
        search: '',
        role: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data.data.users);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
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
            password: '',
            phoneNumber: '',
            grade: '',
            subjects: []
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'subjects') {
            const subjects = value.split(',').map(s => s.trim());
            setFormData(prev => ({ ...prev, subjects }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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

  const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;
      return matchesSearch && matchesRole;
  });

  if (loading) return <div className="user-mgmt-loading">Loading...</div>;
  if (error) return <div className="user-mgmt-error">{error}</div>;

  return (
      <div className="user-mgmt">
          <div className="user-mgmt-header">
              <h2 className="user-mgmt-title">User Management</h2>
              <button 
                  className="user-mgmt-add-btn"
                  onClick={() => handleShowModal('add')}
              >
                  Add New User
              </button>
          </div>

          <div className="user-mgmt-filters">
              <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="user-mgmt-search"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <select 
                  className="user-mgmt-role-filter"
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="tutor">Tutors</option>
                  <option value="parent">Parents</option>
                  <option value="admin">Admins</option>
              </select>
          </div>

          <div className="user-mgmt-table-container">
              <table className="user-mgmt-table">
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
                      {filteredUsers.map(user => (
                          <tr key={user._id}>
                              <td className="user-mgmt-name">{user.name}</td>
                              <td className="user-mgmt-email">{user.email}</td>
                              <td>
                                  <span className={`user-mgmt-role-badge ${user.role}`}>
                                      {user.role}
                                  </span>
                              </td>
                              <td>
                                  <span className={`user-mgmt-status-badge ${user.status}`}>
                                      {user.status}
                                  </span>
                              </td>
                              <td className="user-mgmt-actions">
                                  <button
                                      className="user-mgmt-edit-btn"
                                      onClick={() => handleShowModal('edit', user)}
                                  >
                                      Edit
                                  </button>
                                  {user.role === 'student' && (
                                      <button
                                          className={`user-mgmt-fee-btn ${user.feesPaid ? 'paid' : 'unpaid'}`}
                                          onClick={() => handleUpdateFeeStatus(user._id, !user.feesPaid)}
                                      >
                                          {user.feesPaid ? 'Paid' : 'Unpaid'}
                                      </button>
                                  )}
                                  <button
                                      className="user-mgmt-delete-btn"
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

          {/* User Modal */}
          {showModal && (
              <div className="user-mgmt-modal-overlay">
                  <div className="user-mgmt-modal">
                      <div className="user-mgmt-modal-header">
                          <h3>{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h3>
                          <button 
                              className="user-mgmt-modal-close"
                              onClick={() => setShowModal(false)}
                          >
                              ×
                          </button>
                      </div>
                      <form onSubmit={handleSubmit} className="user-mgmt-form">
                      <div className="user-mgmt-form-group">
                                <label className="user-mgmt-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="user-mgmt-input"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="user-mgmt-form-group">
                                <label className="user-mgmt-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="user-mgmt-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="user-mgmt-form-group">
                                <label className="user-mgmt-label">Role</label>
                                <select
                                    name="role"
                                    className="user-mgmt-select"
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

                            <div className="user-mgmt-form-group">
                                <label className="user-mgmt-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    className="user-mgmt-input"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {formData.role === 'student' && (
                                <div className="user-mgmt-form-group">
                                    <label className="user-mgmt-label">Grade</label>
                                    <select
                                        name="grade"
                                        className="user-mgmt-select"
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
                                <div className="user-mgmt-form-group">
                                    <label className="user-mgmt-label">
                                        Subjects (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="subjects"
                                        className="user-mgmt-input"
                                        value={formData.subjects.join(', ')}
                                        onChange={handleInputChange}
                                        placeholder="Math, Science, English"
                                    />
                                </div>
                            )}

                            {modalMode === 'add' && (
                                <div className="user-mgmt-form-group">
                                    <label className="user-mgmt-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="user-mgmt-input"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="user-mgmt-modal-actions">
                                <button 
                                    type="button" 
                                    className="user-mgmt-cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="user-mgmt-submit-btn"
                                >
                                    {modalMode === 'add' ? 'Add User' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {alert.show && (
                <div className={`user-mgmt-alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
        </div>
    );
};

export default UserManagement;