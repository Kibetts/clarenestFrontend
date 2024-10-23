import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../css/AssessmentTaking.css';

function AssessmentTaking() {
    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetchAssessment();
    }, [id]);

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

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const navigate = useNavigate();

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
            
            // Show a success message
            alert('Assessment submitted successfully!');
            
            // You can choose to redirect the user or show the results here
            // Option 1: Redirect to a results page
            navigate(`/assessment-results/${result.submissionId}`); // Results page not yet created
            
            // Option 2: Show results on the same page
            // setAssessmentResults(result);
            // setShowResults(true);
        } catch (error) {
            console.error('Error submitting assessment:', error);
            setSubmissionStatus('error');
            alert('Failed to submit assessment. Please try again.');
        }
    };

    if (!assessment) return <div>Loading...</div>;

    return (
        <div className="assessment-taking">
            <h2>{assessment.title}</h2>
            <form onSubmit={handleSubmit}>
            {assessment.questions.map(question => (
                    <div key={question._id} className="question">
                        <p>{question.question}</p>
                        {question.options.map((option, index) => (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name={question._id}
                                    value={index}
                                    checked={answers[question._id] === index.toString()}
                                    onChange={() => handleAnswerChange(question._id, index.toString())}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit" disabled={submissionStatus === 'submitting'}>
                    {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </form>
            {submissionStatus === 'success' && (
                <p className="success-message">Assessment submitted successfully!</p>
            )}
            {submissionStatus === 'error' && (
                <p className="error-message">Failed to submit assessment. Please try again.</p>
            )}
        </div>
    );
}

export default AssessmentTaking;