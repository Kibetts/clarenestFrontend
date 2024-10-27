import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/AssessmentTaking.css';

function AssessmentTaking() {
    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssessment();
    }, [id]);

    useEffect(() => {
        if (assessment?.timeLimit) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit(new Event('submit'));
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [assessment]);

    const fetchAssessment = async () => {
        try {
            const response = await fetch(`/api/assessments/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch assessment');
            const data = await response.json();
            setAssessment(data);
            initializeAnswers(data.questions);
            if (data.timeLimit) {
                setTimeRemaining(data.timeLimit * 60); // Convert minutes to seconds
            }
        } catch (error) {
            console.error('Error fetching assessment:', error);
        }
    };

    const initializeAnswers = (questions) => {
        const initialAnswers = {};
        questions.forEach(q => initialAnswers[q._id] = '');
        setAnswers(initialAnswers);
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('submitting');
        
        try {
            const response = await fetch(`/api/assessments/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ answers })
            });
            
            if (!response.ok) throw new Error('Failed to submit assessment');
            
            const result = await response.json();
            setSubmissionStatus('success');
            
            // Show success message
            setTimeout(() => {
                navigate(`/assessment-results/${result.submissionId}`);
            }, 2000);
            
        } catch (error) {
            console.error('Error submitting assessment:', error);
            setSubmissionStatus('error');
        }
    };

    if (!assessment) {
        return <div className="assessment-loading">Loading...</div>;
    }

    return (
        <div className="assessment">
            <div className="assessment-container">
                <header className="assessment-header">
                    <h1 className="assessment-title">{assessment.title}</h1>
                    {timeRemaining !== null && (
                        <div className="assessment-timer">
                            Time Remaining: {formatTime(timeRemaining)}
                        </div>
                    )}
                </header>

                <form onSubmit={handleSubmit} className="assessment-form">
                    <div className="assessment-questions">
                        {assessment.questions.map((question, index) => (
                            <div key={question._id} className="assessment-question">
                                <div className="question-header">
                                    <span className="question-number">Question {index + 1}</span>
                                    <span className="question-points">
                                        {question.points} {question.points === 1 ? 'point' : 'points'}
                                    </span>
                                </div>
                                
                                <p className="question-text">{question.question}</p>
                                
                                <div className="question-options">
                                    {question.options.map((option, optionIndex) => (
                                        <label key={optionIndex} className="option-label">
                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={optionIndex}
                                                checked={answers[question._id] === optionIndex.toString()}
                                                onChange={() => handleAnswerChange(question._id, optionIndex.toString())}
                                                className="option-input"
                                            />
                                            <span className="option-text">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="assessment-actions">
                        <button 
                            type="submit" 
                            className={`assessment-submit ${submissionStatus === 'submitting' ? 'submitting' : ''}`}
                            disabled={submissionStatus === 'submitting'}
                        >
                            {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    </div>
                </form>

                {submissionStatus === 'success' && (
                    <div className="assessment-success">
                        Assessment submitted successfully! Redirecting to results...
                    </div>
                )}
                
                {submissionStatus === 'error' && (
                    <div className="assessment-error">
                        Failed to submit assessment. Please try again.
                    </div>
                )}
            </div>
        </div>
    );
}

export default AssessmentTaking;