import React, { useState, useEffect } from 'react';
import UserManagement from '../AdminDashboardComponents/UserManagement';
import ClassManagement from '../AdminDashboardComponents/ClassManagement';
import AssignmentManagement from '../AdminDashboardComponents/AssignmentManagement';
import FinanceManagement from '../AdminDashboardComponents/FinanceManagement';
import MessageCenter from '../AdminDashboardComponents/MessageCenter';
import Calendar from '../AdminDashboardComponents/Calendar';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
    fetchDashboardStats();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAdminName(data.name);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const menuItems = [
    { text: 'Home', icon: '🏠', value: 'home' },
    { text: 'User Management', icon: '👥', value: 'users' },
    { text: 'Class Management', icon: '📚', value: 'classes' },
    { text: 'Assignment Management', icon: '📝', value: 'assignments' },
    { text: 'Finances', icon: '💰', value: 'finances' },
    { text: 'Messages', icon: '💬', value: 'messages' },
  ];

  const renderContent = () => {
    const contentMap = {
      home: (
        <div className="dashboard-home">
          <h2>Welcome, {adminName}</h2>
          <div className="dashboard-grid">
            <div className="main-content">
              <div className="calendar-section">
                <Calendar />
              </div>
            </div>
            <div className="stats-section">
              <h3>Quick Stats</h3>
              {stats && (
                <div className="stats-container">
                  <div className="stat-item">
                    <span className="stat-label">Students:</span>
                    <span className="stat-value">{stats.totalStudents}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tutors:</span>
                    <span className="stat-value">{stats.totalTutors}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Revenue:</span>
                    <span className="stat-value">${stats.revenue}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      users: <UserManagement />,
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