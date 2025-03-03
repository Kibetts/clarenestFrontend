import React, { useState } from 'react';
import '../css/ScheduleAssessment.css';

const ScheduleAssessment = () => {
    const [questions, setQuestions] = useState([{
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
    }]);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        gradeLevel: '',
        dueDate: '',
        duration: '',
        totalPoints: ''
    });

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const assessmentData = {
                ...formData,
                questions: questions
            };

            const response = await fetch('http://localhost:5000/api/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(assessmentData)
            });

            if (!response.ok) {
                throw new Error('Failed to create assessment');
            }

            // Show success message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'schedule-assessment-alert success';
            alertDiv.textContent = 'Assessment scheduled successfully!';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);

            // Reset form
            setFormData({
                title: '',
                subject: '',
                gradeLevel: '',
                dueDate: '',
                duration: '',
                totalPoints: ''
            });
            setQuestions([{
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0
            }]);

        } catch (error) {
            console.error('Error scheduling assessment:', error);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'schedule-assessment-alert error';
            alertDiv.textContent = 'Failed to schedule assessment';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);
        }
    };

    return (
        <div className="schedule-assessment-container">
            <div className="schedule-assessment-header">
                <h2>Schedule New Assessment</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="schedule-assessment-form">
                <div className="schedule-assessment-basic-info">
                    <h3>Assessment Details</h3>
                    <div className="schedule-assessment-form-row">
                        <div className="schedule-assessment-form-group">
                            <label>Assessment Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                placeholder="Enter assessment title"
                            />
                        </div>

                        <div className="schedule-assessment-form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                                placeholder="Enter subject"
                            />
                        </div>
                    </div>

                    <div className="schedule-assessment-form-row">
                        <div className="schedule-assessment-form-group">
                            <label>Grade Level</label>
                            <select
                                value={formData.gradeLevel}
                                onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                                required
                            >
                                <option value="">Select Grade Level</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="schedule-assessment-form-group">
                            <label>Total Points</label>
                            <input
                                type="number"
                                value={formData.totalPoints}
                                onChange={(e) => setFormData({...formData, totalPoints: e.target.value})}
                                required
                                placeholder="Enter total points"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="schedule-assessment-form-row">
                        <div className="schedule-assessment-form-group">
                            <label>Due Date</label>
                            <input
                                type="datetime-local"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                required
                            />
                        </div>

                        <div className="schedule-assessment-form-group">
                            <label>Duration (minutes)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                required
                                placeholder="Enter duration in minutes"
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                <div className="schedule-assessment-questions">
                    <h3>Questions</h3>
                    {questions.map((question, qIndex) => (
                        <div key={qIndex} className="schedule-assessment-question-card">
                            <div className="schedule-assessment-question-header">
                                <h4>Question {qIndex + 1}</h4>
                                {questions.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeQuestion(qIndex)}
                                        className="schedule-assessment-remove-btn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="schedule-assessment-form-group">
                                <label>Question Text</label>
                                <textarea
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                    required
                                    placeholder="Enter question text"
                                />
                            </div>

                            <div className="schedule-assessment-options">
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="schedule-assessment-option">
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={question.correctAnswer === oIndex}
                                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button 
                        type="button" 
                        onClick={addQuestion}
                        className="schedule-assessment-add-btn"
                    >
                        + Add Question
                    </button>
                </div>

                <div className="schedule-assessment-form-actions">
                    <button 
                        type="button" 
                        onClick={() => window.history.back()}
                        className="schedule-assessment-cancel-btn"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="schedule-assessment-submit-btn"
                    >
                        Schedule Assessment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleAssessment;