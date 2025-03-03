import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const StudentsPerformanceDetails = () => {
    const { studentId, subjectId } = useParams();
    const navigate = useNavigate();
    const [performanceData, setPerformanceData] = useState({
        assessments: [],
        assignments: [],
        attendance: [],
        trends: [],
        comparison: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('semester');

    const COLORS = ['#2F5D9E', '#4CAF50', '#FFC107', '#F44336'];

    useEffect(() => {
        fetchDetailedPerformance();
    }, [studentId, subjectId, timeRange]);

    const fetchDetailedPerformance = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${studentId}/performance?subject=${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch detailed performance data');
            const data = await response.json();
            setPerformanceData(data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const calculateGradeDistribution = () => {
        const allGrades = [...performanceData.assessments, ...performanceData.assignments]
            .map(item => item.score);
        
        return [
            { name: 'A (90-100)', value: allGrades.filter(grade => grade >= 90).length },
            { name: 'B (80-89)', value: allGrades.filter(grade => grade >= 80 && grade < 90).length },
            { name: 'C (70-79)', value: allGrades.filter(grade => grade >= 70 && grade < 80).length },
            { name: 'D/F (<70)', value: allGrades.filter(grade => grade < 70).length }
        ];
    };

    const renderPerformanceTrends = () => (
        <div className="spd-trends-card">
            <h3 className="spd-section-title">Performance Trends</h3>
            <div className="spd-chart-container">
                <LineChart
                    width={800}
                    height={400}
                    data={performanceData.trends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="assessmentScore" 
                        name="Assessments" 
                        stroke="#2F5D9E" 
                        activeDot={{ r: 8 }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="assignmentScore" 
                        name="Assignments" 
                        stroke="#4CAF50" 
                        activeDot={{ r: 8 }} 
                    />
                </LineChart>
            </div>
        </div>
    );

    const renderGradeDistribution = () => (
        <div className="spd-distribution-card">
            <h3 className="spd-section-title">Grade Distribution</h3>
            <div className="spd-chart-container">
                <PieChart width={400} height={400}>
                    <Pie
                        data={calculateGradeDistribution()}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {calculateGradeDistribution().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        </div>
    );

    const renderClassComparison = () => (
        <div className="spd-comparison-card">
            <h3 className="spd-section-title">Class Comparison</h3>
            <div className="spd-chart-container">
                <BarChart
                    width={800}
                    height={400}
                    data={performanceData.comparison}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                        dataKey="studentScore" 
                        name="Student Score" 
                        fill="#2F5D9E" 
                    />
                    <Bar 
                        dataKey="classAverage" 
                        name="Class Average" 
                        fill="#4CAF50" 
                    />
                </BarChart>
            </div>
        </div>
    );

    const renderAttendanceRecord = () => (
        <div className="spd-attendance-card">
            <h3 className="spd-section-title">Attendance Record</h3>
            <div className="spd-attendance-stats">
                <div className="spd-stat-item">
                    <span className="spd-stat-value">
                        {(performanceData.attendance.presentPercentage || 0).toFixed(1)}%
                    </span>
                    <span className="spd-stat-label">Attendance Rate</span>
                </div>
                <div className="spd-stat-item">
                    <span className="spd-stat-value">
                        {performanceData.attendance.totalClasses || 0}
                    </span>
                    <span className="spd-stat-label">Total Classes</span>
                </div>
                <div className="spd-stat-item">
                    <span className="spd-stat-value">
                        {performanceData.attendance.absences || 0}
                    </span>
                    <span className="spd-stat-label">Absences</span>
                </div>
            </div>
            <div className="spd-attendance-detail">
                <div className="spd-attendance-dates">
                    {performanceData.attendance.records?.map((record, index) => (
                        <div 
                            key={index} 
                            className={`spd-attendance-date ${record.status.toLowerCase()}`}
                        >
                            <div className="spd-date">{new Date(record.date).toLocaleDateString()}</div>
                            <div className="spd-status">{record.status}</div>
                            {record.note && (
                                <div className="spd-note">{record.note}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="spd-loading">Loading detailed performance data...</div>;
    if (error) return <div className="spd-error">Error: {error}</div>;

    return (
        <div className="spd-container">
            <div className="spd-header">
                <button 
                    className="spd-back-button"
                    onClick={() => navigate(-1)} 
                >
                    ← Back to Performance Overview
                </button>
                <h2 className="spd-title">Detailed Performance Analysis</h2>
                <div className="spd-time-range">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="spd-select"
                    >
                        <option value="semester">This Semester</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            <div className="spd-content">
                <div className="spd-summary-cards">
                    <div className="spd-summary-card">
                        <h3>Overall Grade</h3>
                        <div className="spd-grade">
                            {performanceData.overallGrade}%
                        </div>
                    </div>
                    <div className="spd-summary-card">
                        <h3>Class Rank</h3>
                        <div className="spd-rank">
                            {performanceData.rank} of {performanceData.totalStudents}
                        </div>
                    </div>
                    <div className="spd-summary-card">
                        <h3>Progress</h3>
                        <div className="spd-progress">
                            {performanceData.progressIndicator}
                        </div>
                    </div>
                </div>

                <div className="spd-main-content">
                    {renderPerformanceTrends()}
                    <div className="spd-grid">
                        {renderGradeDistribution()}
                        {renderClassComparison()}
                    </div>
                    {renderAttendanceRecord()}
                </div>
            </div>
        </div>
    );
};

export default StudentsPerformanceDetails;