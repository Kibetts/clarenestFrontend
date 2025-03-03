// import React, { useState, useEffect } from 'react';
// import '../css/ParentDashboard.css';

// const ParentDashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [dashboardData, setDashboardData] = useState(null);

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/dashboard/parent', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch dashboard data');
//             }

//             const data = await response.json();
//             setDashboardData(data.data);
//             setLoading(false);
//         } catch (err) {
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="parent-loading">Loading...</div>;
//     if (error) return <div className="parent-error">{error}</div>;
//     if (!dashboardData) return <div className="parent-no-data">No data available</div>;

//     const { parent, childrenDetails, financialInfo, unreadMessages, parentAnnouncements } = dashboardData;

//     return (
//         <div className="parent-dashboard">
//             <header className="parent-header">
//                 <div className="parent-header-content">
//                     <h1 className="parent-welcome">Welcome, {parent.name}</h1>
//                     <div className="parent-info">
//                         <span className="parent-messages">
//                             {unreadMessages} unread messages
//                         </span>
//                     </div>
//                 </div>
//             </header>

//             <div className="parent-grid">
//                 {/* Children Overview Section */}
//                 <section className="parent-children-section">
//                     <h2 className="parent-section-title">Children Overview</h2>
//                     <div className="parent-children-grid">
//                         {childrenDetails.map(child => (
//                             <div key={child.childId} className="parent-child-card">
//                                 <div className="parent-child-header">
//                                     <h3 className="parent-child-name">{child.name}</h3>
//                                     <span className="parent-child-grade">Grade {child.grade}</span>
//                                 </div>

//                                 <div className="parent-child-stats">
//                                     <div className="parent-child-stat">
//                                         <span className="parent-stat-label">Overall Grade</span>
//                                         <span className="parent-stat-value">
//                                             {child.academicPerformance.overallGrade?.toFixed(1) || 'N/A'}%
//                                         </span>
//                                     </div>
//                                     <div className="parent-child-stat">
//                                         <span className="parent-stat-label">Attendance</span>
//                                         <span className="parent-stat-value">
//                                             {child.attendance.percentage?.toFixed(1) || 'N/A'}%
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="parent-child-assignments">
//                                     <h4 className="parent-assignments-title">Upcoming Assignments</h4>
//                                     <ul className="parent-assignments-list">
//                                         {child.upcomingAssignments.slice(0, 3).map(assignment => (
//                                             <li key={assignment._id} className="parent-assignment-item">
//                                                 <span className="parent-assignment-name">
//                                                     {assignment.title}
//                                                 </span>
//                                                 <span className="parent-assignment-due">
//                                                     Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                                                 </span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 {/* Financial Overview Section */}
//                 <section className="parent-finance-section">
//                     <h2 className="parent-section-title">Financial Overview</h2>
//                     <div className="parent-finance-stats">
//                         <div className="parent-finance-card">
//                             <h4 className="parent-finance-label">Total Fees</h4>
//                             <span className="parent-finance-amount">
//                                 ${(financialInfo.totalFees || 0).toFixed(2)}
//                             </span>
//                         </div>
//                         <div className="parent-finance-card">
//                             <h4 className="parent-finance-label">Paid Amount</h4>
//                             <span className="parent-finance-amount">
//                                 ${(financialInfo.paidFees || 0).toFixed(2)}
//                             </span>
//                         </div>
//                         <div className="parent-finance-card">
//                             <h4 className="parent-finance-label">Pending Amount</h4>
//                             <span className="parent-finance-amount">
//                                 ${(financialInfo.pendingFees || 0).toFixed(2)}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="parent-payment-history">
//                         <h3 className="parent-history-title">Recent Payments</h3>
//                         <div className="parent-payments-list">
//                             {financialInfo.paymentHistory.slice(0, 5).map(payment => (
//                                 <div key={payment._id} className="parent-payment-item">
//                                     <span className="parent-payment-date">
//                                         {new Date(payment.paymentDate).toLocaleDateString()}
//                                     </span>
//                                     <span className="parent-payment-amount">
//                                         ${payment.amount.toFixed(2)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* Announcements Section */}
//                 <section className="parent-announcements-section">
//                     <h2 className="parent-section-title">Announcements</h2>
//                     <div className="parent-announcements-list">
//                         {parentAnnouncements.map(announcement => (
//                             <div key={announcement._id} className="parent-announcement-card">
//                                 <div className="parent-announcement-header">
//                                     <span className="parent-announcement-date">
//                                         {new Date(announcement.createdAt).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 <div className="parent-announcement-content">
//                                     {announcement.message}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 <section className="parent-assessments-section">
//                 <h2 className="parent-section-title">Distributed Assessments</h2>
//                 <div className="parent-assessments-list">
//                     {dashboardData.pendingAssessments.map(assessment => (
//                         <div key={assessment.id} className="parent-assessment-card">
//                             <div className="assessment-info">
//                                 <h3>{assessment.title}</h3>
//                                 <p>Subject: {assessment.subject}</p>
//                                 <p>Distributed by: {assessment.tutor}</p>
//                                 <p>Date: {new Date(assessment.distributedAt).toLocaleDateString()}</p>
//                             </div>
//                             <button
//                                 className="download-btn"
//                                 onClick={async () => {
//                                     try {
//                                         const response = await fetch(
//                                             `http://localhost:5000/api/assessments/${assessment.id}/download`,
//                                             {
//                                                 headers: {
//                                                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                                                 }
//                                             }
//                                         );
                                        
//                                         if (response.ok) {
//                                             const blob = await response.blob();
//                                             const url = window.URL.createObjectURL(blob);
//                                             const a = document.createElement('a');
//                                             a.href = url;
//                                             a.download = `assessment-${assessment.title}.pdf`;
//                                             document.body.appendChild(a);
//                                             a.click();
//                                             window.URL.revokeObjectURL(url);
//                                         } else {
//                                             throw new Error('Download failed');
//                                         }
//                                     } catch (error) {
//                                         console.error('Error downloading assessment:', error);
//                                         // Handle error (show message to user)
//                                     }
//                                 }}
//                             >
//                                 Download Assessment
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//                         </div>
//                     </div>
//                 );
//             };

// export default ParentDashboard;


import React, { useState, useEffect } from 'react';
import '../css/ParentDashboard.css';
import Messages from './Messages';

const ParentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeNavItem, setActiveNavItem] = useState('overview');
    const [dashboardData, setDashboardData] = useState({
        parent: {
            name: '',
            email: ''
        },
        childrenDetails: [],
        financialInfo: {
            totalFees: 0,
            paidFees: 0,
            pendingFees: 0,
            paymentHistory: []
        },
        unreadMessages: 0,
        parentAnnouncements: [],
        pendingAssessments: []
    });

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

    const navigationItems = [
        { id: 'overview', label: 'Children Overview', icon: '👨‍👧‍👦' },
        { id: 'financial', label: 'Financial Overview', icon: '💰' },
        { id: 'announcements', label: 'Announcements', icon: '📢' },
        { id: 'messages', label: 'Messages', icon: '💬' }
    ];

    const handleDownloadAssessment = async (assessmentId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/assessments/${assessmentId}/download`,
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
                a.download = `assessment.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Error downloading assessment:', error);
        }
    };

    const renderChildrenOverview = () => {
        if (!dashboardData.childrenDetails || dashboardData.childrenDetails.length === 0) {
            return (
                <div className="parent-empty-state">
                    <div className="empty-state-content">
                        <span className="empty-state-icon">👨‍👧‍👦</span>
                        <h3>No Children Enrolled</h3>
                        <p>Please contact the administration to enroll your children.</p>
                    </div>
                </div>
            );
        }
    
        return (
            <div className="parent-grid">
                <section className="parent-children-section">
                    <h2 className="parent-section-title">Children Overview</h2>
                    <div className="parent-children-grid">
                        {dashboardData.childrenDetails.map(child => (
                            <div key={child.childId} className="parent-child-card">
                                <div className="parent-child-header">
                                    <h3 className="parent-child-name">{child.name}</h3>
                                    <span className="parent-child-grade">Grade {child.grade}</span>
                                </div>
    
                                <div className="parent-child-stats">
                                    <div className="parent-child-stat">
                                        <span className="parent-stat-label">Overall Grade</span>
                                        <span className="parent-stat-value">
                                            {child.academicPerformance?.overallGrade?.toFixed(1) || 'N/A'}%
                                        </span>
                                    </div>
                                    <div className="parent-child-stat">
                                        <span className="parent-stat-label">Attendance</span>
                                        <span className="parent-stat-value">
                                            {child.attendance?.percentage?.toFixed(1) || 'N/A'}%
                                        </span>
                                    </div>
                                </div>
    
                                {/* Active Classes Section */}
                                <div className="parent-child-classes">
                                    <h4 className="section-subtitle">Active Classes</h4>
                                    {child.activeClasses && child.activeClasses.length > 0 ? (
                                        <div className="active-classes-list">
                                            {child.activeClasses.map((class_, index) => (
                                                <div key={index} className="active-class-item">
                                                    <div className="class-info">
                                                        <span className="class-subject">{class_.subject}</span>
                                                        <span className="class-time">
                                                            {new Date(class_.startTime).toLocaleTimeString()} - 
                                                            {new Date(class_.endTime).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <span className="class-tutor">Tutor: {class_.tutor}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-classes">No active classes at the moment</p>
                                    )}
                                </div>
    
                                {/* Assignments Section */}
                                <div className="parent-child-assignments">
                                    <h4 className="section-subtitle">Upcoming Assignments</h4>
                                    {child.upcomingAssignments && child.upcomingAssignments.length > 0 ? (
                                        <ul className="parent-assignments-list">
                                            {child.upcomingAssignments.slice(0, 3).map(assignment => (
                                                <li key={assignment._id} className="parent-assignment-item">
                                                    <div className="assignment-details">
                                                        <span className="assignment-name">{assignment.title}</span>
                                                        <span className="assignment-subject">{assignment.subject}</span>
                                                    </div>
                                                    <div className="assignment-meta">
                                                        <span className="assignment-due">
                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </span>
                                                        <span className={`assignment-status ${assignment.status.toLowerCase()}`}>
                                                            {assignment.status}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-assignments">No upcoming assignments</p>
                                    )}
                                </div>
    
                                {/* Performance Metrics */}
                                <div className="parent-child-performance">
                                    <h4 className="section-subtitle">Performance Overview</h4>
                                    <div className="performance-metrics">
                                        <div className="metric-item">
                                            <span className="metric-label">Class Rank</span>
                                            <span className="metric-value">{child.academicPerformance?.rank || 'N/A'}</span>
                                        </div>
                                        <div className="metric-item">
                                            <span className="metric-label">Subjects Passed</span>
                                            <span className="metric-value">{child.academicPerformance?.subjectsPassed || '0'}</span>
                                        </div>
                                        <div className="metric-item">
                                            <span className="metric-label">Improvement</span>
                                            <span className="metric-value">
                                                {child.academicPerformance?.improvement ? 
                                                    `${child.academicPerformance.improvement}%` : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
    
                    {/* Assessments Section */}
                    {dashboardData.pendingAssessments && dashboardData.pendingAssessments.length > 0 && (
                        <div className="parent-assessments-section">
                            <h3 className="parent-section-title">Distributed Assessments</h3>
                            <div className="parent-assessments-list">
                                {dashboardData.pendingAssessments.map(assessment => (
                                    <div key={assessment.id} className="parent-assessment-card">
                                        <div className="assessment-info">
                                            <h4>{assessment.title}</h4>
                                            <p>Subject: {assessment.subject}</p>
                                            <p>Distributed by: {assessment.tutor}</p>
                                            <p>Due Date: {new Date(assessment.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            className="download-btn"
                                            onClick={() => handleDownloadAssessment(assessment.id)}
                                        >
                                            Download Assessment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        );
    };

    const renderFinancialOverview = () => (
        <section className="parent-finance-section">
            <h2 className="parent-section-title">Financial Overview</h2>
            <div className="parent-finance-stats">
                <div className="parent-finance-card">
                    <h4 className="parent-finance-label">Total Fees</h4>
                    <span className="parent-finance-amount">
                        ${(dashboardData.financialInfo.totalFees || 0).toFixed(2)}
                    </span>
                </div>
                <div className="parent-finance-card">
                    <h4 className="parent-finance-label">Paid Amount</h4>
                    <span className="parent-finance-amount">
                        ${(dashboardData.financialInfo.paidFees || 0).toFixed(2)}
                    </span>
                </div>
                <div className="parent-finance-card">
                    <h4 className="parent-finance-label">Pending Amount</h4>
                    <span className="parent-finance-amount">
                        ${(dashboardData.financialInfo.pendingFees || 0).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="parent-payment-history">
                <h3 className="parent-history-title">Recent Payments</h3>
                <div className="parent-payments-list">
                    {dashboardData.financialInfo.paymentHistory.slice(0, 5).map(payment => (
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
    );

    const renderAnnouncements = () => (
        <section className="parent-announcements-section">
            <h2 className="parent-section-title">Announcements</h2>
            <div className="parent-announcements-list">
                {dashboardData.parentAnnouncements.map(announcement => (
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
    );

    const renderMainContent = () => {
        switch (activeNavItem) {
            case 'overview':
                return renderChildrenOverview();
            case 'financial':
                return renderFinancialOverview();
            case 'announcements':
                return renderAnnouncements();
            case 'messages':
                return <Messages />;
            default:
                return <div>Section under development</div>;
        }
    };

    if (loading) return <div className="parent-loading">Loading...</div>;
    if (error) return <div className="parent-error">{error}</div>;

    return (
        <div className="parent-dashboard-container">
            <nav className="parent-sidebar">
                <div className="sidebar-header">
                    <h2>Parent Portal</h2>
                    <p className="parent-name">{dashboardData.parent?.name}</p>
                </div>
                
                <ul className="sidebar-nav">
                    {navigationItems.map(item => (
                        <li 
                            key={item.id}
                            className={`sidebar-nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                            onClick={() => setActiveNavItem(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="parent-main-content">
                <header className="parent-header">
                    <div className="parent-header-content">
                        <h1 className="parent-welcome">Welcome, {dashboardData.parent?.name}</h1>
                        <div className="parent-info">
                            <span className="parent-messages">
                                {dashboardData.unreadMessages} unread messages
                            </span>
                        </div>
                    </div>
                </header>

                <div className="parent-content-grid">
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
};

export default ParentDashboard;