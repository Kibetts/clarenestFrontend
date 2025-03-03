import React, { useState, useEffect } from 'react';

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        totalPoints: '',
        instructions: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/assignments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch assignments');
            const data = await response.json();
            setAssignments(data.data.assignments);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create assignment');
            
            await fetchAssignments();
            setShowCreateForm(false);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                subject: '',
                totalPoints: '',
                instructions: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleViewSubmissions = (assignmentId) => {
        window.location.href = `/assignment/${assignmentId}/submissions`;
    };

    const renderCreateForm = () => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Create New Assignment</h3>
                <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        rows="3"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Points</label>
                        <input
                            type="number"
                            value={formData.totalPoints}
                            onChange={(e) => setFormData({...formData, totalPoints: e.target.value})}
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                        value={formData.instructions}
                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        rows="4"
                        required
                    />
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
                        Create Assignment
                    </button>
                </div>
            </form>
        </div>
    );

    if (loading) return <div className="p-4">Loading assignments...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Assignment Management</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create Assignment
                </button>
            </div>

            {showCreateForm && renderCreateForm()}

            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <div key={assignment._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{assignment.title}</h3>
                                <p className="text-gray-600">{assignment.subject}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                new Date(assignment.dueDate) < new Date()
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {new Date(assignment.dueDate) < new Date() ? 'Past Due' : 'Active'}
                            </span>
                        </div>
                        <div className="space-y-2 mb-4">
                            <p className="text-gray-700">{assignment.description}</p>
                            <p><span className="font-medium">Due Date:</span> {new Date(assignment.dueDate).toLocaleString()}</p>
                            <p><span className="font-medium">Total Points:</span> {assignment.totalPoints}</p>
                            <p><span className="font-medium">Submissions:</span> {assignment.submissions?.length || 0}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleViewSubmissions(assignment._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                View Submissions
                            </button>
                            <button
                                onClick={() => window.location.href = `/assignment/${assignment._id}/edit`}
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

export default AssignmentManagement;