import React, { useState, useEffect } from 'react';
import '../css/AssessmentDistribution.css';

const AssessmentDistribution = () => {
    const [mode, setMode] = useState('distribute'); // 'distribute' or 'create'
    const [assessments, setAssessments] = useState([]);
    const [parents, setParents] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [selectedParents, setSelectedParents] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [message, setMessage] = useState({ type: '', text: '' });
    const [message, setMessage] = useState({ show: true, message: '', type: '' });

    const [createForm, setCreateForm] = useState({
        title: '',
        subject: '',
        gradeLevel: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
        timeLimit: 60,
        dueDate: ''
    });
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            await Promise.all([
                fetchAssessments(),
                fetchParents(),
                fetchSubjects()
            ]);
        } catch (error) {
            showMessage('error', 'Error loading initial data');
        }
    };

    const fetchAssessments = async () => {
        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/assessments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch assessments');
            const data = await response.json();
            setAssessments(data.data.assessments);
        } catch (error) {
            console.error('Error fetching assessments:', error);
        }
    };

    const fetchParents = async () => {
        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/parents', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch parents');
            const data = await response.json();
            setParents(data.data.parents);
        } catch (error) {
            console.error('Error fetching parents:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/subjects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch subjects');
            const data = await response.json();
            setSubjects(data.data.subjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleDistribute = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/assessments/distribute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    assessmentId: selectedAssessment,
                    parentIds: selectedParents
                })
            });

            const data = await response.json();
            showMessage('success', data.message);
            setSelectedAssessment('');
            setSelectedParents([]);
        } catch (error) {
            showMessage('error', 'Error distributing assessment');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssessment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(createForm)
            });

            if (!response.ok) throw new Error('Failed to create assessment');

            const data = await response.json();
            showMessage('success', 'Assessment created successfully');
            await fetchAssessments();
            setCreateForm({
                title: '',
                subject: '',
                gradeLevel: '',
                questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
                timeLimit: 60,
                dueDate: ''
            });
        } catch (error) {
            showMessage('error', 'Error creating assessment');
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        setCreateForm(prev => {
            const newQuestions = [...prev.questions];
            if (field === 'options') {
                newQuestions[index] = {
                    ...newQuestions[index],
                    options: value
                };
            } else {
                newQuestions[index] = {
                    ...newQuestions[index],
                    [field]: value
                };
            }
            return { ...prev, questions: newQuestions };
        });
    };

    const addQuestion = () => {
        setCreateForm(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                { question: '', options: ['', '', '', ''], correctAnswer: 0 }
            ]
        }));
    };

    const removeQuestion = (index) => {
        setCreateForm(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const showMessage = (type, text) => {
        setMessage({ show: true, message: text, type });
        setTimeout(() => setMessage({ show: false, message: '', type: '' }), 3000);
    };
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Assessment Management</h2>
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 rounded-lg ${mode === 'distribute' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode('distribute')}
                    >
                        Distribute Assessment
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${mode === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode('create')}
                    >
                        Create Assessment
                    </button>
                </div>
            </div>

            {message.text && (
            <div className={`assignment-alert ${message.type}`}>
                {message.text}
            </div>
            )}

            {mode === 'distribute' ? (
                <form onSubmit={handleDistribute} className="space-y-6">
                    <div className="grid gap-4">
                        <div>
                            <label className="block mb-2 font-semibold">Select Assessment</label>
                            <select
                                value={selectedAssessment}
                                onChange={(e) => setSelectedAssessment(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select an assessment</option>
                                {assessments.map(assessment => (
                                    <option key={assessment._id} value={assessment._id}>
                                        {assessment.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Select Parents</label>
                            <div className="grid gap-2 max-h-60 overflow-y-auto p-4 border rounded">
                                {parents.map(parent => (
                                    <label key={parent._id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedParents.includes(parent._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedParents([...selectedParents, parent._id]);
                                                } else {
                                                    setSelectedParents(selectedParents.filter(id => id !== parent._id));
                                                }
                                            }}
                                            className="rounded"
                                        />
                                        {parent.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedAssessment || selectedParents.length === 0}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {loading ? 'Distributing...' : 'Distribute Assessment'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleCreateAssessment} className="space-y-6">
                    <div className="grid gap-4">
                        <div>
                            <label className="block mb-2 font-semibold">Title</label>
                            <input
                                type="text"
                                value={createForm.title}
                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Subject</label>
                            <select
                                value={createForm.subject}
                                onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select subject</option>
                                {subjects.map(subject => (
                                    <option key={subject._id} value={subject._id}>
                                        {subject.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Grade Level</label>
                            <select
                                value={createForm.gradeLevel}
                                onChange={(e) => setCreateForm({ ...createForm, gradeLevel: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select grade</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Time Limit (minutes)</label>
                            <input
                                type="number"
                                value={createForm.timeLimit}
                                onChange={(e) => setCreateForm({ ...createForm, timeLimit: e.target.value })}
                                className="w-full p-2 border rounded"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Due Date</label>
                            <input
                                type="datetime-local"
                                value={createForm.dueDate}
                                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-semibold">Questions</label>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                >
                                    Add Question
                                </button>
                            </div>

                            <div className="space-y-6">
                                {createForm.questions.map((question, qIndex) => (
                                    <div key={qIndex} className="p-4 border rounded space-y-4">
                                        <div className="flex justify-between">
                                            <h4 className="font-semibold">Question {qIndex + 1}</h4>
                                            {createForm.questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <textarea
                                            value={question.question}
                                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                            className="w-full p-2 border rounded"
                                            placeholder="Enter question"
                                            required
                                        />

                                        <div className="space-y-2">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex gap-2 items-center">
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
                                                        onChange={(e) => {
                                                            const newOptions = [...question.options];
                                                            newOptions[oIndex] = e.target.value;
                                                            handleQuestionChange(qIndex, 'options', newOptions);
                                                        }}
                                                        className="flex-1 p-2 border rounded"
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Create Assessment'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AssessmentDistribution;