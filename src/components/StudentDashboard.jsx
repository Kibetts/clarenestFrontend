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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardData) return <div className="no-data">No data available</div>;

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
      <header className="dashboard-header">
        <h1>Welcome, {student.name}</h1>
        <div className="student-info">
          <span className="grade-level">Grade {student.grade}</span>
          <span className="notification-badge">
            {unreadMessages} new messages
          </span>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Schedule Section */}
        <section className="dashboard-section schedule">
          <h2>Today's Schedule</h2>
          <div className="schedule-timeline">
            {schedule[0]?.lessons.map(lesson => (
              <div key={lesson._id} className="schedule-item">
                <div className="time-slot">
                  {new Date(lesson.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(lesson.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="lesson-info">
                  <h4>{lesson.subject.title}</h4>
                  <p>Tutor: {lesson.tutor.name}</p>
                </div>
              </div>
            ))}
            {schedule[0]?.lessons.length === 0 && (
              <p className="no-lessons">No lessons scheduled for today</p>
            )}
          </div>
        </section>
            
          {/*upcoming-lessons section*/}
        <section className="dashboard-section upcoming-lessons">
        <h2>Upcoming Lessons</h2>
        <div className="lessons-list">
          {upcomingLessons.map(lesson => (
            <div key={lesson._id} className="lesson-card">
              <div className="lesson-header">
                <h4>{lesson.subject.title}</h4>
                <span className="time">
                  {new Date(lesson.startTime).toLocaleString()}
                </span>
              </div>
              <div className="lesson-details">
                <p>Tutor: {lesson.tutor.name}</p>
                <p>Duration: {lesson.duration} minutes</p>
              </div>
            </div>
          ))}
          {upcomingLessons.length === 0 && (
            <p className="no-lessons">No upcoming lessons scheduled</p>
          )}
        </div>
      </section>

        {/* Academic Progress Section */}
        <section className="dashboard-section academic-progress">
          <h2>Academic Progress</h2>
          <div className="progress-stats">
            <div className="stat-card">
              <h3>Overall Grade</h3>
              <span className="grade">{overallGrade ? `${overallGrade.toFixed(1)}%` : 'N/A'}</span>
              </div>
            <div className="stat-card">
              <h3>Attendance</h3>
              <span className="attendance">{(attendance.percentage || 0).toFixed(1)}%</span>
              </div>
          </div>
          
          <div className="recent-grades">
            <h3>Recent Grades</h3>
            <div className="grades-list">
              {recentGrades.map(grade => (
                <div key={grade._id} className="grade-item">
                  <span className="subject">{grade.subject.title}</span>
                  <span className="score">{grade.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Tasks Section */}
        <section className="dashboard-section upcoming-tasks">
          <h2>Upcoming Tasks</h2>
          
          <div className="tasks-container">
            <div className="assignments">
              <h3>Assignments Due</h3>
              <ul className="tasks-list">
                {activeAssignments.map(assignment => (
                  <li key={assignment._id} className="task-item">
                    <div className="task-info">
                      <h4>{assignment.title}</h4>
                      <p>{assignment.subject.title}</p>
                    </div>
                    <div className="due-date">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="assessments">
              <h3>Upcoming Assessments</h3>
              <ul className="tasks-list">
                {upcomingAssessments.map(assessment => (
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

        {/* Course Materials Section */}
        <section className="dashboard-section materials">
          <h2>Course Materials</h2>
          <div className="materials-grid">
            {courseMaterials.map(material => (
              <div key={material._id} className="material-card">
                <div className="material-icon">
                  {material.type === 'document' && '📄'}
                  {material.type === 'video' && '🎥'}
                  {material.type === 'link' && '🔗'}
                </div>
                <div className="material-info">
                  <h4>{material.title}</h4>
                  <p>{material.subject.title}</p>
                  <span className="upload-date">
                    Added: {new Date(material.createdAt).toLocaleDateString()}
                  </span>
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
                </div>
                <div className="announcement-content">
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