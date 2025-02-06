import React, { useState, useEffect } from 'react';
import '../css/SubjectManagement.css';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 60,
        level: 'High School',
        gradeLevel: 9,
        tutor: '',
        enrollmentCapacity: 30,
        isActive: true
    });

    useEffect(() => {
        fetchSubjects();
        fetchTutors();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await fetch('${process.env.BACKEND_URL}/api/subjects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setSubjects(data.data.subjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchTutors = async () => {
        try {
            const response = await fetch('${process.env.BACKEND_URL}/api/tutors', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setTutors(data.data.tutors);
        } catch (error) {
            console.error('Error fetching tutors:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('${process.env.BACKEND_URL}/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                fetchSubjects();
                setShowModal(false);
                setFormData({
                    title: '',
                    description: '',
                    duration: 60,
                    level: 'High School',
                    gradeLevel: 9,
                    enrollmentCapacity: 30,
                    isActive: true
                });
            }
        } catch (error) {
            console.error('Error creating subject:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Subject Management</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Subject
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(subject => (
                    <div key={subject._id} className="border rounded-lg p-4 shadow">
                        <h3 className="text-xl font-semibold mb-2">{subject.title}</h3>
                        <p className="text-gray-600 mb-2">{subject.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-semibold">Level:</span> {subject.level}
                            </div>
                            <div>
                                <span className="font-semibold">Grade:</span> {subject.gradeLevel}
                            </div>
                            <div>
                                <span className="font-semibold">Duration:</span> {subject.duration}min
                            </div>
                            <div>
                                <span className="font-semibold">Capacity:</span> {subject.enrollmentCapacity}
                            </div>
                            <div>
                                <span className="font-semibold">Status:</span>
                                <span className={`ml-1 ${subject.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                    {subject.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Subject</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Level</label>
                                        <select
                                            name="level"
                                            value={formData.level}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2"
                                            required
                                        >
                                            <option value="Elementary">Elementary</option>
                                            <option value="Middle School">Middle School</option>
                                            <option value="High School">High School</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Grade Level</label>
                                        <input
                                            type="number"
                                            name="gradeLevel"
                                            value={formData.gradeLevel}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="12"
                                            className="w-full border rounded p-2"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tutor</label>
                                    <select
                                        name="tutor"
                                        value={formData.tutor}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                        required
                                    >
                                        <option value="">Select Tutor</option>
                                        {tutors.map(tutor => (
                                            <option key={tutor._id} value={tutor._id}>
                                                {tutor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Enrollment Capacity</label>
                                    <input
                                        type="number"
                                        name="enrollmentCapacity"
                                        value={formData.enrollmentCapacity}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Create Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;