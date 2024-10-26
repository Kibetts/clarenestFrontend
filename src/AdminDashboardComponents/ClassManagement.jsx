import React, { useState, useEffect } from 'react';
import '../css/ClassManagement.css';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    tutor: '',
    gradeLevel: '',
    capacity: '',
    schedule: [{
      day: 'Monday',
      startTime: '',
      endTime: ''
    }]
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchClasses(),
        fetchTutors(),
        fetchSubjects()
      ]);
      setError(null);
    } catch (err) {
      setError('Failed to load required data');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    const response = await fetch('http://localhost:5000/api/lessons', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch classes');
    const data = await response.json();
    setClasses(data.data.lessons);
  };

  const fetchTutors = async () => {
    const response = await fetch('http://localhost:5000/api/tutors', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch tutors');
    const data = await response.json();
    setTutors(data.data.tutors);
  };

  const fetchSubjects = async () => {
    const response = await fetch('http://localhost:5000/api/subjects', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch subjects');
    const data = await response.json();
    setSubjects(data.data.subjects);
  };

  const handleShowModal = (mode, classItem = null) => {
    setModalMode(mode);
    setSelectedClass(classItem);
    if (classItem) {
      setFormData({
        name: classItem.name,
        subject: classItem.subject._id,
        tutor: classItem.tutor._id,
        gradeLevel: classItem.gradeLevel,
        capacity: classItem.capacity,
        schedule: classItem.schedule
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        tutor: '',
        gradeLevel: '',
        capacity: '',
        schedule: [{
          day: 'Monday',
          startTime: '',
          endTime: ''
        }]
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = {
      ...newSchedule[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      schedule: newSchedule
    }));
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          day: 'Monday',
          startTime: '',
          endTime: ''
        }
      ]
    }));
  };

  const removeScheduleSlot = (index) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        schedule: newSchedule
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.subject || !formData.tutor || 
        !formData.gradeLevel || !formData.capacity) {
      showAlert('Please fill in all required fields', 'error');
      return false;
    }

    const validSchedule = formData.schedule.every(slot => 
      slot.day && slot.startTime && slot.endTime
    );
    if (!validSchedule) {
      showAlert('Please fill in all schedule slots', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = modalMode === 'add'
        ? 'http://localhost:5000/api/lessons'
        : `http://localhost:5000/api/lessons/${selectedClass._id}`;

      const response = await fetch(url, {
        method: modalMode === 'add' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save class');
      
      showAlert(
        `Class successfully ${modalMode === 'add' ? 'created' : 'updated'}`,
        'success'
      );
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      showAlert(err.message, 'error');
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
    <div className="class-management">
      <div className="header">
        <h2>Class Management</h2>
        <button 
          className="add-button"
          onClick={() => handleShowModal('add')}
        >
          Add New Class
        </button>
      </div>

      <div className="classes-grid">
        {classes.map(classItem => (
          <div key={classItem._id} className="class-card">
            <div className="class-header">
              <h3>{classItem.name}</h3>
              <div className="class-actions">
                <button
                  className="edit-button"
                  onClick={() => handleShowModal('edit', classItem)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClass(classItem._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="class-info">
              <p><strong>Subject:</strong> {classItem.subject.title}</p>
              <p><strong>Tutor:</strong> {classItem.tutor.name}</p>
              <p><strong>Grade Level:</strong> {classItem.gradeLevel}</p>
              <div className="capacity-info">
                <span>Capacity: {classItem.currentEnrollment}/{classItem.capacity}</span>
                <div className="capacity-bar">
                  <div 
                    className="capacity-fill"
                    style={{
                      width: `${(classItem.currentEnrollment / classItem.capacity) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="schedule-info">
              <h4>Schedule</h4>
              {classItem.schedule.map((slot, index) => (
                <div key={index} className="schedule-slot">
                  <span>{slot.day}</span>
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Add New Class' : 'Edit Class'}</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tutor</label>
                <select
                  name="tutor"
                  value={formData.tutor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Tutor</option>
                  {tutors.map(tutor => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Grade Level</label>
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Grade</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Grade {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Schedule</label>
                <div className="schedule-slots">
                  {formData.schedule.map((slot, index) => (
                    <div key={index} className="schedule-slot">
                      <select
                        value={slot.day}
                        onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                        required
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                          .map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))
                        }
                      </select>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                        required
                      />
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                        required
                      />
                      {formData.schedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScheduleSlot(index)}
                          className="remove-slot"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addScheduleSlot}
                    className="add-slot"
                  >
                    + Add Schedule Slot
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {modalMode === 'add' ? 'Create Class' : 'Save Changes'}
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