import React, { useState, useEffect } from 'react';
import '../css/Grades.css';

const Grades = () => {
    const [assessments, setAssessments] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetchGradesData();
    }, []);

    const fetchGradesData = async () => {
        try {
            const [assessmentsResponse, resultsResponse] = await Promise.all([
                fetch('http://localhost:5000/api/dashboard/student/assessments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/dashboard/student/grades', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            if (!assessmentsResponse.ok || !resultsResponse.ok) {
                throw new Error('Failed to fetch grades data');
            }

            const assessmentsData = await assessmentsResponse.json();
            const resultsData = await resultsResponse.json();

            setAssessments(assessmentsData.data.assessments);
            setResults(resultsData.data.results);

            // Extract unique subjects
            const uniqueSubjects = new Set([
                ...assessmentsData.data.assessments.map(a => a.subject.title),
                ...resultsData.data.results.map(r => r.subject.title)
            ]);
            setSubjects(Array.from(uniqueSubjects));

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const calculateOverallGrade = () => {
        if (results.length === 0) return 'N/A';
        const totalScore = results.reduce((sum, result) => sum + result.score, 0);
        const average = totalScore / results.length;
        return average.toFixed(1) + '%';
    };

    const getGradeLetter = (score) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    const getSubjectAverage = (subjectTitle) => {
        const subjectResults = results.filter(r => r.subject.title === subjectTitle);
        if (subjectResults.length === 0) return 'N/A';
        const average = subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length;
        return average.toFixed(1) + '%';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredResults = selectedSubject === 'all'
        ? results
        : results.filter(r => r.subject.title === selectedSubject);

    if (loading) return <div className="grades-loading">Loading...</div>;
    if (error) return <div className="grades-error">{error}</div>;

    return (
        <div className="grades-container">
            <header className="grades-header">
                <h2>Academic Performance</h2>
                <div className="grades-summary">
                    <div className="grade-card overall">
                        <h3>Overall Grade</h3>
                        <div className="grade-value">
                            {calculateOverallGrade()}
                            <span className="grade-letter">
                                {getGradeLetter(parseFloat(calculateOverallGrade()))}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grades-content">
                <div className="grades-subjects">
                    <h3>Subject Performance</h3>
                    <div className="subject-cards">
                        {subjects.map(subject => (
                            <div key={subject} className="subject-card">
                                <h4>{subject}</h4>
                                <div className="subject-average">
                                    {getSubjectAverage(subject)}
                                </div>
                                <div className="subject-grade-letter">
                                    {getGradeLetter(parseFloat(getSubjectAverage(subject)))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grades-details">
                    <div className="grades-filter">
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="subject-filter"
                        >
                            <option value="all">All Subjects</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grades-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Subject</th>
                                    <th>Assessment</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map(result => (
                                    <tr key={result._id}>
                                        <td>{formatDate(result.issuedDate)}</td>
                                        <td>{result.subject.title}</td>
                                        <td>{result.assessmentTitle}</td>
                                        <td>{result.score}%</td>
                                        <td>{getGradeLetter(result.score)}</td>
                                    </tr>
                                ))}
                                {filteredResults.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="no-results">
                                            No grades available for the selected subject
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="upcoming-assessments">
                    <h3>Upcoming Assessments</h3>
                    <div className="upcoming-list">
                        {assessments
                            .filter(a => new Date(a.dueDate) > new Date())
                            .map(assessment => (
                                <div key={assessment._id} className="upcoming-card">
                                    <div className="upcoming-info">
                                        <h4>{assessment.title}</h4>
                                        <p>{assessment.subject.title}</p>
                                    </div>
                                    <div className="upcoming-date">
                                        Due: {formatDate(assessment.dueDate)}
                                    </div>
                                </div>
                            ))}
                        {assessments.filter(a => new Date(a.dueDate) > new Date()).length === 0 && (
                            <p className="no-upcoming">No upcoming assessments</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grades;