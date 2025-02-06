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
        const response = await fetch('${process.env.BACKEND_URL}/api/lessons', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data = await response.json();
        setClasses(data.data.lessons);
    };

    const fetchTutors = async () => {
        const response = await fetch('${process.env.BACKEND_URL}/api/tutors', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch tutors');
        const data = await response.json();
        setTutors(data.data.tutors);
    };

    const fetchSubjects = async () => {
        const response = await fetch('${process.env.BACKEND_URL}/api/subjects', {
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
    
        // Convert numeric grade to proper format with suffix
        const formatGradeLevel = (grade) => {
            const num = parseInt(grade);
            if (num >= 1 && num <= 12) {
                const suffix = num === 1 ? 'st' : 
                              num === 2 ? 'nd' : 
                              num === 3 ? 'rd' : 'th';
                return `${num}${suffix}`;
            }
            return grade;
        };
    
        try {
            const formattedData = {
                ...formData,
                gradeLevel: formatGradeLevel(formData.gradeLevel)
            };
    
            const url = modalMode === 'add'
                ? '${process.env.BACKEND_URL}/api/lessons'
                : `${process.env.BACKEND_URL}/api/lessons/${selectedClass._id}`;
    
            const response = await fetch(url, {
                method: modalMode === 'add' ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formattedData)
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
            const response = await fetch(`${process.env.BACKEND_URL}/api/lessons/${classId}`, {
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

    if (loading) return <div className="class-mgmt-loading">Loading...</div>;
    if (error) return <div className="class-mgmt-error">{error}</div>;

    return (
        <div className="class-mgmt">
            <div className="class-mgmt-header">
                <h2>Class Management</h2>
                <button 
                    className="class-mgmt-add-btn"
                    onClick={() => handleShowModal('add')}
                >
                    Add New Class
                </button>
            </div>

            <div className="class-mgmt-grid">
                {classes.map(classItem => (
                    <div key={classItem._id} className="class-mgmt-card">
                        <div className="class-mgmt-card-header">
                            <h3>{classItem.name}</h3>
                            <div className="class-mgmt-card-actions">
                                <button
                                    className="class-mgmt-edit-btn"
                                    onClick={() => handleShowModal('edit', classItem)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="class-mgmt-delete-btn"
                                    onClick={() => handleDeleteClass(classItem._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="class-mgmt-card-info">
                            <p><strong>Subject:</strong> {classItem.subject.title}</p>
                            <p><strong>Tutor:</strong> {classItem.tutor.name}</p>
                            <p><strong>Grade Level:</strong> {classItem.gradeLevel}</p>
                            <div className="class-mgmt-capacity">
                                <span>Capacity: {classItem.currentEnrollment}/{classItem.capacity}</span>
                                <div className="class-mgmt-capacity-bar">
                                    <div 
                                        className="class-mgmt-capacity-fill"
                                        style={{
                                            width: `${(classItem.currentEnrollment / classItem.capacity) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="class-mgmt-schedule">
                            <h4>Schedule</h4>
                            {classItem.schedule.map((slot, index) => (
                                <div key={index} className="class-mgmt-schedule-slot">
                                    <span>{slot.day}</span>
                                    <span>{slot.startTime} - {slot.endTime}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="class-mgmt-modal-overlay">
                    <div className="class-mgmt-modal">
                        <div className="class-mgmt-modal-header">
                            <h3>{modalMode === 'add' ? 'Add New Class' : 'Edit Class'}</h3>
                            <button 
                                className="class-mgmt-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="class-mgmt-form">
                            <div className="class-mgmt-form-group">
                                <label>Class Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="class-mgmt-form-group">
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

                            <div className="class-mgmt-form-group">
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

                            <div className="class-mgmt-form-group">
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

                            <div className="class-mgmt-form-group">
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

                            <div className="class-mgmt-form-group">
                                <label>Schedule</label>
                                <div className="class-mgmt-schedule-slots">
                                    {formData.schedule.map((slot, index) => (
                                        <div key={index} className="class-mgmt-schedule-input">
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
                                                    className="class-mgmt-remove-slot"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addScheduleSlot}
                                        className="class-mgmt-add-slot"
                                    >
                                        + Add Schedule Slot
                                    </button>
                                </div>
                            </div>

                            <div className="class-mgmt-modal-actions">
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
                <div className={`class-mgmt-alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
        </div>
    );
};

export default ClassManagement;