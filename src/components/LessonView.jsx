import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/LessonView.css';

function LessonView() {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            setError(null);
        } catch (error) {
            setError('Error loading lesson details. Please try again.');
            console.error('Error fetching lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="lesson-loading">Loading lesson details...</div>;
    }

    if (error) {
        return <div className="lesson-error">{error}</div>;
    }

    if (!lesson) {
        return <div className="lesson-not-found">Lesson not found</div>;
    }

    return (
        <div className="lesson-view">
            <div className="lesson-container">
                <header className="lesson-header">
                    <h1 className="lesson-title">{lesson.name}</h1>
                    <div className="lesson-meta">
                        <span className="lesson-subject">
                            {lesson.subject.title}
                        </span>
                        <span className="lesson-grade">
                            Grade {lesson.gradeLevel}
                        </span>
                    </div>
                </header>

                <div className="lesson-content">
                    <section className="lesson-info">
                        <div className="lesson-tutor">
                            <h3 className="lesson-section-title">Tutor</h3>
                            <div className="lesson-tutor-info">
                                <span className="lesson-tutor-name">
                                    {lesson.tutor.name}
                                </span>
                                <span className="lesson-tutor-rating">
                                    ⭐ {lesson.tutor.rating || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="lesson-capacity">
                            <h3 className="lesson-section-title">Class Capacity</h3>
                            <div className="lesson-capacity-info">
                                <div className="lesson-capacity-text">
                                    <span>{lesson.currentEnrollment}</span>
                                    <span>/</span>
                                    <span>{lesson.capacity}</span>
                                    <span>students</span>
                                </div>
                                <div className="lesson-capacity-bar">
                                    <div 
                                        className="lesson-capacity-fill"
                                        style={{
                                            width: `${(lesson.currentEnrollment / lesson.capacity) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="lesson-schedule">
                            <h3 className="lesson-section-title">Schedule</h3>
                            <div className="lesson-schedule-list">
                                {lesson.schedule.map((slot, index) => (
                                    <div key={index} className="lesson-schedule-item">
                                        <span className="lesson-schedule-day">
                                            {slot.day}
                                        </span>
                                        <span className="lesson-schedule-time">
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {lesson.materials && lesson.materials.length > 0 && (
                            <div className="lesson-materials">
                                <h3 className="lesson-section-title">Course Materials</h3>
                                <ul className="lesson-materials-list">
                                    {lesson.materials.map((material, index) => (
                                        <li key={index} className="lesson-material-item">
                                            <span className="lesson-material-name">
                                                {material.name}
                                            </span>
                                            {material.downloadUrl && (
                                                <a 
                                                    href={material.downloadUrl} 
                                                    className="lesson-material-download"
                                                    download
                                                >
                                                    Download
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>

                    {lesson.description && (
                        <section className="lesson-description">
                            <h3 className="lesson-section-title">Description</h3>
                            <p className="lesson-description-text">
                                {lesson.description}
                            </p>
                        </section>
                    )}

                    {lesson.requirements && (
                        <section className="lesson-requirements">
                            <h3 className="lesson-section-title">Requirements</h3>
                            <ul className="lesson-requirements-list">
                                {lesson.requirements.map((requirement, index) => (
                                    <li key={index} className="lesson-requirement-item">
                                        {requirement}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <div className="lesson-actions">
                    <button className="lesson-enroll-btn">
                        Enroll in Class
                    </button>
                    <button className="lesson-contact-btn">
                        Contact Tutor
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LessonView;