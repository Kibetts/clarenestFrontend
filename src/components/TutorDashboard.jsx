// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/TutorDashboard.css';

// const TutorDashboard = () => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [dashboardData, setDashboardData] = useState(null);
//     const [activeSection, setActiveSection] = useState('dashboard');

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/dashboard/tutor', {
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

//     const navigationItems = [
//         { id: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
//         { id: 'classes', label: 'Active Classes', icon: '📚' },
//         { id: 'assignments', label: 'Assignments', icon: '📝' },
//         { id: 'assessments', label: 'Assessments', icon: '📊' },
//         { id: 'schedule', label: 'Schedule', icon: '📅' },
//         { id: 'performance', label: 'Student Performance', icon: '📈' },
//         { id: 'messages', label: 'Messages', icon: '💬' },
//         { id: 'settings', label: 'Settings', icon: '⚙️' }
//     ];

//     if (loading) return <div className="tutor-loading">Loading...</div>;
//     if (error) return <div className="tutor-error">{error}</div>;
//     if (!dashboardData) return <div className="tutor-no-data">No data available</div>;

//     const {
//         tutor,
//         dashboard: {
//             activeClasses,
//             pendingAssignments,
//             assessments,
//             recentSubmissions,
//             studentPerformance,
//             attendanceStats,
//             schedule,
//             unreadMessages,
//             announcements
//         }
//     } = dashboardData;

//     const renderDashboardContent = () => {
//         switch (activeSection) {
//             case 'dashboard':
//                 return (
//                     <>
//                         <div className="tutor-overview-cards">
//                             <div className="tutor-overview-card">
//                                 <h3>Active Classes</h3>
//                                 <p>{activeClasses.length}</p>
//                             </div>
//                             <div className="tutor-overview-card">
//                                 <h3>Pending Tasks</h3>
//                                 <p>{pendingAssignments.length}</p>
//                             </div>
//                             <div className="tutor-overview-card">
//                                 <h3>Total Students</h3>
//                                 <p>{activeClasses.reduce((sum, cls) => sum + cls.students.length, 0)}</p>
//                             </div>
//                         </div>

//                         <section className="tutor-section">
//                             <h2 className="tutor-section-title">Active Classes</h2>
//                             <div className="tutor-classes-grid">
//                                 {activeClasses.map(class_ => (
//                                     <div key={class_._id} className="tutor-class-card">
//                                         <div className="tutor-class-header">
//                                             <h3 className="tutor-class-title">{class_.subject.title}</h3>
//                                             <span className="tutor-student-count">
//                                                 {class_.students.length} students
//                                             </span>
//                                         </div>
//                                         <div className="tutor-class-details">
//                                             <p>Time: {new Date(class_.startTime).toLocaleTimeString()}</p>
//                                             <p>Grade: {class_.subject.gradeLevel}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>

//                         <section className="tutor-section">
//                             <h2 className="tutor-section-title">Student Performance</h2>
//                             <div className="tutor-performance-grid">
//                                 {studentPerformance.map(performance => (
//                                     <div key={performance._id} className="tutor-subject-performance">
//                                         <h3 className="tutor-subject-title">{performance._id}</h3>
//                                         <div className="tutor-performance-stats">
//                                             <div className="tutor-stat">
//                                                 <span className="tutor-stat-label">Average Score</span>
//                                                 <span className="tutor-stat-value">
//                                                     {(performance.averageScore || 0).toFixed(1)}%
//                                                 </span>
//                                             </div>
//                                             <div className="tutor-stat">
//                                                 <span className="tutor-stat-label">Total Students</span>
//                                                 <span className="tutor-stat-value">
//                                                     {performance.totalStudents}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>

//                         <div className="tutor-quick-actions">
//                             <button onClick={() => navigate('/tutor/create-assignment')}>
//                                 Create Assignment
//                             </button>
//                             <button onClick={() => navigate('/tutor/schedule-assessment')}>
//                                 Schedule Assessment
//                             </button>
//                             <button onClick={() => navigate('/tutor/mark-attendance')}>
//                                 Mark Attendance
//                             </button>
//                             <button onClick={() => navigate('/tutor/messages')}>
//                                 Send Message
//                             </button>
//                         </div>
//                     </>
//                 );

//             case 'assignments':
//                 return (
//                     <section className="tutor-section">
//                         <h2 className="tutor-section-title">Assignments</h2>
//                         <div className="tutor-assignments-grid">
//                             {pendingAssignments.map(assignment => (
//                                 <div key={assignment._id} className="tutor-assignment-card">
//                                     <h3>{assignment.title}</h3>
//                                     <p>{assignment.subject.title}</p>
//                                     <p>Submissions: {assignment.submissions.length}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 );

//             case 'assessments':
//                 return (
//                     <section className="tutor-section">
//                         <h2 className="tutor-section-title">Assessments</h2>
//                         <div className="tutor-assessments-grid">
//                             {assessments.pending.map(assessment => (
//                                 <div key={assessment._id} className="tutor-assessment-card">
//                                     <h3>{assessment.title}</h3>
//                                     <p>{assessment.subject.title}</p>
//                                     <p>Due: {new Date(assessment.dueDate).toLocaleDateString()}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 );

//             default:
//                 return (
//                     <div className="tutor-section">
//                         <h2 className="tutor-section-title">Section Under Development</h2>
//                         <p>This section is coming soon.</p>
//                     </div>
//                 );
//         }
//     };

//     return (
//         <div className="tutor-dashboard-container">
//             <nav className="tutor-sidebar">
//                 <div className="sidebar-header">
//                     <h2>Tutor Portal</h2>
//                     <p className="tutor-name">{tutor.name}</p>
//                     <div className="tutor-rating">Rating: {(tutor.rating || 0).toFixed(1)} ⭐</div>
//                 </div>
                
//                 <ul className="sidebar-nav">
//                     {navigationItems.map(item => (
//                         <li 
//                             key={item.id}
//                             className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
//                             onClick={() => setActiveSection(item.id)}
//                         >
//                             <span className="nav-icon">{item.icon}</span>
//                             <span className="nav-label">{item.label}</span>
//                         </li>
//                     ))}
//                 </ul>
                
//                 <div className="sidebar-footer">
//                     <button className="logout-button">Logout</button>
//                 </div>
//             </nav>

//             <main className="tutor-main-content">
//                 <header className="tutor-header">
//                     <div className="tutor-header-content">
//                         <h1 className="tutor-welcome">Welcome, {tutor.name}</h1>
//                         <div className="tutor-info">
//                             <span className="tutor-messages">{unreadMessages} unread messages</span>
//                             {announcements.length > 0 && (
//                                 <span className="tutor-announcements">
//                                     {announcements.length} new announcements
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </header>

//                 <div className="tutor-content">
//                     {renderDashboardContent()}

//                     {/* Recent Submissions Section - Always visible */}
//                     {activeSection === 'dashboard' && recentSubmissions.length > 0 && (
//                         <section className="tutor-section">
//                             <h2 className="tutor-section-title">Recent Submissions</h2>
//                             <div className="tutor-submissions-list">
//                                 {recentSubmissions.map(submission => (
//                                     <div key={submission._id} className="tutor-submission-card">
//                                         <div className="tutor-submission-header">
//                                             <h4 className="tutor-submission-title">
//                                                 {submission.subject.title}
//                                             </h4>
//                                             <span className="tutor-submission-date">
//                                                 {new Date(submission.submissions[0].submissionDate)
//                                                     .toLocaleDateString()}
//                                             </span>
//                                         </div>
//                                         <div className="tutor-submission-student">
//                                             <span>{submission.submissions[0].student.name}</span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Weekly Schedule Section - Always visible */}
//                     {activeSection === 'dashboard' && schedule.length > 0 && (
//                         <section className="tutor-section">
//                             <h2 className="tutor-section-title">Weekly Schedule</h2>
//                             <div className="tutor-schedule-grid">
//                                 {schedule.map(day => (
//                                     <div key={day._id} className="tutor-schedule-day">
//                                         <h3 className="tutor-day-title">{day._id}</h3>
//                                         <div className="tutor-day-lessons">
//                                             {day.lessons.map(lesson => (
//                                                 <div key={lesson._id} className="tutor-schedule-lesson">
//                                                     <span className="tutor-lesson-time">
//                                                         {new Date(lesson.startTime).toLocaleTimeString([], {
//                                                             hour: '2-digit',
//                                                             minute: '2-digit'
//                                                         })}
//                                                     </span>
//                                                     <span className="tutor-lesson-subject">
//                                                         {lesson.subject.title}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Attendance Stats Section */}
//                     {activeSection === 'dashboard' && attendanceStats.length > 0 && (
//                         <section className="tutor-section">
//                             <h2 className="tutor-section-title">Attendance Overview</h2>
//                             <div className="tutor-attendance-stats">
//                                 {attendanceStats.map(stat => (
//                                     <div key={stat._id} className="tutor-attendance-card">
//                                         <h4 className="tutor-attendance-type">{stat._id}</h4>
//                                         <div className="tutor-attendance-value">{stat.count}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default TutorDashboard;

import React, { useState } from 'react';
import ActiveClasses from './ActiveClasses';
import AssignmentManagement from './AssignmentMgt';
import AssessmentManagement from './AssessmentMgt';
import ScheduleManagement from './ScheduleMgt';
import StudentPerformance from './StudentPerformance';
import Messages from './Messages';

const TutorDashboard = () => {
    const [activeTab, setActiveTab] = useState('active-classes');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigationItems = [
        { id: 'active-classes', label: 'Active Classes', icon: '📚' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'assessments', label: 'Assessments', icon: '📋' },
        { id: 'schedule', label: 'Schedule', icon: '📅' },
        { id: 'performance', label: 'Student Performance', icon: '📊' },
        { id: 'messages', label: 'Messages', icon: '💬' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'active-classes':
                return <ActiveClasses />;
            case 'assignments':
                return <AssignmentManagement />;
            case 'assessments':
                return <AssessmentManagement />;
            case 'schedule':
                return <ScheduleManagement />;
            case 'performance':
                return <StudentPerformance />;
            case 'messages':
                return <Messages />;
            default:
                return <ActiveClasses />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Toggle Button for Mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed md:static w-64 bg-white shadow-lg h-screen transform 
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 transition-transform duration-200 ease-in-out
                z-40
            `}>
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">Tutor Dashboard</h1>
                    <p className="text-sm text-gray-600 mt-1">Welcome back!</p>
                </div>

                <nav className="mt-6">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                // Close sidebar on mobile when item is clicked
                                if (window.innerWidth < 768) {
                                    setSidebarOpen(false);
                                }
                            }}
                            className={`
                                w-full flex items-center px-6 py-3 text-left
                                ${activeTab === item.id 
                                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {localStorage.getItem('userName')?.charAt(0) || 'T'}
                        </div>
                        <div className="ml-3">
                            <p className="font-medium">{localStorage.getItem('userName') || 'Tutor'}</p>
                            <p className="text-sm text-gray-600">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-0 transition-margin duration-200 ease-in-out">
                <div className="h-screen overflow-auto">
                    {/* Mobile Header */}
                    <div className="md:hidden p-4 bg-white shadow-sm">
                        <h1 className="text-xl font-bold">{
                            navigationItems.find(item => item.id === activeTab)?.label
                        }</h1>
                    </div>

                    {/* Content Area */}
                    <div className="p-4">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default TutorDashboard;