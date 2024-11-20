import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/TutorDashboard.css';

const TutorDashboard = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard/tutor', {
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

    if (loading) return <div className="tutor-loading">Loading...</div>;
    if (error) return <div className="tutor-error">{error}</div>;
    if (!dashboardData) return <div className="tutor-no-data">No data available</div>;

    const {
        tutor,
        dashboard: {
            activeClasses,
            pendingAssignments,
            assessments,
            recentSubmissions,
            studentPerformance,
            attendanceStats,
            schedule,
            unreadMessages,
            announcements
        }
    } = dashboardData;

    return (
        <div className="tutor-dashboard">
            <header className="tutor-header">
                <div className="tutor-header-content">
                    <h1 className="tutor-welcome">Welcome, {tutor.name}</h1>
                    <div className="tutor-info">
                        <span className="tutor-rating">Rating: {(tutor.rating || 0).toFixed(1)} ⭐</span>
                        <span className="tutor-messages">{unreadMessages} unread messages</span>
                    </div>
                </div>
            </header>

            <div className="tutor-grid">
                {/* Active Classes Section */}
                <section className="tutor-classes-section">
                    <h2 className="tutor-section-title">Active Classes</h2>
                    <div className="tutor-classes-grid">
                        {activeClasses.map(class_ => (
                            <div key={class_._id} className="tutor-class-card">
                                <div className="tutor-class-header">
                                    <h3 className="tutor-class-title">{class_.subject.title}</h3>
                                    <span className="tutor-student-count">
                                        {class_.students.length} students
                                    </span>
                                </div>
                                <div className="tutor-class-details">
                                    <p className="tutor-class-time">
                                        Time: {new Date(class_.startTime).toLocaleTimeString()}
                                    </p>
                                    <p className="tutor-class-grade">
                                        Grade: {class_.subject.gradeLevel}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pending Tasks Section */}
                <section className="tutor-tasks-section">
                    <h2 className="tutor-section-title">Pending Tasks</h2>
                    
                    <div className="tutor-tasks-container">
                        <div className="tutor-assignments">
                            <h3 className="tutor-tasks-subtitle">
                                Assignments to Review ({pendingAssignments.length})
                            </h3>
                            <ul className="tutor-tasks-list">
                                {pendingAssignments.map(assignment => (
                                    <li key={assignment._id} className="tutor-task-item">
                                        <div className="tutor-task-info">
                                            <h4 className="tutor-task-title">{assignment.title}</h4>
                                            <p className="tutor-task-subject">
                                                {assignment.subject.title}
                                            </p>
                                        </div>
                                        <span className="tutor-submission-count">
                                            {assignment.submissions.length} submissions
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="tutor-assessments">
                            <h3 className="tutor-tasks-subtitle">
                                Pending Assessments ({assessments.pending.length})
                            </h3>
                            <ul className="tutor-tasks-list">
                                {assessments.pending.map(assessment => (
                                    <li key={assessment._id} className="tutor-task-item">
                                        <div className="tutor-task-info">
                                            <h4 className="tutor-task-title">{assessment.title}</h4>
                                            <p className="tutor-task-subject">
                                                {assessment.subject.title}
                                            </p>
                                        </div>
                                        <div className="tutor-task-due">
                                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Student Performance Section */}
                <section className="tutor-performance-section">
                    <h2 className="tutor-section-title">Student Performance</h2>
                    <div className="tutor-performance-grid">
                        {studentPerformance.map(performance => (
                            <div key={performance._id} className="tutor-subject-performance">
                                <h3 className="tutor-subject-title">{performance._id}</h3>
                                <div className="tutor-performance-stats">
                                    <div className="tutor-stat">
                                        <span className="tutor-stat-label">Average Score</span>
                                        <span className="tutor-stat-value">
                                            {(performance.averageScore || 0).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="tutor-stat">
                                        <span className="tutor-stat-label">Total Students</span>
                                        <span className="tutor-stat-value">
                                            {performance.totalStudents}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Attendance Overview Section */}
                <section className="tutor-attendance-section">
                    <h2 className="tutor-section-title">Attendance Overview</h2>
                    <div className="tutor-attendance-stats">
                        {attendanceStats.map(stat => (
                            <div key={stat._id} className="tutor-attendance-card">
                                <h4 className="tutor-attendance-type">{stat._id}</h4>
                                <div className="tutor-attendance-value">{stat.count}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Weekly Schedule Section */}
                <section className="tutor-schedule-section">
                    <h2 className="tutor-section-title">Weekly Schedule</h2>
                    <div className="tutor-schedule-grid">
                        {schedule.map(day => (
                            <div key={day._id} className="tutor-schedule-day">
                                <h3 className="tutor-day-title">{day._id}</h3>
                                <div className="tutor-day-lessons">
                                    {day.lessons.map(lesson => (
                                        <div key={lesson._id} className="tutor-schedule-lesson">
                                            <span className="tutor-lesson-time">
                                                {new Date(lesson.startTime).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            <span className="tutor-lesson-subject">
                                                {lesson.subject.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Submissions Section */}
                <section className="tutor-submissions-section">
                    <h2 className="tutor-section-title">Recent Submissions</h2>
                    <div className="tutor-submissions-list">
                        {recentSubmissions.map(submission => (
                            <div key={submission._id} className="tutor-submission-card">
                                <div className="tutor-submission-header">
                                    <h4 className="tutor-submission-title">
                                        {submission.subject.title}
                                    </h4>
                                    <span className="tutor-submission-date">
                                        {new Date(submission.submissions[0].submissionDate)
                                            .toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="tutor-submission-student">
                                    <span>{submission.submissions[0].student.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Announcements Section */}
                <section className="tutor-announcements-section">
                    <h2 className="tutor-section-title">Announcements</h2>
                    <div className="tutor-announcements-list">
                        {announcements.map(announcement => (
                            <div key={announcement._id} className="tutor-announcement-card">
                                <div className="tutor-announcement-header">
                                    <span className="tutor-announcement-date">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={`tutor-announcement-priority ${announcement.priority}`}>
                                        {announcement.priority}
                                    </span>
                                </div>
                                <div className="tutor-announcement-content">
                                    {announcement.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Analytics Section */}
                <section className="tutor-analytics-section">
                    <h2 className="tutor-section-title">Class Analytics</h2>
                    <div className="tutor-analytics-grid">
                        {/* Performance Trends */}
                        <div className="tutor-analytics-card">
                            <h3 className="tutor-analytics-title">Performance Trends</h3>
                            <div className="tutor-performance-trends">
                                {studentPerformance.map(subject => (
                                    <div key={subject._id} className="tutor-trend-item">
                                        <div className="tutor-trend-header">
                                            <span className="tutor-trend-subject">{subject._id}</span>
                                            <span className="tutor-trend-score">
                                                {subject.averageScore.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="tutor-trend-bar">
                                            <div 
                                                className="tutor-trend-fill" 
                                                style={{ width: `${subject.averageScore}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attendance Charts */}
                        <div className="tutor-analytics-card">
                            <h3 className="tutor-analytics-title">Attendance Overview</h3>
                            <div className="tutor-attendance-chart">
                                {Object.entries(attendanceStats.reduce((acc, stat) => {
                                    acc[stat._id] = stat.count;
                                    return acc;
                                }, {})).map(([status, count]) => (
                                    <div key={status} className="tutor-chart-bar">
                                        <div 
                                            className={`tutor-bar-fill ${status.toLowerCase()}`} 
                                            style={{ 
                                                height: `${(count / attendanceStats.reduce(
                                                    (sum, s) => sum + s.count, 0)) * 100}%` 
                                            }}
                                        />
                                        <span className="tutor-bar-label">{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Quick Actions Panel */}
            <aside className="tutor-actions-panel">
                <h3 className="tutor-actions-title">Quick Actions</h3>
                <div className="tutor-action-buttons">
    <button 
        className="tutor-action-btn"
        onClick={() => navigate('/tutor/create-assignment')}
    >
        Create Assignment
    </button>
    <button 
        className="tutor-action-btn"
        onClick={() => navigate('/tutor/schedule-assessment')}
    >
        Schedule Assessment
    </button>
    <button 
        className="tutor-action-btn"
        onClick={() => navigate('/tutor/mark-attendance')}
    >
        Mark Attendance
    </button>
    <button 
        className="tutor-action-btn"
        onClick={() => navigate('/tutor/messages')}
    >
        Send Message
    </button>
</div>
            </aside>
        </div>
    );
};

export default TutorDashboard;