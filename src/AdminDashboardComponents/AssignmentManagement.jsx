import React, { useState, useEffect } from 'react';
import '../css/AssignmentManagement.css';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '',
    dueDate: '',
    totalPoints: ''
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchAssignments();
    fetchClasses();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/assignments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data.data.assignments || []);
    } catch (error) {
      showAlert('Failed to fetch assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lessons', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data.data.lessons || []);
    } catch (error) {
      showAlert('Failed to fetch classes', 'error');
    }
  };

  const handleOpenDialog = (mode, assignment = null) => {
    setDialogMode(mode);
    setSelectedAssignment(assignment);
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        class: assignment.class._id,
        dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
        totalPoints: assignment.totalPoints
      });
    } else {
      setFormData({
        title: '',
        description: '',
        class: '',
        dueDate: '',
        totalPoints: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAssignment(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showAlert('Please enter an assignment title', 'error');
      return false;
    }
    if (!formData.class) {
      showAlert('Please select a class', 'error');
      return false;
    }
    if (!formData.totalPoints || formData.totalPoints <= 0) {
      showAlert('Please enter valid total points', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = dialogMode === 'add'
        ? 'http://localhost:5000/api/assignments'
        : `http://localhost:5000/api/assignments/${selectedAssignment._id}`;
      
      const method = dialogMode === 'add' ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save assignment');

      showAlert(
        `Assignment successfully ${dialogMode === 'add' ? 'created' : 'updated'}`,
        'success'
      );
      handleCloseDialog();
      fetchAssignments();
    } catch (error) {
      showAlert(`Failed to ${dialogMode} assignment`, 'error');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete assignment');

      showAlert('Assignment successfully deleted', 'success');
      fetchAssignments();
    } catch (error) {
      showAlert('Failed to delete assignment', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 3000);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="assignment-management">
      <div className="header">
        <h2>Assignment Management</h2>
        <button 
          className="add-button"
          onClick={() => handleOpenDialog('add')}
        >
          + Create Assignment
        </button>
      </div>

      <div className="table-container">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Class</th>
              <th>Due Date</th>
              <th>Total Points</th>
              <th>Submissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No assignments found
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.class?.name || 'N/A'}</td>
                  <td>
                    {new Date(assignment.dueDate).toLocaleString()}
                  </td>
                  <td>{assignment.totalPoints}</td>
                  <td>
                    <span className="submission-count">
                      {assignment.submissions?.length || 0}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="edit-button"
                      onClick={() => handleOpenDialog('edit', assignment)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAssignment(assignment._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{dialogMode === 'add' ? 'Create New Assignment' : 'Edit Assignment'}</h3>
              <button className="close-button" onClick={handleCloseDialog}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Assignment Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="class">Class</label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((class_) => (
                    <option key={class_._id} value={class_._id}>
                      {class_.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalPoints">Total Points</label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  value={formData.totalPoints}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={handleCloseDialog}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {dialogMode === 'add' ? 'Create' : 'Save'}
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

export default AssignmentManagement;