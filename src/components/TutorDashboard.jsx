import React, { useState, useEffect } from 'react';
import '../css/TutorDashboard.css';

function TutorDashboard() {
    const [tutor, setTutor] = useState(null);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchTutorData();
        fetchClasses();
        fetchStudents();
    }, []);

    const fetchTutorData = async () => {
        try {
            const response = await fetch('/api/tutors/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch tutor data');
            const data = await response.json();
            setTutor(data);
        } catch (error) {
            console.error('Error fetching tutor data:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await fetch('/api/lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch classes');
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    if (!tutor) return <div>Loading...</div>;

    return (
        <div className="tutor-dashboard">
            <h1>Welcome, {tutor.name}</h1>
            <div className="dashboard-section">
                <h2>Your Classes</h2>
                <ul>
                    {classes.map(cls => (
                        <li key={cls._id}>{cls.name} - {cls.subject}</li>
                    ))}
                </ul>
            </div>
            <div className="dashboard-section">
                <h2>Your Students</h2>
                <ul>
                    {students.map(student => (
                        <li key={student._id}>{student.name} - {student.grade}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TutorDashboard;