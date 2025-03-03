// import React, { useState, useEffect } from 'react';
// import '../css/StudentDashboard.css';

// const StudentDashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [dashboardData, setDashboardData] = useState({
//         student: {
//             name: '',
//             email: '',
//             grade: '',
//         },
//         dashboard: {
//             upcomingLessons: [],
//             activeAssignments: [],
//             upcomingAssessments: [],
//             recentGrades: [],
//             overallGrade: null,
//             attendance: {
//                 records: [],
//                 percentage: 0
//             },
//             courseMaterials: [],
//             unreadMessages: 0,
//             announcements: [],
//             schedule: [{ lessons: [] }]
//         }
//     });

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No authentication token found');
//             }
    
//             const response = await fetch('https://clarenest-6bd4.onrender.com/api/dashboard/student', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 credentials: 'include'
//             });
    
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to fetch dashboard data');
//             }
    
//             const data = await response.json();
//             const processedData = {
//                 // student: {
//                 //     ...dashboardData.student,
//                 //     ...data.data.student
//                 // },
//                 student: data.data.student,

//                 dashboard: {
//                     ...dashboardData.dashboard,
//                     ...data.data.dashboard,
//                     attendance: {
//                         ...dashboardData.dashboard.attendance,
//                         ...data.data.dashboard.attendance
//                     }
//                 }
//             };
            
//             setDashboardData(processedData);
//             setLoading(false);
//         } catch (err) {
//             console.error('Dashboard fetch error:', err);
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="student-loading">Loading...</div>;
//     if (error) return <div className="student-error">{error}</div>;

//     const {
//         student,
//         dashboard: {
//             upcomingLessons = [],
//             activeAssignments = [],
//             upcomingAssessments = [],
//             recentGrades = [],
//             overallGrade,
//             attendance,
//             courseMaterials = [],
//             unreadMessages = 0,
//             announcements = [],
//             schedule = [{ lessons: [] }]
//         }
//     } = dashboardData;

   

//     return (
//         <div className="student-dashboard">
//             <header className="student-header">
//                 <div className="student-header-content">
//                     <h1 className="student-welcome">Welcome, {student?.name || 'Student'}</h1>
//                     <div className="student-info">
//                         <span className="student-grade">Grade {student?.grade || 'N/A'}</span>
//                         <span className="student-messages">
//                             {unreadMessages} new messages
//                         </span>
//                     </div>
//                 </div>
//             </header>

//             <div className="student-grid">
//                 {/* Schedule Section */}
//                 <section className="student-schedule-section">
//                     <h2 className="student-section-title">Today's Schedule</h2>
//                     <div className="student-timeline">
//                         {schedule[0]?.lessons?.map(lesson => (
//                             <div key={lesson._id} className="student-timeline-item">

//                                 <div className="student-timeline-time">
//                                     {new Date(lesson.startTime).toLocaleTimeString([], { 
//                                         hour: '2-digit', 
//                                         minute: '2-digit' 
//                                     })}
//                                     {' - '}
//                                     {new Date(lesson.endTime).toLocaleTimeString([], { 
//                                         hour: '2-digit', 
//                                         minute: '2-digit' 
//                                     })}
//                                 </div>
                                
//                                     <div className="student-timeline-content">
//                                     <h4 className="student-timeline-subject">
//                                         {lesson.subject?.title || 'N/A'}
//                                     </h4>
//                                     <p className="student-timeline-tutor">
//                                         Tutor: {lesson.tutor?.name || 'N/A'}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                         {!schedule[0]?.lessons?.length && (
//                             <p className="student-no-lessons">No lessons scheduled for today</p>
//                         )}
//                     </div>
//                 </section>

//                 {/* Upcoming Lessons Section */}
//                 <section className="student-lessons-section">
//                     <h2 className="student-section-title">Upcoming Lessons</h2>
//                     <div className="student-lessons-grid">
//                         {upcomingLessons?.map(lesson => (
//                             <div key={lesson._id} className="student-lesson-card">
//                                 <div className="student-lesson-header">
//                                     <h4 className="student-lesson-title">
//                                         {lesson.subject?.title || 'N/A'}
//                                     </h4>
//                                     <span className="student-lesson-time">
//                                         {new Date(lesson.startTime).toLocaleString()}
//                                     </span>
//                                 </div>
//                                 <div className="student-lesson-details">
//                                     <p className="student-lesson-tutor">
//                                         Tutor: {lesson.tutor?.name || 'N/A'}
//                                     </p>
//                                     <p className="student-lesson-duration">
//                                         Duration: {lesson.duration || 0} minutes
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                         {!upcomingLessons?.length && (
//                             <p className="student-no-lessons">No upcoming lessons scheduled</p>
//                         )}
//                     </div>
//                 </section>

//                 {/* Academic Progress Section */}
//                 <section className="student-progress-section">
//                     <h2 className="student-section-title">Academic Progress</h2>
//                     <div className="student-progress-stats">
//                         <div className="student-stat-card">
//                             <h3 className="student-stat-title">Overall Grade</h3>
//                             <span className="student-grade-value">
//                                 {overallGrade ? `${overallGrade.toFixed(1)}%` : 'N/A'}
//                             </span>
//                         </div>
//                         <div className="student-stat-card">
//                             <h3 className="student-stat-title">Attendance</h3>
//                             <span className="student-attendance-value">
//                                 {(attendance?.percentage || 0).toFixed(1)}%
//                             </span>
//                         </div>
//                     </div>
                    
//                     <div className="student-grades">
//                         <h3 className="student-grades-title">Recent Grades</h3>
//                         <div className="student-grades-list">
//                             {recentGrades?.map(grade => (
//                                 <div key={grade._id} className="student-grade-item">
//                                     <span className="student-grade-subject">
//                                         {grade.subject?.title || 'N/A'}
//                                     </span>
//                                     <span className="student-grade-score">
//                                         {grade.score || 0}%
//                                     </span>
//                                 </div>
//                             ))}
//                             {!recentGrades?.length && (
//                                 <p className="student-no-grades">No recent grades available</p>
//                             )}
//                         </div>
//                     </div>
//                 </section>

//                 {/* Tasks Section */}
//                 <section className="student-tasks-section">
//                     <h2 className="student-section-title">Upcoming Tasks</h2>
                    
//                     <div className="student-tasks-container">
//                         <div className="student-assignments">
//                             <h3 className="student-tasks-subtitle">Assignments Due</h3>
//                             <ul className="student-tasks-list">
//                                 {activeAssignments?.map(assignment => (
//                                     <li key={assignment._id} className="student-task-item">
//                                         <div className="student-task-info">
//                                             <h4 className="student-task-title">
//                                                 {assignment.title || 'Untitled Assignment'}
//                                             </h4>
//                                             <p className="student-task-subject">
//                                                 {assignment.subject?.title || 'N/A'}
//                                             </p>
//                                         </div>
//                                         <div className="student-task-due">
//                                             Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                                         </div>
//                                     </li>
//                                 ))}
//                                 {!activeAssignments?.length && (
//                                     <li className="student-no-tasks">No pending assignments</li>
//                                 )}
//                             </ul>
//                         </div>

//                         <div className="student-assessments">
//                             <h3 className="student-tasks-subtitle">Upcoming Assessments</h3>
//                             <ul className="student-tasks-list">
//                                 {upcomingAssessments?.map(assessment => (
//                                     <li key={assessment._id} className="student-task-item">
//                                         <div className="student-task-info">
//                                             <h4 className="student-task-title">
//                                                 {assessment.title || 'Untitled Assessment'}
//                                             </h4>
//                                             <p className="student-task-subject">
//                                                 {assessment.subject?.title || 'N/A'}
//                                             </p>
//                                         </div>
//                                         <div className="student-task-due">
//                                             Due: {new Date(assessment.dueDate).toLocaleDateString()}
//                                         </div>
//                                     </li>
//                                 ))}
//                                 {!upcomingAssessments?.length && (
//                                     <li className="student-no-tasks">No upcoming assessments</li>
//                                 )}
//                             </ul>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Course Materials Section */}
//                 <section className="student-materials-section">
//                     <h2 className="student-section-title">Course Materials</h2>
//                     <div className="student-materials-grid">
//                         {courseMaterials?.map(material => (
//                             <div key={material._id} className="student-material-card">
//                                 <div className="student-material-icon">
//                                     {material.type === 'document' && '📄'}
//                                     {material.type === 'video' && '🎥'}
//                                     {material.type === 'link' && '🔗'}
//                                 </div>
//                                 <div className="student-material-info">
//                                     <h4 className="student-material-title">
//                                         {material.title || 'Untitled Material'}
//                                     </h4>
//                                     <p className="student-material-subject">
//                                         {material.subject?.title || 'N/A'}
//                                     </p>
//                                     <span className="student-material-date">
//                                         Added: {new Date(material.createdAt).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                         {!courseMaterials?.length && (
//                             <p className="student-no-materials">No course materials available</p>
//                         )}
//                     </div>
//                 </section>

//                 {/* Announcements Section */}
//                 <section className="student-announcements-section">
//                     <h2 className="student-section-title">Announcements</h2>
//                     <div className="student-announcements-list">
//                         {announcements?.map(announcement => (
//                             <div key={announcement._id} className="student-announcement-card">
//                                 <div className="student-announcement-header">
//                                     <span className="student-announcement-date">
//                                         {new Date(announcement.createdAt).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 <div className="student-announcement-content">
//                                     {announcement.message || 'No content'}
//                                 </div>
//                             </div>
//                         ))}
//                         {!announcements?.length && (
//                             <p className="student-no-announcements">No announcements available</p>
//                         )}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default StudentDashboard;










// import React, { useState, useEffect } from 'react';
// import '../css/StudentDashboard.css';

// const StudentDashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeNavItem, setActiveNavItem] = useState('dashboard');
//     const [dashboardData, setDashboardData] = useState({
//         student: {
//             name: '',
//             email: '',
//             grade: '',
//         },
//         dashboard: {
//             schedule: [{ lessons: [] }],
//             upcomingLessons: [],
//             attendance: {
//                 records: [],
//                 percentage: 0
//             },
//             activeAssignments: [],
//             upcomingAssessments: [],
//             enrollments: []
//         }
//     });

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             const response = await fetch('https://clarenest-6bd4.onrender.com/api/dashboard/student', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to fetch dashboard data');
//             }

//             const data = await response.json();
//             setDashboardData(data.data);
//             setLoading(false);
//         } catch (err) {
//             console.error('Dashboard fetch error:', err);
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     const formatTime = (dateString) => {
//         if (!dateString) return '';
//         return new Date(dateString).toLocaleTimeString([], { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//         });
//     };

//     const navigationItems = [
//         { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
//         { id: 'courses', label: 'Courses & Materials', icon: '📚' },
//         { id: 'assignments', label: 'Assignments', icon: '📝' },
//         { id: 'grades', label: 'Grades', icon: '📊' },
//         { id: 'calendar', label: 'Calendar', icon: '📅' },
//         { id: 'attendance', label: 'Attendance', icon: '✓' },
//         { id: 'messages', label: 'Messages', icon: '💬' },
//         { id: 'settings', label: 'Settings', icon: '⚙️' }
//     ];

//     const renderSchedule = () => {
//         const todaySchedule = dashboardData.dashboard.schedule[0];
//         if (!todaySchedule || !todaySchedule.lessons || todaySchedule.lessons.length === 0) {
//             return <p className="student-no-lessons">No classes scheduled for today</p>;
//         }

//         return todaySchedule.lessons.map((lesson, index) => (
//             <div key={lesson._id || index} className="student-timeline-item">
//                 <div className="student-timeline-time">
//                     {formatTime(lesson.schedule[0]?.startTime)} - {formatTime(lesson.schedule[0]?.endTime)}
//                 </div>
//                 <div className="student-timeline-content">
//                     <h4 className="student-timeline-subject">
//                         {lesson.subject?.title || 'Untitled'}
//                     </h4>
//                     <p className="student-timeline-tutor">
//                         Tutor: {lesson.tutor?.name || 'Not assigned'}
//                     </p>
//                 </div>
//             </div>
//         ));
//     };

//     const renderMainContent = () => {
//         switch (activeNavItem) {
//             case 'dashboard':
//                 return (
//                     <>
//                         <section className="student-schedule-section">
//                             <h2 className="student-section-title">
//                                 <span className="section-icon">📅</span>
//                                 Today's Schedule
//                             </h2>
//                             <div className="student-timeline">
//                                 {renderSchedule()}
//                             </div>
//                         </section>

//                         <section className="student-progress-section">
//                             <h2 className="student-section-title">
//                                 <span className="section-icon">📚</span>
//                                 Enrolled Subjects
//                             </h2>
//                             <div className="student-materials-grid">
//                                 {dashboardData.dashboard.enrollments.map((enrollment) => (
//                                     <div key={enrollment._id} className="student-material-card">
//                                         <h3 className="student-material-title">
//                                             {enrollment.subject.title}
//                                         </h3>
//                                         <p className="student-material-info">
//                                             Tutor: {enrollment.subject.tutor?.name || 'Not assigned'}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>

//                         <section className="student-attendance-section">
//                             <h2 className="student-section-title">
//                                 <span className="section-icon">📍</span>
//                                 Attendance
//                             </h2>
//                             <div className="student-stat-card">
//                                 <h3 className="student-stat-title">Overall Attendance</h3>
//                                 <span className="student-attendance-value">
//                                     {dashboardData.dashboard.attendance.percentage.toFixed(1)}%
//                                 </span>
//                                 <div className="attendance-graph">
//                                     <div className="graph-bars">
//                                         <div className="graph-bar-container">
//                                             <div 
//                                                 className="graph-bar"
//                                                 style={{ 
//                                                     height: `${dashboardData.dashboard.attendance.percentage}%` 
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                     </>
//                 );
//             case 'courses':
//                 return (
//                     <div className="student-content-section">
//                         <h2 className="student-section-title">My Courses</h2>
//                         {/* Add courses content here */}
//                     </div>
//                 );
//             // Add other cases for different navigation items
//             default:
//                 return (
//                     <div className="student-content-section">
//                         <h2 className="student-section-title">Section Under Development</h2>
//                     </div>
//                 );
//         }
//     };

//     if (loading) return (
//         <div className="student-loading">
//             <div className="loading-spinner"></div>
//         </div>
//     );

//     if (error) return (
//         <div className="student-error">
//             <span className="error-icon">⚠️</span>
//             <p>{error}</p>
//         </div>
//     );

//     return (
//         <div className="student-dashboard-container">
//             <nav className="student-sidebar">
//                 <div className="sidebar-header">
//                     <h2>Student Portal</h2>
//                     <p className="student-name">{dashboardData.student?.name}</p>
//                 </div>
//                 <ul className="sidebar-nav">
//                     {navigationItems.map(item => (
//                         <li 
//                             key={item.id}
//                             className={`sidebar-nav-item ${activeNavItem === item.id ? 'active' : ''}`}
//                             onClick={() => setActiveNavItem(item.id)}
//                         >
//                             <span className="nav-icon">{item.icon}</span>
//                             <span className="nav-label">{item.label}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>

//             <main className="student-main-content">
//                 <header className="student-header">
//                     <div className="student-header-content">
//                         <h1 className="student-welcome">Welcome, {dashboardData.student?.name}</h1>
//                         <div className="student-info">
//                             <span className="student-grade">Grade {dashboardData.student?.grade}</span>
//                         </div>
//                     </div>
//                 </header>

//                 <div className="student-content-grid">
//                     {renderMainContent()}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default StudentDashboard;



import React, { useState, useEffect } from 'react';
import '../css/StudentDashboard.css';
import CourseMaterials from '../StudentDashComponents/CourseMaterials';
import Assignments from '../StudentDashComponents/Assignments';
import Grades from '../StudentDashComponents/Grades';
import CalendarSt from '../StudentDashComponents/CalendarSt';
import Attendance from '../StudentDashComponents/Attendance';
import Messages from './Messages';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeNavItem, setActiveNavItem] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState({
        student: {
            name: '',
            email: '',
            grade: '',
        },
        dashboard: {
            schedule: [{ lessons: [] }],
            upcomingLessons: [],
            attendance: {
                records: [],
                percentage: 0
            },
            activeAssignments: [],
            upcomingAssessments: [],
            enrollments: []
        }
    });

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
            console.error('Dashboard fetch error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
        { id: 'courses', label: 'Courses & Materials', icon: '📚' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'grades', label: 'Grades', icon: '📊' },
        { id: 'calendar', label: 'Calendar', icon: '📅' },
        { id: 'attendance', label: 'Attendance', icon: '✓' },
        { id: 'messages', label: 'Messages', icon: '💬' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    const renderDashboardContent = () => {
        // Render the overview dashboard content
        return (
            <>
                <section className="student-schedule-section">
                    <h2 className="student-section-title">
                        <span className="section-icon">📅</span>
                        Today's Schedule
                    </h2>
                    <div className="student-timeline">
                        {dashboardData.dashboard.schedule[0]?.lessons.map((lesson, index) => (
                            <div key={lesson._id || index} className="student-timeline-item">
                                <div className="student-timeline-time">
                                    {new Date(lesson.startTime).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })} - {new Date(lesson.endTime).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </div>
                                <div className="student-timeline-content">
                                    <h4 className="student-timeline-subject">
                                        {lesson.subject?.title || 'Untitled'}
                                    </h4>
                                    <p className="student-timeline-tutor">
                                        Tutor: {lesson.tutor?.name || 'Not assigned'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!dashboardData.dashboard.schedule[0]?.lessons.length && (
                            <p className="student-no-lessons">No classes scheduled for today</p>
                        )}
                    </div>
                </section>

                <section className="student-progress-section">
                    <h2 className="student-section-title">
                        <span className="section-icon">📈</span>
                        Progress Overview
                    </h2>
                    <div className="student-stats">
                        <div className="student-stat attendance">
                            <h3>Attendance</h3>
                            <div className="stat-value">
                                {dashboardData.dashboard.attendance.percentage.toFixed(1)}%
                            </div>
                        </div>
                        {/* Add more stats as needed */}
                    </div>
                </section>
            </>
        );
    };

    const renderMainContent = () => {
        switch (activeNavItem) {
            case 'dashboard':
                return renderDashboardContent();
            case 'courses':
                return <CourseMaterials />;
            case 'assignments':
                return <Assignments />;
            case 'grades':
                return <Grades />;
            case 'calendar':
                return <CalendarSt />;
            case 'attendance':
                return <Attendance />;
            case 'messages':
                return <Messages />;
            case 'settings':
                return (
                    <div className="student-content-section">
                        <h2 className="student-section-title">Settings (Coming Soon)</h2>
                    </div>
                );
            default:
                return (
                    <div className="student-content-section">
                        <h2 className="student-section-title">Section Under Development</h2>
                    </div>
                );
        }
    };

    if (loading) return <div className="student-loading">Loading...</div>;
    if (error) return <div className="student-error">{error}</div>;

    return (
        <div className="student-dashboard-container">
            <nav className="student-sidebar">
                <div className="sidebar-header">
                    <h2>Student Portal</h2>
                    <p className="student-name">{dashboardData.student?.name}</p>
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

            <main className="student-main-content">
                <header className="student-header">
                    <div className="student-header-content">
                        <h1 className="student-welcome">Welcome, {dashboardData.student?.name}</h1>
                        <div className="student-info">
                            <span className="student-grade">Grade {dashboardData.student?.grade}</span>
                        </div>
                    </div>
                </header>

                <div className="student-content-grid">
                    {renderMainContent()}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;