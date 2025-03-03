import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StudentPerformance = () => {
    const [viewMode, setViewMode] = useState('class');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [performanceData, setPerformanceData] = useState({
        classPerformance: null,
        individualPerformance: [],
        subjects: [],
        students: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchPerformanceData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard/tutor', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch performance data');
            const data = await response.json();
            setPerformanceData(data.data.dashboard.studentPerformance || {});
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleViewDetailedReport = (studentId, subjectId) => {
        navigate(`/tutor/performance/student/${studentId}/subject/${subjectId}`);
    };

    const getGradeBadgeClass = (score) => {
        if (score >= 80) return 'sp-grade-excellent';
        if (score >= 60) return 'sp-grade-good';
        return 'sp-grade-poor';
    };

    const renderPerformanceCard = (data) => {
        return (
            <div className="sp-performance-card">
                <div className="sp-performance-header">
                    <h3 className="sp-subject-title">{data.subject}</h3>
                    <span className={`sp-grade-badge ${getGradeBadgeClass(data.averageScore)}`}>
                        {data.averageScore.toFixed(1)}%
                    </span>
                </div>
                <div className="sp-performance-details">
                    <div className="sp-stats-grid">
                        <div className="sp-stat-item">
                            <span className="sp-stat-label">Highest Score</span>
                            <span className="sp-stat-value">{data.highestScore}%</span>
                        </div>
                        <div className="sp-stat-item">
                            <span className="sp-stat-label">Average Score</span>
                            <span className="sp-stat-value">{data.averageScore}%</span>
                        </div>
                        <div className="sp-stat-item">
                            <span className="sp-stat-label">Lowest Score</span>
                            <span className="sp-stat-value">{data.lowestScore}%</span>
                        </div>
                    </div>
                    {data.progressData && (
                        <div className="sp-chart-container">
                            <LineChart
                                width={600}
                                height={300}
                                data={data.progressData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#2F5D9E" 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        </div>
                    )}
                </div>
                <button
                    className="sp-view-details-btn"
                    onClick={() => handleViewDetailedReport(selectedStudent, data.subject)}
                >
                    View Detailed Report
                </button>
            </div>
        );
    };

    const renderClassPerformance = () => (
        <div className="sp-class-performance">
            <div className="sp-overview-card">
                <h3 className="sp-section-title">Class Overview</h3>
                <div className="sp-metrics-grid">
                    <div className="sp-metric-item">
                        <span className="sp-metric-label">Class Average</span>
                        <span className="sp-metric-value">
                            {performanceData.classPerformance.average.toFixed(1)}%
                        </span>
                    </div>
                    <div className="sp-metric-item">
                        <span className="sp-metric-label">Highest Performer</span>
                        <span className="sp-metric-value good">
                            {performanceData.classPerformance.highest.toFixed(1)}%
                        </span>
                    </div>
                    <div className="sp-metric-item">
                        <span className="sp-metric-label">Needs Improvement</span>
                        <span className="sp-metric-value poor">
                            {performanceData.classPerformance.lowest.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="sp-subjects-grid">
                {performanceData.subjects.map((subject) => renderPerformanceCard(subject))}
            </div>
        </div>
    );

    const renderIndividualPerformance = () => (
        <div className="sp-individual-performance">
            <div className="sp-student-selector">
                <select
                    value={selectedStudent || ''}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="sp-select"
                >
                    <option value="">Select a student</option>
                    {performanceData.students.map((student) => (
                        <option key={student._id} value={student._id}>
                            {student.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedStudent && (
                <div className="sp-student-details">
                    {performanceData.individualPerformance
                        .filter(perf => perf.studentId === selectedStudent)
                        .map((performance) => (
                            <div key={performance.subject} className="sp-subject-detail">
                                {renderPerformanceCard({
                                    subject: performance.subject,
                                    scores: performance.scores,
                                    progressData: performance.progressData
                                })}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );

    if (loading) return <div className="sp-loading">Loading performance data...</div>;
    if (error) return <div className="sp-error">Error: {error}</div>;

    return (
        <div className="sp-container">
            <div className="sp-header">
                <h2 className="sp-title">Student Performance</h2>
                <p className="sp-subtitle">Track and analyze student progress across all subjects</p>
            </div>

            <div className="sp-view-toggle">
                <button
                    className={`sp-toggle-button ${viewMode === 'class' ? 'active' : ''}`}
                    onClick={() => setViewMode('class')}
                >
                    Class Performance
                </button>
                <button
                    className={`sp-toggle-button ${viewMode === 'individual' ? 'active' : ''}`}
                    onClick={() => setViewMode('individual')}
                >
                    Individual Performance
                </button>
            </div>

            {viewMode === 'class' ? renderClassPerformance() : renderIndividualPerformance()}
        </div>
    );
};

export default StudentPerformance;