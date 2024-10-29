import React, { useState, useEffect } from 'react';
import UserManagement from '../AdminDashboardComponents/UserManagement';
import ClassManagement from '../AdminDashboardComponents/ClassManagement';
import AssignmentManagement from '../AdminDashboardComponents/AssignmentManagement';
import FinanceManagement from '../AdminDashboardComponents/FinanceManagement';
import MessageCenter from '../AdminDashboardComponents/MessageCenter';
import ApplicationManagement from '../AdminDashboardComponents/ApplicationManagement';
import '../css/AdminDashboard.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBars,
    faHome, 
    faUsers, 
    faFileAlt, 
    faChalkboardTeacher, 
    faClipboardList, 
    faDollarSign, 
    faComments 
} from '@fortawesome/free-solid-svg-icons';


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
            const response = await fetch('https://clarenest.onrender.com/api/dashboard/admin', {
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
        { text: 'Home', icon: faHome, value: 'home' },
        { text: 'User Management', icon: faUsers, value: 'users' },
        { text: 'Applications', icon: faFileAlt, value: 'applications' },
        { text: 'Class Management', icon: faChalkboardTeacher, value: 'classes' },
        { text: 'Assignment Management', icon: faClipboardList, value: 'assignments' },
        { text: 'Finances', icon: faDollarSign, value: 'finances' },
        { text: 'Messages', icon: faComments, value: 'messages' },
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
            <div className="admin-home">
                <div className="admin-stats-overview">
                    <div className="admin-stats-grid">
                        {/* Users Overview Card */}
                        <div className="admin-stat-card">
                            <h3 className="admin-stat-title">Users Overview</h3>
                            <div className="admin-stat-content">
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Students</span>
                                    <span className="admin-stat-value">{userStats.totalStudents}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Tutors</span>
                                    <span className="admin-stat-value">{userStats.totalTutors}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Parents</span>
                                    <span className="admin-stat-value">{userStats.totalParents}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Overview Card */}
                        <div className="admin-stat-card">
                            <h3 className="admin-stat-title">Financial Overview</h3>
                            <div className="admin-stat-content">
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Fees</span>
                                    <span className="admin-stat-value">${financialStats.totalFees}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Paid</span>
                                    <span className="admin-stat-value">${financialStats.totalPaid}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Pending</span>
                                    <span className="admin-stat-value">${financialStats.totalPending}</span>
                                </div>
                            </div>
                        </div>

                        {/* Class Overview Card */}
                        <div className="admin-stat-card">
                            <h3 className="admin-stat-title">Class Overview</h3>
                            <div className="admin-stat-content">
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Classes</span>
                                    <span className="admin-stat-value">{classStats.totalClasses}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Active Classes</span>
                                    <span className="admin-stat-value">{classStats.activeClasses}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Avg. Students/Class</span>
                                    <span className="admin-stat-value">
                                        {classStats.averageStudentsPerClass[0]?.avgStudents.toFixed(1) || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Assessment Overview Card */}
                        <div className="admin-stat-card">
                            <h3 className="admin-stat-title">Assessment Overview</h3>
                            <div className="admin-stat-content">
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Total Assessments</span>
                                    <span className="admin-stat-value">{assessmentStats.totalAssessments}</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Average Score</span>
                                    <span className="admin-stat-value">{assessmentStats.averageScore}%</span>
                                </div>
                                <div className="admin-stat-item">
                                    <span className="admin-stat-label">Pending Grading</span>
                                    <span className="admin-stat-value">{assessmentStats.pendingGrading}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-dashboard-sections">
                        {/* Recent Applications Section */}
                        <div className="admin-section-card">
                            <h3 className="admin-section-title">Recent Applications</h3>
                            <div className="admin-applications-list">
                                <div className="admin-application-type">
                                    <h4 className="admin-application-header">Student Applications</h4>
                                    {recentApplications.students.map(app => (
                                        <div key={app._id} className="admin-application-item">
                                            <span className="admin-applicant-name">
                                                {app.personalInfo.fullName}
                                            </span>
                                            <span className={`admin-status-badge ${app.status}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="admin-application-type">
                                    <h4 className="admin-application-header">Tutor Applications</h4>
                                    {recentApplications.tutors.map(app => (
                                        <div key={app._id} className="admin-application-item">
                                            <span className="admin-applicant-name">
                                                {app.personalInfo.fullName}
                                            </span>
                                            <span className={`admin-status-badge ${app.status}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Attendance Overview Section */}
                        <div className="admin-section-card">
                            <h3 className="admin-section-title">Attendance Overview</h3>
                            <div className="admin-attendance-overview">
                                {attendanceOverview.map(record => (
                                    <div key={record.class} className="admin-attendance-item">
                                        <div className="admin-class-info">
                                            <span className="admin-class-name">{record.class}</span>
                                            <span className="admin-attendance-rate">
                                                {record.attendanceRate}% Present
                                            </span>
                                        </div>
                                        <div className="admin-attendance-bar">
                                            <div 
                                                className="admin-attendance-fill"
                                                style={{ width: `${record.attendanceRate}%` }}
                                            />
                                        </div>
                                        <div className="admin-attendance-details">
                                            <span>Present: {record.present}</span>
                                            <span>Absent: {record.absent}</span>
                                            <span>Late: {record.late}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subject Performance Section */}
                        <div className="admin-section-card">
                            <h3 className="admin-section-title">Subject Performance</h3>
                            <div className="admin-performance-chart">
                                {subjectPerformance.map(subject => (
                                    <div key={subject._id} className="admin-performance-bar">
                                        <div className="admin-subject-name">{subject._id}</div>
                                        <div className="admin-bar-container">
                                            <div 
                                                className="admin-bar-fill"
                                                style={{ width: `${subject.averageScore}%` }}
                                            />
                                        </div>
                                        <div className="admin-score">
                                            {subject.averageScore.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Notifications Section */}
                        <div className="admin-section-card">
                            <h3 className="admin-section-title">System Notifications</h3>
                            <div className="admin-notifications-list">
                                {systemNotifications.map(notification => (
                                    <div key={notification._id} className="admin-notification-item">
                                        <div className="admin-notification-content">
                                            <span className="admin-notification-type">
                                                {notification.type}
                                            </span>
                                            <span className="admin-notification-message">
                                                {notification.message}
                                            </span>
                                        </div>
                                        <span className="admin-notification-time">
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

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <button 
                    className="admin-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <h1 className="admin-title">Admin Dashboard</h1>
                {dashboardData && (
                    <div className="admin-profile">
                        <h2 className="welcome-message">Welcome, {dashboardData.admin.name}</h2>
                        <span className="admin-role">{dashboardData.admin.adminLevel}</span>
                    </div>
                )}
            </header>

            <div className="admin-container">
                <nav className={`admin-nav ${menuOpen ? 'open' : 'closed'}`}>
                    <ul className="admin-nav-list">
                        {menuItems.map((item) => (
                            <li 
                                key={item.value}
                                className={`admin-nav-item ${selectedTab === item.value ? 'active' : ''}`}
                                onClick={() => setSelectedTab(item.value)}
                            >
                                <span className="admin-nav-icon">
                                    <FontAwesomeIcon icon={item.icon} />
                                </span>
                                <span className="admin-nav-text">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className={`admin-main ${menuOpen ? 'with-nav' : 'full-width'}`}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;