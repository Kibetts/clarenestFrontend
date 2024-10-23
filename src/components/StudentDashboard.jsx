import React, { useState, useEffect } from 'react';
import '../css/StudentDashboard.css';

function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchStudentData();
        fetchLessons();
        fetchAssignments();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await fetch('/api/students/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch student data');
            const data = await response.json();
            setStudent(data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const fetchLessons = async () => {
        try {
            const response = await fetch('/api/lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch lessons');
            const data = await response.json();
            setLessons(data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch('/api/assignments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch assignments');
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    if (!student) return <div>Loading...</div>;

    return (
        <div className="student-dashboard">
            <h1>Welcome, {student.name}</h1>
            <div className="dashboard-section">
                <h2>Your Lessons</h2>
                <ul>
                    {lessons.map(lesson => (
                        <li key={lesson._id}>{lesson.name} - {lesson.subject}</li>
                    ))}
                </ul>
            </div>
            <div className="dashboard-section">
                <h2>Your Assignments</h2>
                <ul>
                    {assignments.map(assignment => (
                        <li key={assignment._id}>{assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default StudentDashboard;