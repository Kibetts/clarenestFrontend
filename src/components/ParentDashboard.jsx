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

    if (loading) return <div className="parent-loading">Loading...</div>;
    if (error) return <div className="parent-error">{error}</div>;
    if (!dashboardData) return <div className="parent-no-data">No data available</div>;

    const { parent, childrenDetails, financialInfo, unreadMessages, parentAnnouncements } = dashboardData;

    return (
        <div className="parent-dashboard">
            <header className="parent-header">
                <div className="parent-header-content">
                    <h1 className="parent-welcome">Welcome, {parent.name}</h1>
                    <div className="parent-info">
                        <span className="parent-messages">
                            {unreadMessages} unread messages
                        </span>
                    </div>
                </div>
            </header>

            <div className="parent-grid">
                {/* Children Overview Section */}
                <section className="parent-children-section">
                    <h2 className="parent-section-title">Children Overview</h2>
                    <div className="parent-children-grid">
                        {childrenDetails.map(child => (
                            <div key={child.childId} className="parent-child-card">
                                <div className="parent-child-header">
                                    <h3 className="parent-child-name">{child.name}</h3>
                                    <span className="parent-child-grade">Grade {child.grade}</span>
                                </div>

                                <div className="parent-child-stats">
                                    <div className="parent-child-stat">
                                        <span className="parent-stat-label">Overall Grade</span>
                                        <span className="parent-stat-value">
                                            {child.academicPerformance.overallGrade?.toFixed(1) || 'N/A'}%
                                        </span>
                                    </div>
                                    <div className="parent-child-stat">
                                        <span className="parent-stat-label">Attendance</span>
                                        <span className="parent-stat-value">
                                            {child.attendance.percentage?.toFixed(1) || 'N/A'}%
                                        </span>
                                    </div>
                                </div>

                                <div className="parent-child-assignments">
                                    <h4 className="parent-assignments-title">Upcoming Assignments</h4>
                                    <ul className="parent-assignments-list">
                                        {child.upcomingAssignments.slice(0, 3).map(assignment => (
                                            <li key={assignment._id} className="parent-assignment-item">
                                                <span className="parent-assignment-name">
                                                    {assignment.title}
                                                </span>
                                                <span className="parent-assignment-due">
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

                {/* Financial Overview Section */}
                <section className="parent-finance-section">
                    <h2 className="parent-section-title">Financial Overview</h2>
                    <div className="parent-finance-stats">
                        <div className="parent-finance-card">
                            <h4 className="parent-finance-label">Total Fees</h4>
                            <span className="parent-finance-amount">
                                ${(financialInfo.totalFees || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="parent-finance-card">
                            <h4 className="parent-finance-label">Paid Amount</h4>
                            <span className="parent-finance-amount">
                                ${(financialInfo.paidFees || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="parent-finance-card">
                            <h4 className="parent-finance-label">Pending Amount</h4>
                            <span className="parent-finance-amount">
                                ${(financialInfo.pendingFees || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="parent-payment-history">
                        <h3 className="parent-history-title">Recent Payments</h3>
                        <div className="parent-payments-list">
                            {financialInfo.paymentHistory.slice(0, 5).map(payment => (
                                <div key={payment._id} className="parent-payment-item">
                                    <span className="parent-payment-date">
                                        {new Date(payment.paymentDate).toLocaleDateString()}
                                    </span>
                                    <span className="parent-payment-amount">
                                        ${payment.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Announcements Section */}
                <section className="parent-announcements-section">
                    <h2 className="parent-section-title">Announcements</h2>
                    <div className="parent-announcements-list">
                        {parentAnnouncements.map(announcement => (
                            <div key={announcement._id} className="parent-announcement-card">
                                <div className="parent-announcement-header">
                                    <span className="parent-announcement-date">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="parent-announcement-content">
                                    {announcement.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="parent-assessments-section">
                <h2 className="parent-section-title">Distributed Assessments</h2>
                <div className="parent-assessments-list">
                    {dashboardData.pendingAssessments.map(assessment => (
                        <div key={assessment.id} className="parent-assessment-card">
                            <div className="assessment-info">
                                <h3>{assessment.title}</h3>
                                <p>Subject: {assessment.subject}</p>
                                <p>Distributed by: {assessment.tutor}</p>
                                <p>Date: {new Date(assessment.distributedAt).toLocaleDateString()}</p>
                            </div>
                            <button
                                className="download-btn"
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            `http://localhost:5000/api/assessments/${assessment.id}/download`,
                                            {
                                                headers: {
                                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                }
                                            }
                                        );
                                        
                                        if (response.ok) {
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `assessment-${assessment.title}.pdf`;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        } else {
                                            throw new Error('Download failed');
                                        }
                                    } catch (error) {
                                        console.error('Error downloading assessment:', error);
                                        // Handle error (show message to user)
                                    }
                                }}
                            >
                                Download Assessment
                            </button>
                        </div>
                    ))}
                </div>
            </section>
                        </div>
                    </div>
                );
            };

export default ParentDashboard;