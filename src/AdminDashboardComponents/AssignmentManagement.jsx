import React, { useState, useEffect } from 'react';
import '../css/AssignmentManagement.css';

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        class: '',
        dueDate: '',
        totalPoints: '',
        assignmentFile: null
    });
    const [submissions, setSubmissions] = useState([]);
    const [viewSubmissions, setViewSubmissions] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchAssignments(),
                fetchClasses()
            ]);
            setError(null);
        } catch (err) {
            setError('Failed to load required data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        const response = await fetch('http://localhost:5000/api/assignments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch assignments');
        const data = await response.json();
        setAssignments(data.data.assignments);
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
            
            // Create array of grade levels 1-12
            const gradeLevels = Array.from({ length: 12 }, (_, i) => ({
                _id: (i + 1).toString(),
                name: `Grade ${i + 1}`
            }));
            
            setClasses(gradeLevels);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data.data.assignment.submissions || []);
    };

    const handleShowModal = (mode, assignment = null) => {
        setModalMode(mode);
        setSelectedAssignment(assignment);
        if (assignment) {
            setFormData({
                title: assignment.title,
                description: assignment.description,
                class: assignment.class._id,
                dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
                totalPoints: assignment.totalPoints,
                assignmentFile: null
            });
        } else {
            setFormData({
                title: '',
                description: '',
                class: '',
                dueDate: '',
                totalPoints: '',
                assignmentFile: null
            });
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                assignmentFile: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        if (!formData.title || !formData.class || !formData.dueDate || !formData.totalPoints) {
            showAlert('Please fill in all required fields', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formDataObj = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'assignmentFile') {
                    if (formData[key]) {
                        formDataObj.append('file', formData[key]);
                    }
                } else {
                    formDataObj.append(key, formData[key]);
                }
            });

            const url = modalMode === 'add'
                ? 'http://localhost:5000/api/assignments'
                : `http://localhost:5000/api/assignments/${selectedAssignment._id}`;

            const response = await fetch(url, {
                method: modalMode === 'add' ? 'POST' : 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataObj
            });

            if (!response.ok) throw new Error('Failed to save assignment');
            
            showAlert(
                `Assignment successfully ${modalMode === 'add' ? 'created' : 'updated'}`,
                'success'
            );
            setShowModal(false);
            fetchAssignments();
        } catch (err) {
            showAlert(err.message, 'error');
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
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const handleViewSubmissions = async (assignmentId) => {
        try {
            await fetchSubmissions(assignmentId);
            setSelectedAssignment(assignments.find(a => a._id === assignmentId));
            setViewSubmissions(true);
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const handleGradeSubmission = async (assignmentId, submissionId, grade, feedback) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/assignments/${assignmentId}/submissions/${submissionId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ grade, feedback })
                }
            );

            if (!response.ok) throw new Error('Failed to grade submission');
            
            showAlert('Submission graded successfully', 'success');
            fetchSubmissions(assignmentId);
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    if (loading) return <div className="assignment-loading">Loading...</div>;
    if (error) return <div className="assignment-error">{error}</div>;

    return (
        <div className="assignment-mgmt">
            <div className="assignment-header">
                <h2>Assignment Management</h2>
                <button 
                    className="assignment-add-btn"
                    onClick={() => handleShowModal('add')}
                >
                    Add New Assignment
                </button>
            </div>

            <div className="assignment-grid">
                {assignments.map(assignment => (
                    <div key={assignment._id} className="assignment-card">
                        <div className="assignment-card-header">
                            <h3>{assignment.title}</h3>
                            <div className="assignment-meta">
                                <span className="assignment-class">
                                    {assignment.class.name}
                                </span>
                                <span className="assignment-due">
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        
                        <div className="assignment-content">
                            <p>{assignment.description}</p>
                            <div className="assignment-points">
                                Total Points: {assignment.totalPoints}
                            </div>
                        </div>

                        <div className="assignment-submissions-info">
                            <span>
                                Submissions: {assignment.submissions?.length || 0}
                            </span>
                            <button
                                className="assignment-view-btn"
                                onClick={() => handleViewSubmissions(assignment._id)}
                            >
                                View Submissions
                            </button>
                        </div>

                        <div className="assignment-actions">
                            <button
                                className="assignment-edit-btn"
                                onClick={() => handleShowModal('edit', assignment)}
                            >
                                Edit
                            </button>
                            <button
                                className="assignment-delete-btn"
                                onClick={() => handleDeleteAssignment(assignment._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assignment Modal */}
            {showModal && (
                <div className="assignment-modal-overlay">
                    <div className="assignment-modal">
                        <div className="assignment-modal-header">
                            <h3>{modalMode === 'add' ? 'Add New Assignment' : 'Edit Assignment'}</h3>
                            <button 
                                className="assignment-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="assignment-form">
                            <div className="assignment-form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="assignment-form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            </div>

                            <div className="assignment-form-group">
                                <label>Class</label>
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(classItem => (
                                        <option key={classItem._id} value={classItem._id}>
                                            {classItem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="assignment-form-group">
                                <label>Due Date</label>
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="assignment-form-group">
                                <label>Total Points</label>
                                <input
                                    type="number"
                                    name="totalPoints"
                                    value={formData.totalPoints}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="assignment-form-group">
                                <label>Assignment File (Optional)</label>
                                <input
                                    type="file"
                                    name="assignmentFile"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="assignment-modal-actions">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="assignment-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="assignment-submit-btn"
                                >
                                    {modalMode === 'add' ? 'Create Assignment' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submissions Modal */}
            {viewSubmissions && (
                <div className="assignment-modal-overlay">
                    <div className="assignment-modal submissions-modal">
                        <div className="assignment-modal-header">
                            <h3>Assignment Submissions</h3>
                            <button 
                                className="assignment-modal-close"
                                onClick={() => setViewSubmissions(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="assignment-submissions-list">
                            {submissions.length === 0 ? (
                                <p className="no-submissions">No submissions yet</p>
                            ) : (
                                submissions.map(submission => (
                                    <div key={submission._id} className="submission-card">
                                        <div className="submission-header">
                                            <span className="submission-student">
                                                {submission.student.name}
                                            </span>
                                            <span className="submission-date">
                                                Submitted: {new Date(submission.submissionDate)
                                                    .toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        {submission.files?.map((file, index) => (
                                            <div key={index} className="submission-file">
                                                <span>{file.filename}</span>
                                                <a 
                                                    href={`/api/assignments/download/${file.path}`}
                                                    download
                                                    className="download-button"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        ))}

                                        <div className="submission-grading">
                                            <input
                                                type="number"
                                                placeholder="Grade"
                                                value={submission.grade || ''}
                                                onChange={(e) => handleGradeSubmission(
                                                    selectedAssignment._id,
                                                    submission._id,
                                                    e.target.value,
                                                    submission.feedback
                                                )}
                                                max={selectedAssignment?.totalPoints}
                                                className="grade-input"
                                            />
                                            <textarea
                                                placeholder="Feedback"
                                                value={submission.feedback || ''}
                                                onChange={(e) => handleGradeSubmission(
                                                    selectedAssignment._id,
                                                    submission._id,
                                                    submission.grade,
                                                    e.target.value
                                                )}
                                                className="feedback-input"
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {alert.show && (<div className={`assignment-alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
        </div>
    );
};

export default AssignmentManagement;