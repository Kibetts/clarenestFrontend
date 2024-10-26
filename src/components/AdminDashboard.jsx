import React, { useState, useEffect } from 'react';
import UserManagement from '../AdminDashboardComponents/UserManagement';
import ClassManagement from '../AdminDashboardComponents/ClassManagement';
import AssignmentManagement from '../AdminDashboardComponents/AssignmentManagement';
import FinanceManagement from '../AdminDashboardComponents/FinanceManagement';
import MessageCenter from '../AdminDashboardComponents/MessageCenter';
// import Calendar from './AdminDashboardComponents/Calendar';
import ApplicationManagement from '../AdminDashboardComponents/ApplicationManagement';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
};

  const menuItems = [
    { text: 'Home', icon: '🏠', value: 'home' },
    { text: 'User Management', icon: '👥', value: 'users' },
    { text: 'Applications', icon: '📝', value: 'applications' },
    { text: 'Class Management', icon: '📚', value: 'classes' },
    { text: 'Assignment Management', icon: '📋', value: 'assignments' },
    { text: 'Finances', icon: '💰', value: 'finances' },
    { text: 'Messages', icon: '💬', value: 'messages' },
  ];

  const renderHomeContent = () => {
    if (!dashboardData) return null;

    const {
      userStats,
      classStats,
      assessmentStats,
      financialStats,
      subjectPerformance,
      attendanceOverview,
      recentApplications,
      systemNotifications
    } = dashboardData;

    return (
      <div className="dashboard-home">
        <div className="stats-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Users Overview</h3>
              <div className="stat-content">
                <div className="stat-item">
                  <span>Total Students</span>
                  <span className="stat-value">{userStats.totalStudents}</span>
                </div>
                <div className="stat-item">
                  <span>Total Tutors</span>
                  <span className="stat-value">{userStats.totalTutors}</span>
                </div>
                <div className="stat-item">
                  <span>Total Parents</span>
                  <span className="stat-value">{userStats.totalParents}</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Financial Overview</h3>
              <div className="stat-content">
                <div className="stat-item">
                  <span>Total Fees</span>
                  <span className="stat-value">${financialStats.totalFees}</span>
                </div>
                <div className="stat-item">
                  <span>Total Paid</span>
                  <span className="stat-value">${financialStats.totalPaid}</span>
                </div>
                <div className="stat-item">
                  <span>Total Pending</span>
                  <span className="stat-value">${financialStats.totalPending}</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Class Overview</h3>
              <div className="stat-content">
                <div className="stat-item">
                  <span>Total Classes</span>
                  <span className="stat-value">{classStats.totalClasses}</span>
                </div>
                <div className="stat-item">
                  <span>Active Classes</span>
                  <span className="stat-value">{classStats.activeClasses}</span>
                </div>
                <div className="stat-item">
                  <span>Avg. Students/Class</span>
                  <span className="stat-value">
                    {classStats.averageStudentsPerClass[0]?.avgStudents.toFixed(1) || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="stat-card">
            <h3>Assessment Overview</h3>
            <div className="stat-content">
              <div className="stat-item">
                <span>Total Assessments</span>
                <span className="stat-value">{assessmentStats.totalAssessments}</span>
              </div>
              <div className="stat-item">
                <span>Average Score</span>
                <span className="stat-value">{assessmentStats.averageScore}%</span>
              </div>
              <div className="stat-item">
                <span>Pending Grading</span>
                <span className="stat-value">{assessmentStats.pendingGrading}</span>
              </div>
            </div>
          </div>
          </div>

          <div className="dashboard-sections">
            <div className="section-card">
              <h3>Recent Applications</h3>
              <div className="applications-list">
                <div className="application-type">
                  <h4>Student Applications</h4>
                  {recentApplications.students.map(app => (
                    <div key={app._id} className="application-item">
                      <span>{app.personalInfo.fullName}</span>
                      <span className={`status ${app.status}`}>{app.status}</span>
                    </div>
                  ))}
                </div>
                <div className="application-type">
                  <h4>Tutor Applications</h4>
                  {recentApplications.tutors.map(app => (
                    <div key={app._id} className="application-item">
                      <span>{app.personalInfo.fullName}</span>
                      <span className={`status ${app.status}`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-card">
            <h3>Attendance Overview</h3>
            <div className="attendance-overview">
              {attendanceOverview.map(record => (
                <div key={record.class} className="attendance-item">
                  <div className="class-info">
                    <span className="class-name">{record.class}</span>
                    <span className="attendance-rate">
                      {record.attendanceRate}% Present
                    </span>
                  </div>
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill"
                      style={{ width: `${record.attendanceRate}%` }}
                    />
                  </div>
                  <div className="attendance-details">
                    <span>Present: {record.present}</span>
                    <span>Absent: {record.absent}</span>
                    <span>Late: {record.late}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div className="section-card">
              <h3>Subject Performance</h3>
              <div className="performance-chart">
                {subjectPerformance.map(subject => (
                  <div key={subject._id} className="performance-bar">
                    <div className="subject-name">{subject._id}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ width: `${subject.averageScore}%` }}
                      />
                    </div>
                    <div className="score">{subject.averageScore.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3>System Notifications</h3>
              <div className="notifications-list">
                {systemNotifications.map(notification => (
                  <div key={notification._id} className="notification-item">
                    <div className="notification-content">
                      <span className="notification-type">{notification.type}</span>
                      <span className="notification-message">{notification.message}</span>
                    </div>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const contentMap = {
      home: renderHomeContent(),
      users: <UserManagement />,
      applications: <ApplicationManagement />,
      classes: <ClassManagement />,
      assignments: <AssignmentManagement />,
      finances: <FinanceManagement />,
      messages: <MessageCenter />
    };

    return contentMap[selectedTab] || null;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <h1>Admin Dashboard</h1>
        {dashboardData && (
          <div className="admin-info">
            <span>{dashboardData.admin.name}</span>
            <span className="admin-role">{dashboardData.admin.adminLevel}</span>
          </div>
        )}
      </header>

      <div className="dashboard-container">
        <nav className={`dashboard-nav ${menuOpen ? 'open' : 'closed'}`}>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li 
                key={item.value}
                className={`nav-item ${selectedTab === item.value ? 'active' : ''}`}
                onClick={() => setSelectedTab(item.value)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </nav>

        <main className={`dashboard-main ${menuOpen ? 'with-nav' : 'full-width'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;