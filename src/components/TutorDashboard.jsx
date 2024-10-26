import React, { useState, useEffect } from 'react';
import '../css/TutorDashboard.css';

const TutorDashboard = () => {
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardData) return <div className="no-data">No data available</div>;

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
      <header className="dashboard-header">
        <h1>Welcome, {tutor.name}</h1>
        <div className="tutor-info">
        <span className="rating">Rating: {(tutor.rating || 0).toFixed(1)} ⭐</span>
        <span className="message-badge">{unreadMessages} unread messages</span>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Active Classes Section */}
        <section className="dashboard-section active-classes">
          <h2>Active Classes</h2>
          <div className="classes-grid">
            {activeClasses.map(class_ => (
              <div key={class_._id} className="class-card">
                <div className="class-header">
                  <h3>{class_.subject.title}</h3>
                  <span className="student-count">
                    {class_.students.length} students
                  </span>
                </div>
                <div className="class-details">
                  <p>Time: {new Date(class_.startTime).toLocaleTimeString()}</p>
                  <p>Grade: {class_.subject.gradeLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Tasks Section */}
        <section className="dashboard-section pending-tasks">
          <h2>Pending Tasks</h2>
          
          <div className="tasks-container">
            <div className="assignments">
              <h3>Assignments to Review ({pendingAssignments.length})</h3>
              <ul className="tasks-list">
                {pendingAssignments.map(assignment => (
                  <li key={assignment._id} className="task-item">
                    <div className="task-info">
                      <h4>{assignment.title}</h4>
                      <p>{assignment.subject.title}</p>
                    </div>
                    <span className="submission-count">
                      {assignment.submissions.length} submissions
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="assessments">
              <h3>Pending Assessments ({assessments.pending.length})</h3>
              <ul className="tasks-list">
                {assessments.pending.map(assessment => (
                  <li key={assessment._id} className="task-item">
                    <div className="task-info">
                      <h4>{assessment.title}</h4>
                      <p>{assessment.subject.title}</p>
                    </div>
                    <div className="due-date">
                      Due: {new Date(assessment.dueDate).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Student Performance Section */}
        <section className="dashboard-section performance">
          <h2>Student Performance</h2>
          <div className="performance-grid">
            {studentPerformance.map(performance => (
              <div key={performance._id} className="subject-performance">
                <h3>{performance._id}</h3>
                <div className="performance-stats">
                  <div className="stat">
                    <span className="label">Average Score</span>
                    <span className="value">{(performance.averageScore || 0).toFixed(1)}%</span>
                    </div>
                  <div className="stat">
                    <span className="label">Total Students</span>
                    <span className="value">{performance.totalStudents}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Attendance Overview Section */}
        <section className="dashboard-section attendance">
          <h2>Attendance Overview</h2>
          <div className="attendance-stats">
            {attendanceStats.map(stat => (
              <div key={stat._id} className="attendance-card">
                <h4>{stat._id}</h4>
                <div className="stat-value">{stat.count}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="dashboard-section schedule">
          <h2>Weekly Schedule</h2>
          <div className="schedule-grid">
            {schedule.map(day => (
              <div key={day._id} className="schedule-day">
                <h3>{day._id}</h3>
                <div className="day-lessons">
                  {day.lessons.map(lesson => (
                    <div key={lesson._id} className="schedule-lesson">
                      <span className="time">
                        {new Date(lesson.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="subject">{lesson.subject.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Submissions Section */}
        <section className="dashboard-section recent-submissions">
          <h2>Recent Submissions</h2>
          <div className="submissions-list">
            {recentSubmissions.map(submission => (
              <div key={submission._id} className="submission-card">
                <div className="submission-header">
                  <h4>{submission.subject.title}</h4>
                  <span className="submission-date">
                    {new Date(submission.submissions[0].submissionDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="student-info">
                  <span>{submission.submissions[0].student.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
         {/* Announcements Section */}
         <section className="dashboard-section announcements">
          <h2>Announcements</h2>
          <div className="announcements-list">
            {announcements.map(announcement => (
              <div key={announcement._id} className="announcement-card">
               <div className="announcement-header">
                  <span className="date">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`priority ${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                </div>
                <div className="announcement-content">
                  {announcement.message}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Section */}
        <section className="dashboard-section analytics">
          <h2>Class Analytics</h2>
          <div className="analytics-grid">
            {/* Performance Trends */}
            <div className="analytics-card">
              <h3>Performance Trends</h3>
              <div className="performance-stats">
                {studentPerformance.map(subject => (
                  <div key={subject._id} className="trend-item">
                    <div className="trend-header">
                      <span>{subject._id}</span>
                      <span className="trend-score">{subject.averageScore.toFixed(1)}%</span>
                    </div>
                    <div className="trend-bar">
                      <div 
                        className="trend-fill" 
                        style={{ width: `${subject.averageScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Overview */}
            <div className="analytics-card">
              <h3>Attendance Overview</h3>
              <div className="attendance-overview">
                <div className="attendance-chart">
                  {Object.entries(attendanceStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                  }, {})).map(([status, count]) => (
                    <div key={status} className="chart-bar">
                      <div 
                        className={`bar-fill ${status.toLowerCase()}`} 
                        style={{ 
                          height: `${(count / attendanceStats.reduce((sum, s) => sum + s.count, 0)) * 100}%` 
                        }}
                      />
                      <span className="bar-label">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Actions Panel */}
      <aside className="quick-actions-panel">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn">
            Create Assignment
          </button>
          <button className="action-btn">
            Schedule Assessment
          </button>
          <button className="action-btn">
            Mark Attendance
          </button>
          <button className="action-btn">
            Send Message
          </button>
        </div>
      </aside>
    </div>
  );
};

export default TutorDashboard;