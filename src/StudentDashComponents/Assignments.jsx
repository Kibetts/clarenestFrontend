import React, { useState, useEffect } from 'react';
import '../css/Assignments.css';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionFiles, setSubmissionFiles] = useState([]);
    const [submissionText, setSubmissionText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard/student/assignments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }

            const data = await response.json();
            setAssignments(data.data.assignments);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const validTypes = ['application/pdf', 'application/msword', 
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'image/jpeg', 'image/jpg'];
            return validTypes.includes(file.type);
        });

        if (validFiles.length !== files.length) {
            alert('Some files were not added. Only PDF, DOC, DOCX, and JPG files are allowed.');
        }

        setSubmissionFiles(validFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            submissionFiles.forEach(file => {
                formData.append('files', file);
            });
            formData.append('content', submissionText);

            const response = await fetch(
                `http://localhost:5000/api/assignments/${selectedAssignment._id}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                }
            );

            if (!response.ok) throw new Error('Failed to submit assignment');

            // Update the assignments list
            await fetchAssignments();
            setShowSubmissionModal(false);
            setSubmissionFiles([]);
            setSubmissionText('');

            // Show success message
            alert('Assignment submitted successfully!');
        } catch (err) {
            alert('Error submitting assignment: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    const getSubmissionStatus = (assignment) => {
        if (assignment.submissions?.find(sub => sub.student === localStorage.getItem('userId'))) {
            return 'submitted';
        }
        if (isOverdue(assignment.dueDate)) {
            return 'overdue';
        }
        return 'pending';
    };

    if (loading) return <div className="assignments-loading">Loading...</div>;
    if (error) return <div className="assignments-error">{error}</div>;

    return (
        <div className="assignments-container">
            <header className="assignments-header">
                <h2>Assignments</h2>
            </header>

            <div className="assignments-content">
                <div className="assignments-tabs">
                    <button className="tab active">Active</button>
                    <button className="tab">Submitted</button>
                    <button className="tab">Graded</button>
                </div>

                <div className="assignments-list">
                    {assignments.map(assignment => (
                        <div 
                            key={assignment._id} 
                            className={`assignment-card ${getSubmissionStatus(assignment)}`}
                        >
                            <div className="assignment-header">
                                <h3>{assignment.title}</h3>
                                <span className={`status-badge ${getSubmissionStatus(assignment)}`}>
                                    {getSubmissionStatus(assignment)}
                                </span>
                            </div>

                            <div className="assignment-body">
                                <p className="assignment-description">
                                    {assignment.description}
                                </p>
                                <div className="assignment-meta">
                                    <span className="assignment-subject">
                                        {assignment.subject.title}
                                    </span>
                                    <span className="assignment-points">
                                        Points: {assignment.totalPoints}
                                    </span>
                                </div>
                                <div className="assignment-due">
                                    Due: {formatDate(assignment.dueDate)}
                                </div>
                            </div>

                            <div className="assignment-actions">
                                {getSubmissionStatus(assignment) === 'pending' && (
                                    <button 
                                        className="submit-btn"
                                        onClick={() => {
                                            setSelectedAssignment(assignment);
                                            setShowSubmissionModal(true);
                                        }}
                                    >
                                        Submit Assignment
                                    </button>
                                )}
                                {getSubmissionStatus(assignment) === 'submitted' && (
                                    <button className="view-submission-btn">
                                        View Submission
                                    </button>
                                )}
                                {assignment.gradedSubmission && (
                                    <div className="grade-info">
                                        Grade: {assignment.gradedSubmission.grade} / {assignment.totalPoints}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showSubmissionModal && (
                <div className="submission-modal">
                    <div className="submission-content">
                        <button 
                            className="close-modal"
                            onClick={() => setShowSubmissionModal(false)}
                        >
                            ×
                        </button>
                        <h3>Submit Assignment: {selectedAssignment.title}</h3>
                        
                        <form onSubmit={handleSubmit} className="submission-form">
                            <div className="form-group">
                                <label>Submission Files</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                                    className="file-input"
                                />
                                <div className="file-list">
                                    {submissionFiles.map((file, index) => (
                                        <div key={index} className="file-item">
                                            {file.name}
                                            <button
                                                type="button"
                                                onClick={() => setSubmissionFiles(files => 
                                                    files.filter((_, i) => i !== index)
                                                )}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Additional Comments</label>
                                <textarea
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    placeholder="Add any comments about your submission..."
                                    rows="4"
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    onClick={() => setShowSubmissionModal(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="submit-btn"
                                    disabled={submitting || 
                                        (submissionFiles.length === 0 && !submissionText.trim())}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;