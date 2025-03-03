import React, { useState, useEffect } from 'react';
import '../css/MarkAttendance.css';

const MarkAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch classes');

            const data = await response.json();
            setClasses(data.data.lessons);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/lessons/${selectedClass}/students`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch students');

            const data = await response.json();
            setStudents(data.data.students);
            setAttendance(data.data.students.map(student => ({
                student: student._id,
                status: 'Present',
                note: ''
            })));
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => prev.map(record => 
            record.student === studentId ? { ...record, status } : record
        ));
    };

    const handleNoteChange = (studentId, note) => {
        setAttendance(prev => prev.map(record => 
            record.student === studentId ? { ...record, note } : record
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/attendances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    lesson: selectedClass,
                    date,
                    attendees: attendance
                })
            });

            if (!response.ok) throw new Error('Failed to submit attendance');

            // Show success alert
            const alertDiv = document.createElement('div');
            alertDiv.className = 'mark-attendance-alert success';
            alertDiv.textContent = 'Attendance marked successfully!';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);

            // Reset form
            setSelectedClass('');
            setStudents([]);
            setAttendance([]);

        } catch (err) {
            console.error('Error submitting attendance:', err);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'mark-attendance-alert error';
            alertDiv.textContent = 'Failed to submit attendance';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);
        }
    };

    if (loading) return <div className="mark-attendance-loading">Loading...</div>;
    if (error) return <div className="mark-attendance-error">{error}</div>;

    return (
        <div className="mark-attendance-container">
            <div className="mark-attendance-header">
                <h2>Mark Attendance</h2>
            </div>

            <form onSubmit={handleSubmit} className="mark-attendance-form">
                <div className="mark-attendance-form-row">
                    <div className="mark-attendance-form-group">
                        <label>Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            required
                        >
                            <option value="">Select a class</option>
                            {classes.map(class_ => (
                                <option key={class_._id} value={class_._id}>
                                    {class_.name} - {class_.subject.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mark-attendance-form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {selectedClass && students.length > 0 && (
                    <div className="mark-attendance-students">
                        <h3>Students</h3>
                        <div className="mark-attendance-table">
                            <div className="mark-attendance-table-header">
                                <div>Student Name</div>
                                <div>Status</div>
                                <div>Note</div>
                            </div>
                            {students.map(student => (
                                <div key={student._id} className="mark-attendance-table-row">
                                    <div>{student.name}</div>
                                    <div>
                                        <select
                                            value={attendance.find(a => a.student === student._id)?.status || 'Present'}
                                            onChange={(e) => handleStatusChange(student._id, e.target.value)}
                                            className={`mark-attendance-status ${attendance.find(a => a.student === student._id)?.status.toLowerCase()}`}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Late">Late</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={attendance.find(a => a.student === student._id)?.note || ''}
                                            onChange={(e) => handleNoteChange(student._id, e.target.value)}
                                            placeholder="Add note (optional)"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mark-attendance-form-actions">
                    <button 
                        type="button" 
                        onClick={() => window.history.back()}
                        className="mark-attendance-cancel-btn"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="mark-attendance-submit-btn"
                        disabled={!selectedClass || students.length === 0}
                    >
                        Submit Attendance
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MarkAttendance;