import React, { useState, useEffect } from 'react';
import '../css/StudentDashboard.css';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard/student', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            setDashboardData(data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="student-loading">Loading...</div>;
    if (error) return <div className="student-error">{error}</div>;
    if (!dashboardData) return <div className="student-no-data">No data available</div>;

    const {
        student,
        dashboard: {
            upcomingLessons,
            activeAssignments,
            upcomingAssessments,
            recentGrades,
            overallGrade,
            attendance,
            courseMaterials,
            unreadMessages,
            announcements,
            schedule
        }
    } = dashboardData;

    return (
        <div className="student-dashboard">
            <header className="student-header">
                <div className="student-header-content">
                    <h1 className="student-welcome">Welcome, {student.name}</h1>
                    <div className="student-info">
                        <span className="student-grade">Grade {student.grade}</span>
                        <span className="student-messages">
                            {unreadMessages} new messages
                        </span>
                    </div>
                </div>
            </header>

            <div className="student-grid">
                {/* Schedule Section */}
                <section className="student-schedule-section">
                    <h2 className="student-section-title">Today's Schedule</h2>
                    <div className="student-timeline">
                        {schedule[0]?.lessons.map(lesson => (
                            <div key={lesson._id} className="student-timeline-item">
                                <div className="student-timeline-time">
                                    {new Date(lesson.startTime).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                    {' - '}
                                    {new Date(lesson.endTime).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </div>
                                <div className="student-timeline-content">
                                    <h4 className="student-timeline-subject">{lesson.subject.title}</h4>
                                    <p className="student-timeline-tutor">Tutor: {lesson.tutor.name}</p>
                                </div>
                            </div>
                        ))}
                        {schedule[0]?.lessons.length === 0 && (
                            <p className="student-no-lessons">No lessons scheduled for today</p>
                        )}
                    </div>
                </section>

                {/* Upcoming Lessons Section */}
                <section className="student-lessons-section">
                    <h2 className="student-section-title">Upcoming Lessons</h2>
                    <div className="student-lessons-grid">
                        {upcomingLessons.map(lesson => (
                            <div key={lesson._id} className="student-lesson-card">
                                <div className="student-lesson-header">
                                    <h4 className="student-lesson-title">{lesson.subject.title}</h4>
                                    <span className="student-lesson-time">
                                        {new Date(lesson.startTime).toLocaleString()}
                                    </span>
                                </div>
                                <div className="student-lesson-details">
                                    <p className="student-lesson-tutor">Tutor: {lesson.tutor.name}</p>
                                    <p className="student-lesson-duration">
                                        Duration: {lesson.duration} minutes
                                    </p>
                                </div>
                            </div>
                        ))}
                        {upcomingLessons.length === 0 && (
                            <p className="student-no-lessons">No upcoming lessons scheduled</p>
                        )}
                    </div>
                </section>

                {/* Academic Progress Section */}
                <section className="student-progress-section">
                    <h2 className="student-section-title">Academic Progress</h2>
                    <div className="student-progress-stats">
                        <div className="student-stat-card">
                            <h3 className="student-stat-title">Overall Grade</h3>
                            <span className="student-grade-value">
                                {overallGrade ? `${overallGrade.toFixed(1)}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="student-stat-card">
                            <h3 className="student-stat-title">Attendance</h3>
                            <span className="student-attendance-value">
                                {(attendance.percentage || 0).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    
                    <div className="student-grades">
                        <h3 className="student-grades-title">Recent Grades</h3>
                        <div className="student-grades-list">
                            {recentGrades.map(grade => (
                                <div key={grade._id} className="student-grade-item">
                                    <span className="student-grade-subject">
                                        {grade.subject.title}
                                    </span>
                                    <span className="student-grade-score">
                                        {grade.score}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tasks Section */}
                <section className="student-tasks-section">
                    <h2 className="student-section-title">Upcoming Tasks</h2>
                    
                    <div className="student-tasks-container">
                        <div className="student-assignments">
                            <h3 className="student-tasks-subtitle">Assignments Due</h3>
                            <ul className="student-tasks-list">
                                {activeAssignments.map(assignment => (
                                    <li key={assignment._id} className="student-task-item">
                                        <div className="student-task-info">
                                            <h4 className="student-task-title">{assignment.title}</h4>
                                            <p className="student-task-subject">
                                                {assignment.subject.title}
                                            </p>
                                        </div>
                                        <div className="student-task-due">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="student-assessments">
                            <h3 className="student-tasks-subtitle">Upcoming Assessments</h3>
                            <ul className="student-tasks-list">
                                {upcomingAssessments.map(assessment => (
                                    <li key={assessment._id} className="student-task-item">
                                        <div className="student-task-info">
                                            <h4 className="student-task-title">{assessment.title}</h4>
                                            <p className="student-task-subject">
                                                {assessment.subject.title}
                                            </p>
                                        </div>
                                        <div className="student-task-due">
                                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Course Materials Section */}
                <section className="student-materials-section">
                    <h2 className="student-section-title">Course Materials</h2>
                    <div className="student-materials-grid">
                        {courseMaterials.map(material => (
                            <div key={material._id} className="student-material-card">
                                <div className="student-material-icon">
                                    {material.type === 'document' && '📄'}
                                    {material.type === 'video' && '🎥'}
                                    {material.type === 'link' && '🔗'}
                                </div>
                                <div className="student-material-info">
                                    <h4 className="student-material-title">{material.title}</h4>
                                    <p className="student-material-subject">
                                        {material.subject.title}
                                    </p>
                                    <span className="student-material-date">
                                        Added: {new Date(material.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Announcements Section */}
                <section className="student-announcements-section">
                    <h2 className="student-section-title">Announcements</h2>
                    <div className="student-announcements-list">
                        {announcements.map(announcement => (
                            <div key={announcement._id} className="student-announcement-card">
                                <div className="student-announcement-header">
                                    <span className="student-announcement-date">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="student-announcement-content">
                                    {announcement.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;