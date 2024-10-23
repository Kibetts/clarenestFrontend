import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/LessonView.css';

function LessonView() {
    const [lesson, setLesson] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchLesson();
    }, [id]);

    const fetchLesson = async () => {
        try {
            const response = await fetch(`/api/lessons/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch lesson');
            const data = await response.json();
            setLesson(data);
        } catch (error) {
            console.error('Error fetching lesson:', error);
        }
    };

    if (!lesson) return <div>Loading...</div>;

    return (
        <div className="lesson-view">
            <h2>{lesson.name}</h2>
            <p>Subject: {lesson.subject.title}</p>
            <p>Tutor: {lesson.tutor.name}</p>
            <p>Schedule:</p>
            <ul>
                {lesson.schedule.map((slot, index) => (
                    <li key={index}>{slot.day}: {slot.startTime} - {slot.endTime}</li>
                ))}
            </ul>
            <p>Grade Level: {lesson.gradeLevel}</p>
            <p>Current Enrollment: {lesson.currentEnrollment} / {lesson.capacity}</p>
        </div>
    );
}

export default LessonView;