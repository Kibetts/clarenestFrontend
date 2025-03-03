// import React, { useState, useEffect } from 'react';
// import '../css/Attendance.css';

// const Attendance = () => {
//     const [attendance, setAttendance] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedSubject, setSelectedSubject] = useState('all');
//     const [subjects, setSubjects] = useState([]);
//     const [attendanceStats, setAttendanceStats] = useState({
//         present: 0,
//         absent: 0,
//         late: 0,
//         total: 0
//     });

//     useEffect(() => {
//         fetchAttendanceData();
//     }, []);

//     const fetchAttendanceData = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/dashboard/student/attendance', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch attendance data');
//             }

//             const data = await response.json();
//             const attendanceRecords = data.data.attendance;

//             // Extract unique subjects
//             const uniqueSubjects = [...new Set(attendanceRecords.map(
//                 record => record.lesson.subject.title
//             ))];
//             setSubjects(uniqueSubjects);

//             // Calculate overall statistics
//             const stats = attendanceRecords.reduce((acc, record) => {
//                 const status = record.attendees.find(
//                     a => a.student === localStorage.getItem('userId')
//                 )?.status.toLowerCase();

//                 if (status) {
//                     acc[status]++;
//                     acc.total++;
//                 }
//                 return acc;
//             }, { present: 0, absent: 0, late: 0, total: 0 });

//             setAttendanceStats(stats);
//             setAttendance(attendanceRecords);
//             setLoading(false);
//         } catch (err) {
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     const getAttendancePercentage = () => {
//         if (attendanceStats.total === 0) return 0;
//         return ((attendanceStats.present / attendanceStats.total) * 100).toFixed(1);
//     };

//     const getSubjectAttendance = (subjectTitle) => {
//         const subjectRecords = attendance.filter(
//             record => record.lesson.subject.title === subjectTitle
//         );

//         return subjectRecords.reduce((acc, record) => {
//             const status = record.attendees.find(
//                 a => a.student === localStorage.getItem('userId')
//             )?.status.toLowerCase();

//             if (status) {
//                 acc[status]++;
//                 acc.total++;
//             }
//             return acc;
//         }, { present: 0, absent: 0, late: 0, total: 0 });
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const formatTime = (dateString) => {
//         return new Date(dateString).toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const filteredAttendance = selectedSubject === 'all'
//         ? attendance
//         : attendance.filter(record => record.lesson.subject.title === selectedSubject);

//     if (loading) return <div className="attendance-loading">Loading...</div>;
//     if (error) return <div className="attendance-error">{error}</div>;

//     return (
//         <div className="attendance-container">
//             <header className="attendance-header">
//                 <h2>Attendance Record</h2>
//                 <div className="attendance-summary">
//                     <div className="attendance-stat overall">
//                         <h3>Overall Attendance</h3>
//                         <div className="attendance-percentage">
//                             {getAttendancePercentage()}%
//                         </div>
//                         <div className="attendance-chart">
//                             <div className="chart-bar">
//                                 <div 
//                                     className="chart-fill"
//                                     style={{ width: `${getAttendancePercentage()}%` }}
//                                 ></div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="attendance-stats">
//                         <div className="stat present">
//                             <span className="stat-label">Present</span>
//                             <span className="stat-value">{attendanceStats.present}</span>
//                         </div>
//                         <div className="stat absent">
//                             <span className="stat-label">Absent</span>
//                             <span className="stat-value">{attendanceStats.absent}</span>
//                         </div>
//                         <div className="stat late">
//                             <span className="stat-label">Late</span>
//                             <span className="stat-value">{attendanceStats.late}</span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <div className="attendance-content">
//                 <div className="subject-attendance">
//                     <h3>Attendance by Subject</h3>
//                     <div className="subject-cards">
//                         {subjects.map(subject => {
//                             const stats = getSubjectAttendance(subject);
//                             const percentage = stats.total === 0 ? 0 : 
//                                 ((stats.present / stats.total) * 100).toFixed(1);
                            
//                             return (
//                                 <div key={subject} className="subject-card">
//                                     <h4>{subject}</h4>
//                                     <div className="subject-percentage">
//                                         {percentage}%
//                                     </div>
//                                     <div className="subject-stats">
//                                         <span>Present: {stats.present}</span>
//                                         <span>Absent: {stats.absent}</span>
//                                         <span>Late: {stats.late}</span>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 <div className="attendance-records">
//                     <div className="records-header">
//                         <h3>Detailed Records</h3>
//                         <select
//                             value={selectedSubject}
//                             onChange={(e) => setSelectedSubject(e.target.value)}
//                             className="subject-filter"
//                         >
//                             <option value="all">All Subjects</option>
//                             {subjects.map(subject => (
//                                 <option key={subject} value={subject}>
//                                     {subject}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="records-list">
//                         {filteredAttendance.map(record => {
//                             const studentAttendance = record.attendees.find(
//                                 a => a.student === localStorage.getItem('userId')
//                             );

//                             return (
//                                 <div 
//                                     key={record._id} 
//                                     className={`record-item ${studentAttendance?.status.toLowerCase()}`}
//                                 >
//                                     <div className="record-subject">
//                                         {record.lesson.subject.title}
//                                     </div>
//                                     <div className="record-info">
//                                         <div className="record-date">
//                                             {formatDate(record.date)}
//                                         </div>
//                                         <div className="record-time">
//                                             {formatTime(record.lesson.startTime)} - {formatTime(record.lesson.endTime)}
//                                         </div>
//                                     </div>
//                                     <div className="record-status">
//                                         {studentAttendance?.status}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                         {filteredAttendance.length === 0 && (
//                             <div className="no-records">
//                                 No attendance records found for the selected subject
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Attendance;

import React, { useState, useEffect } from 'react';
import '../css/Attendance.css';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState({
        records: [],
        statistics: {
            totalClasses: 0,
            presentClasses: 0,
            percentage: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard/student/attendance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }

            const data = await response.json();
            if (data.status === 'success') {
                setAttendanceData(data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to load attendance data');
            setLoading(false);
        }
    };

    if (loading) return <div className="attendance-loading">Loading...</div>;
    if (error) return <div className="attendance-error">{error}</div>;

    return (
        <div className="attendance-container">
            <header className="attendance-header">
                <h2>Attendance Record</h2>
                <div className="attendance-summary">
                    <div className="attendance-stat">
                        <h3>Overall Attendance</h3>
                        <div className="attendance-percentage">
                            {attendanceData.statistics.percentage.toFixed(1)}%
                        </div>
                    </div>
                    <div className="attendance-stats">
                        <div className="stat">
                            <span>Total Classes</span>
                            <span>{attendanceData.statistics.totalClasses}</span>
                        </div>
                        <div className="stat">
                            <span>Present</span>
                            <span>{attendanceData.statistics.presentClasses}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="attendance-records">
                {attendanceData.records && attendanceData.records.length > 0 ? (
                    <div className="records-list">
                        {attendanceData.records.map((record, index) => (
                            <div key={record._id || index} className="record-item">
                                <div className="record-date">
                                    {new Date(record.date).toLocaleDateString()}
                                </div>
                                <div className="record-details">
                                    <div className="record-subject">
                                        {record.lesson?.subject?.title || 'N/A'}
                                    </div>
                                    <div className="record-tutor">
                                        {record.lesson?.tutor?.name || 'N/A'}
                                    </div>
                                </div>
                                <div className={`record-status ${record.attendees?.[0]?.status?.toLowerCase() || 'absent'}`}>
                                    {record.attendees?.[0]?.status || 'Absent'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-records">No attendance records found</div>
                )}
            </div>
        </div>
    );
};

export default Attendance;