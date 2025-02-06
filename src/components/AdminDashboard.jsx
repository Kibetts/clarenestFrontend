import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import UserManagement from '../AdminDashboardComponents/UserManagement';
import ClassManagement from '../AdminDashboardComponents/ClassManagement';
import AssignmentManagement from '../AdminDashboardComponents/AssignmentManagement';
import FinanceManagement from '../AdminDashboardComponents/FinanceManagement';
import MessageCenter from '../AdminDashboardComponents/MessageCenter';
import ApplicationManagement from '../AdminDashboardComponents/ApplicationManagement';
import AssessmentDistribution from '../AdminDashboardComponents/AssessmentDistribution';
import SubjectManagement from '../AdminDashboardComponents/SubjectManagement';
import { faBook } from '@fortawesome/free-solid-svg-icons';

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
    faComments,
    faTrash,
    faPlus,
    faCheck,
    faTimes,
    faClock
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
    // State management
    const [selectedTab, setSelectedTab] = useState('home');
    const [menuOpen, setMenuOpen] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        userStats: {
            totalStudents: 0,
            totalTutors: 0,
            totalParents: 0,
            activeUsers: 0,
            newUsersThisMonth: 0,
        },
        classStats: {
            totalClasses: 0,
            activeClasses: 0,
            averageStudentsPerClass: [{ avgStudents: 0 }],
            classesThisMonth: 0,
            upcomingClasses: 0
        },
        assessmentStats: {
            totalAssessments: 0,
            averageScore: 0,
            pendingGrading: 0,
            completedAssessments: 0,
            upcomingAssessments: 0
        },
        financialStats: {
            totalFees: 0,
            totalPaid: 0,
            totalPending: 0,
            revenueThisMonth: 0,
            outstandingPayments: 0
        },
        subjectPerformance: [],
        attendanceOverview: [],
        recentApplications: {
            students: [],
            tutors: []
        },
        systemNotifications: [],
        admin: {
            name: '',
            adminLevel: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [date, setDate] = useState(new Date());

    // Initial data fetch and setup
    useEffect(() => {
        fetchDashboardData();
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000);

        const savedTodos = localStorage.getItem('adminTodos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }

        return () => clearInterval(timer);
    }, []);

    // Persist todos in localStorage
    useEffect(() => {
        localStorage.setItem('adminTodos', JSON.stringify(todos));
    }, [todos]);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const response = await fetch('${process.env.BACKEND_URL}/api/dashboard/admin', {
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
            // Ensure all required properties exist with default values
            const processedData = {
                ...dashboardData, // Keep default values as fallback
                ...data.data,    // Spread the new data
                financialStats: {
                    ...dashboardData.financialStats, // Keep default financial values as fallback
                    ...data.data.financialStats,    // Spread new financial data
                }
            };
            
            setDashboardData(processedData);
            setLoading(false);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    // DateTime formatter
    const formatDateTime = (date) => {
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Todo list functions
    const addTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            setTodos([...todos, { 
                id: Date.now(), 
                text: newTodo, 
                completed: false,
                createdAt: new Date().toISOString(),
                priority: 'medium'
            }]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const menuItems = [
        { text: 'Home', icon: faHome, value: 'home' },
        { text: 'User Management', icon: faUsers, value: 'users' },
        { text: 'Applications', icon: faFileAlt, value: 'applications' },
        { text: 'Subject Management', icon: faBook, value: 'subjects' },
        { text: 'Class Management', icon: faChalkboardTeacher, value: 'classes' },
        { text: 'Assessments', icon: faFileAlt, value: 'assessments' },
        { text: 'Assignment Management', icon: faClipboardList, value: 'assignments' },
        { text: 'Finances', icon: faDollarSign, value: 'finances' },
        { text: 'Messages', icon: faComments, value: 'messages' },
    ];
    // Utility Section Renderer
    const renderUtilitySection = () => (
        <div className="admin-utility-section">
            <div className="admin-datetime-card">
                <h3 className="admin-section-title">Date & Time</h3>
                <div className="admin-datetime">
                    {formatDateTime(currentDateTime)}
                </div>
            </div>

            <div className="admin-todo-card">
                <h3 className="admin-section-title">To-Do List</h3>
                <form onSubmit={addTodo} className="admin-todo-form">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add new task..."
                        className="admin-todo-input"
                    />
                    <button type="submit" className="admin-todo-add-btn">
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </form>
                <ul className="admin-todo-list">
                    {todos.map(todo => (
                        <li key={todo.id} className="admin-todo-item">
                            <label className="admin-todo-label">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    className="admin-todo-checkbox"
                                />
                                <span className={`admin-todo-text ${todo.completed ? 'completed' : ''}`}>
                                    {todo.text}
                                </span>
                            </label>
                            <div className="admin-todo-actions">
                                <span className="admin-todo-date">
                                    {new Date(todo.createdAt).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="admin-todo-delete"
                                    title="Delete task"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="admin-calendar-card">
                <h3 className="admin-section-title">Calendar</h3>
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="admin-calendar"
                    tileClassName={({ date }) => {
                        // Add custom classes for dates with events
                        const hasEvent = dashboardData.attendanceOverview.some(
                            record => new Date(record.date).toDateString() === date.toDateString()
                        );
                        return hasEvent ? 'has-event' : '';
                    }}
                />
            </div>
        </div>
    );

    // Stats Overview Renderer
    const renderStatsOverview = () => {
        const {
            userStats,
            classStats,
            assessmentStats,
            financialStats
        } = dashboardData;

        return (
            <div className="admin-stats-grid">
                {/* Users Overview Card */}
                <div className="admin-stat-card">
                    <h3 className="admin-stat-title">
                        <FontAwesomeIcon icon={faUsers} className="admin-stat-icon" />
                        Users Overview
                    </h3>
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
                        <div className="admin-stat-item">
                            <span className="admin-stat-label">Active Users</span>
                            <span className="admin-stat-value">{userStats.activeUsers}</span>
                        </div>
                        <div className="admin-stat-item">
                            <span className="admin-stat-label">New This Month</span>
                            <span className="admin-stat-value">{userStats.newUsersThisMonth}</span>
                        </div>
                    </div>
                </div>

                {/* Financial Overview Card */}
<div className="admin-stat-card">
    <h3 className="admin-stat-title">
        <FontAwesomeIcon icon={faDollarSign} className="admin-stat-icon" />
        Financial Overview
    </h3>
    <div className="admin-stat-content">
        <div className="admin-stat-item">
            <span className="admin-stat-label">Total Fees</span>
            <span className="admin-stat-value">
                ${(financialStats?.totalFees || 0).toLocaleString()}
            </span>
        </div>
        <div className="admin-stat-item">
            <span className="admin-stat-label">Total Paid</span>
            <span className="admin-stat-value">
                ${(financialStats?.totalPaid || 0).toLocaleString()}
            </span>
        </div>
        <div className="admin-stat-item">
            <span className="admin-stat-label">Total Pending</span>
            <span className="admin-stat-value">
                ${(financialStats?.totalPending || 0).toLocaleString()}
            </span>
        </div>
        <div className="admin-stat-item">
            <span className="admin-stat-label">Monthly Revenue</span>
            <span className="admin-stat-value">
                ${(financialStats?.revenueThisMonth || 0).toLocaleString()}
            </span>
        </div>
        <div className="admin-stat-item">
            <span className="admin-stat-label">Outstanding</span>
            <span className="admin-stat-value">
                ${(financialStats?.outstandingPayments || 0).toLocaleString()}
            </span>
        </div>
    </div>
</div>

                {/* Class Overview Card */}
                <div className="admin-stat-card">
                    <h3 className="admin-stat-title">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="admin-stat-icon" />
                        Class Overview
                    </h3>
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
                        <div className="admin-stat-item">
                            <span className="admin-stat-label">Classes This Month</span>
                            <span className="admin-stat-value">{classStats.classesThisMonth}</span>
                        </div>
                        <div className="admin-stat-item">
                            <span className="admin-stat-label">Upcoming Classes</span>
                            <span className="admin-stat-value">{classStats.upcomingClasses}</span>
                        </div>
                    </div>
                </div>

                {/* Assessment Overview Card */}
                <div className="admin-stat-card">
                    <h3 className="admin-stat-title">
                        <FontAwesomeIcon icon={faFileAlt} className="admin-stat-icon" />
                        Assessment Overview
                    </h3>
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
                        <div className="admin-stat-item">
                            <span className="admin-stat-label">Completed</span>
                            <span className="admin-stat-value">{assessmentStats.completedAssessments}</span>
                        </div>
                        <div className="admin-stat-item">
                            <span className="admin-stat-label">Upcoming</span>
                            <span className="admin-stat-value">{assessmentStats.upcomingAssessments}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Dashboard Sections Renderer
    const renderDashboardSections = () => {
        const {
            subjectPerformance,
            attendanceOverview,
            recentApplications,
            systemNotifications
        } = dashboardData;

        return (
            <div className="admin-dashboard-sections">
                {/* Recent Applications Section */}
                <div className="admin-section-card">
                    <h3 className="admin-section-title">Recent Applications</h3>
                    <div className="admin-applications-list">
                        <div className="admin-application-type">
                            <h4 className="admin-application-header">
                                <FontAwesomeIcon icon={faUsers} className="admin-header-icon" />
                                Student Applications
                            </h4>
                            {recentApplications.students.map(app => (
                                <div key={app._id} className="admin-application-item">
                                    <span className="admin-applicant-name">
                                        {app.personalInfo.fullName}
                                    </span>
                                    <div className="admin-application-details">
                                        <span className="admin-application-date">
                                            <FontAwesomeIcon icon={faClock} />
                                            {new Date(app.submittedDate).toLocaleDateString()}
                                        </span>
                                        <span className={`admin-status-badge ${app.status.toLowerCase()}`}>
                                            {app.status === 'pending' && <FontAwesomeIcon icon={faClock} />}
                                            {app.status === 'approved' && <FontAwesomeIcon icon={faCheck} />}
                                            {app.status === 'rejected' && <FontAwesomeIcon icon={faTimes} />}
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="admin-application-type">
                            <h4 className="admin-application-header">
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="admin-header-icon" />
                                Tutor Applications
                            </h4>
                            {recentApplications.tutors.map(app => (
                                <div key={app._id} className="admin-application-item">
                                    <span className="admin-applicant-name">
                                        {app.personalInfo.fullName}
                                    </span>
                                    <div className="admin-application-details">
                                        <span className="admin-application-date">
                                            <FontAwesomeIcon icon={faClock} />
                                            {new Date(app.submittedDate).toLocaleDateString()}
                                        </span>
                                        <span className={`admin-status-badge ${app.status.toLowerCase()}`}>
                                            {app.status === 'pending' && <FontAwesomeIcon icon={faClock} />}
                                            {app.status === 'approved' && <FontAwesomeIcon icon={faCheck} />}
                                            {app.status === 'rejected' && <FontAwesomeIcon icon={faTimes} />}
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Attendance Overview Section */}
                <div className="admin-section-card">
                    <h3 className="admin-section-title">
                        <FontAwesomeIcon icon={faUsers} className="admin-section-icon" />
                        Attendance Overview
                    </h3>
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
                                    <span className="admin-attendance-stat">
                                        <FontAwesomeIcon icon={faCheck} className="admin-stat-icon success" />
                                        Present: {record.present}
                                    </span>
                                    <span className="admin-attendance-stat">
                                        <FontAwesomeIcon icon={faTimes} className="admin-stat-icon danger" />
                                        Absent: {record.absent}
                                    </span>
                                    <span className="admin-attendance-stat">
                                        <FontAwesomeIcon icon={faClock} className="admin-stat-icon warning" />
                                        Late: {record.late}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subject Performance Section */}
                <div className="admin-section-card">
                    <h3 className="admin-section-title">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="admin-section-icon" />
                        Subject Performance
                    </h3>
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
                    <h3 className="admin-section-title">
                        <FontAwesomeIcon icon={faBars} className="admin-section-icon" />
                        System Notifications
                    </h3>
                    <div className="admin-notifications-list">
                        {systemNotifications.map(notification => (
                            <div key={notification._id} className="admin-notification-item">
                                <div className="admin-notification-content">
                                    <span className={`admin-notification-type ${notification.type.toLowerCase()}`}>
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
        );
    };

    // Main Content Renderer
    const renderHomeContent = () => {
        if (!dashboardData) return null;

        return (
            <div className="admin-home">
                {renderUtilitySection()}
                <div className="admin-stats-overview">
                    {renderStatsOverview()}
                    {renderDashboardSections()}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        const contentMap = {
            home: renderHomeContent(),
            users: <UserManagement />,
            applications: <ApplicationManagement />,
            assessments: <AssessmentDistribution />,
            subjects: <SubjectManagement />,
            classes: <ClassManagement />,
            assignments: <AssignmentManagement />,
            finances: <FinanceManagement />,
            messages: <MessageCenter />
        };

        return contentMap[selectedTab] || null;
    };

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;
    if (error) return <div className="admin-error">Error: {error}</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <button 
                    className="admin-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
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