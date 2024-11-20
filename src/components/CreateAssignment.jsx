import React, { useState } from 'react';
import '../css/CreateAssignment.css';

const CreateAssignment = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        totalPoints: '',
        instructions: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    dueDate: formData.dueDate,
                    subject: formData.subject,
                    totalPoints: parseInt(formData.totalPoints),
                    instructions: formData.instructions
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create assignment');
            }
    
            // Just check response.ok and proceed
            await response.json(); // Consume the response but don't store it
    
            // Reset form
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                subject: '',
                totalPoints: '',
                instructions: ''
            });
    
            // Show success message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'create-assignment-alert success';
            alertDiv.textContent = 'Assignment created successfully!';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);
    
        } catch (error) {
            console.error('Error creating assignment:', error);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'create-assignment-alert error';
            alertDiv.textContent = error.message || 'Failed to create assignment';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="create-assignment-container">
            <div className="create-assignment-header">
                <h2>Create New Assignment</h2>
            </div>
            <form onSubmit={handleSubmit} className="create-assignment-form">
                <div className="create-assignment-form-group">
                    <label>Assignment Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter assignment title"
                    />
                </div>

                <div className="create-assignment-form-group">
                    <label>Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Enter subject"
                    />
                </div>

                <div className="create-assignment-form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter assignment description"
                        rows="4"
                    />
                </div>

                <div className="create-assignment-form-group">
                    <label>Detailed Instructions</label>
                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        required
                        placeholder="Enter detailed instructions"
                        rows="6"
                    />
                </div>

                <div className="create-assignment-form-row">
                    <div className="create-assignment-form-group">
                        <label>Due Date</label>
                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="create-assignment-form-group">
                        <label>Total Points</label>
                        <input
                            type="number"
                            name="totalPoints"
                            value={formData.totalPoints}
                            onChange={handleChange}
                            required
                            placeholder="Enter total points"
                            min="1"
                        />
                    </div>
                </div>

                <div className="create-assignment-form-actions">
                    <button type="button" onClick={() => window.history.back()} className="create-assignment-cancel-btn">
                        Cancel
                    </button>
                    <button type="submit" className="create-assignment-submit-btn">
                        Create Assignment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignment;