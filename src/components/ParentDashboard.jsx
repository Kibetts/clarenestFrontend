import React, { useState, useEffect } from 'react';
import '../css/ParentDashboard.css';

const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/parent', {
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

  const { parent, childrenDetails, financialInfo, unreadMessages, parentAnnouncements } = dashboardData;

  return (
    <div className="parent-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {parent.name}</h1>
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-label">Unread Messages</span>
            <span className="stat-value">{unreadMessages}</span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Children Section */}
        <section className="dashboard-section children-overview">
          <h2>Children Overview</h2>
          <div className="children-grid">
            {childrenDetails.map(child => (
              <div key={child.childId} className="child-card">
                <div className="child-header">
                  <h3>{child.name}</h3>
                  <span className="grade-badge">Grade {child.grade}</span>
                </div>

                <div className="child-stats">
                  <div className="stat-item">
                    <span className="stat-label">Overall Grade</span>
                    <span className="stat-value">
                      {child.academicPerformance.overallGrade?.toFixed(1) || 'N/A'}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Attendance</span>
                    <span className="stat-value">
                      {child.attendance.percentage?.toFixed(1) || 'N/A'}%
                    </span>
                  </div>
                </div>

                <div className="upcoming-items">
                  <h4>Upcoming Assignments</h4>
                  <ul className="assignments-list">
                    {child.upcomingAssignments.slice(0, 3).map(assignment => (
                      <li key={assignment._id} className="assignment-item">
                        <span>{assignment.title}</span>
                        <span className="due-date">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Section */}
        <section className="dashboard-section finances">
          <h2>Financial Overview</h2>
          <div className="finance-stats">
            <div className="stat-card">
              <h4>Total Fees</h4>
              <span className="amount">${(financialInfo.totalFees || 0).toFixed(2)}</span>
            </div>
            <div className="stat-card">
              <h4>Paid Amount</h4>
              <span className="amount">${(financialInfo.paidFees || 0).toFixed(2)}</span>
            </div>
            <div className="stat-card">
              <h4>Pending Amount</h4>
              <span className="amount">${(financialInfo.pendingFees || 0).toFixed(2)}</span>
              </div>
          </div>

          <div className="payment-history">
            <h3>Recent Payments</h3>
            <div className="payment-list">
              {financialInfo.paymentHistory.slice(0, 5).map(payment => (
                <div key={payment._id} className="payment-item">
                  <span className="payment-date">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </span>
                  <span className="payment-amount">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="dashboard-section announcements">
          <h2>Announcements</h2>
          <div className="announcements-list">
            {parentAnnouncements.map(announcement => (
              <div key={announcement._id} className="announcement-card">
                <div className="announcement-header">
                  <span className="announcement-date">
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

export default ParentDashboard;