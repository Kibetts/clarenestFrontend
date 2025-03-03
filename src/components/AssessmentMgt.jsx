import React, { useState, useEffect } from 'react';

const AssessmentManagement = () => {
    const [assessments, setAssessments] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        gradeLevel: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
        dueDate: '',
        duration: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedParents, setSelectedParents] = useState([]);
    const [parents, setParents] = useState([]);

    useEffect(() => {
        fetchAssessments();
        fetchParents();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/assessments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch assessments');
            const data = await response.json();
            setAssessments(data.data.assessments);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchParents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/parents', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch parents');
            const data = await response.json();
            setParents(data.data.parents);
        } catch (err) {
            console.error('Error fetching parents:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create assessment');
            
            await fetchAssessments();
            setShowCreateForm(false);
            setFormData({
                title: '',
                subject: '',
                gradeLevel: '',
                questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
                dueDate: '',
                duration: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        if (field === 'options') {
            const [optionIndex, optionValue] = value;
            newQuestions[index].options[optionIndex] = optionValue;
        } else {
            newQuestions[index][field] = value;
        }
        setFormData({ ...formData, questions: newQuestions });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                { question: '', options: ['', '', '', ''], correctAnswer: 0 }
            ]
        });
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleDistribute = async (assessmentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/assessments/distribute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    assessmentId,
                    parentIds: selectedParents
                })
            });

            if (!response.ok) throw new Error('Failed to distribute assessment');
            
            // Reset selected parents
            setSelectedParents([]);
            alert('Assessment distributed successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const renderCreateForm = () => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Create New Assessment</h3>
                <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                        <select
                            value={formData.gradeLevel}
                            onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        >
                            <option value="">Select Grade</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium">Questions</h4>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Add Question
                        </button>
                    </div>

                    {formData.questions.map((question, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium">Question {qIndex + 1}</h5>
                                {formData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <textarea
                                value={question.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Enter question"
                                rows="2"
                                required
                            />

                            <div className="mt-2 space-y-2">
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center space-x-2">
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
                                            onChange={(e) => handleQuestionChange(qIndex, 'options', [oIndex, e.target.value])}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create Assessment
                    </button>
                </div>
            </form>
        </div>
    );

    if (loading) return <div className="p-4">Loading assessments...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Assessment Management</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create Assessment
                </button>
            </div>

            {showCreateForm && renderCreateForm()}

            <div className="space-y-4">
                {assessments.map((assessment) => (
                    <div key={assessment._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{assessment.title}</h3>
                                <p className="text-gray-600">{assessment.subject}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                new Date(assessment.dueDate) < new Date()
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {new Date(assessment.dueDate) < new Date() ? 'Past Due' : 'Active'}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <p><span className="font-medium">Grade Level:</span> {assessment.gradeLevel}</p>
                            <p><span className="font-medium">Duration:</span> {assessment.duration} minutes</p>
                            <p><span className="font-medium">Due Date:</span> {new Date(assessment.dueDate).toLocaleString()}</p>
                            <p><span className="font-medium">Questions:</span> {assessment.questions.length}</p>
                            <p><span className="font-medium">Distributed To:</span> {assessment.distributedTo?.length || 0} parents</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distribute to Parents
                            </label>
                            <select
                                multiple
                                value={selectedParents}
                                onChange={(e) => setSelectedParents(
                                    Array.from(e.target.selectedOptions, option => option.value)
                                )}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                {parents.map(parent => (
                                    <option key={parent._id} value={parent._id}>
                                        {parent.name} ({parent.children.length} children)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleDistribute(assessment._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                disabled={selectedParents.length === 0}
                            >
                                Distribute to Selected Parents
                            </button>
                            <button
                                onClick={() => window.location.href = `/assessment/${assessment._id}/edit`}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssessmentManagement;