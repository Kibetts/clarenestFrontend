import React, { useState, useEffect } from 'react';
import '../css/ClassManagement.css';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    tutor: '',
    schedule: [],
    capacity: '',
    gradeLevel: ''
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchClasses();
    fetchTutors();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lessons', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setClasses(data.data.lessons);
    } catch (error) {
      showAlert('Failed to fetch classes', 'error');
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tutors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTutors(data.data.tutors);
    } catch (error) {
      showAlert('Failed to fetch tutors', 'error');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSubjects(data.data.subjects);
    } catch (error) {
      showAlert('Failed to fetch subjects', 'error');
    }
  };

  const handleOpenDialog = (mode, classItem = null) => {
    setDialogMode(mode);
    setSelectedClass(classItem);
    if (classItem) {
      setFormData({
        name: classItem.name,
        subject: classItem.subject._id,
        tutor: classItem.tutor._id,
        schedule: classItem.schedule,
        capacity: classItem.capacity,
        gradeLevel: classItem.gradeLevel
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        tutor: '',
        schedule: [],
        capacity: '',
        gradeLevel: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClass(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = dialogMode === 'add'
        ? 'http://localhost:5000/api/lessons'
        : `http://localhost:5000/api/lessons/${selectedClass._id}`;
      
      const method = dialogMode === 'add' ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save class');

      showAlert(
        `Class successfully ${dialogMode === 'add' ? 'added' : 'updated'}`,
        'success'
      );
      handleCloseDialog();
      fetchClasses();
    } catch (error) {
      showAlert(`Failed to ${dialogMode} class`, 'error');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/lessons/${classId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete class');

      showAlert('Class successfully deleted', 'success');
      fetchClasses();
    } catch (error) {
      showAlert('Failed to delete class', 'error');
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

  return (
    <div className="class-management">
      <div className="header">
        <h2>Class Management</h2>
        <button 
          className="add-button"
          onClick={() => handleOpenDialog('add')}
        >
          + Add Class
        </button>
      </div>

      <div className="table-container">
        <table className="classes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Tutor</th>
              <th>Grade Level</th>
              <th>Capacity</th>
              <th>Current Enrollment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem._id}>
                <td>{classItem.name}</td>
                <td>{classItem.subject?.title}</td>
                <td>{classItem.tutor?.name}</td>
                <td>{classItem.gradeLevel}</td>
                <td>{classItem.capacity}</td>
                <td>
                  <div className="enrollment-status">
                    <div className="enrollment-bar">
                      <div 
                        className="enrollment-fill"
                        style={{ 
                          width: `${(classItem.currentEnrollment / classItem.capacity) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span>{classItem.currentEnrollment}</span>
                  </div>
                </td>
                <td className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleOpenDialog('edit', classItem)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClass(classItem._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{dialogMode === 'add' ? 'Add New Class' : 'Edit Class'}</h3>
              <button className="close-button" onClick={handleCloseDialog}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Class Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tutor">Tutor</label>
                <select
                  id="tutor"
                  name="tutor"
                  value={formData.tutor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gradeLevel">Grade Level</label>
                <input
                  type="number"
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={handleCloseDialog}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {dialogMode === 'add' ? 'Add Class' : 'Save Changes'}
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

export default ClassManagement;