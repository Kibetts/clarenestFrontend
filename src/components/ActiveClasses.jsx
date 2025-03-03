import React, { useState, useEffect } from 'react';

const ActiveClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActiveClasses();
    }, []);

    const fetchActiveClasses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch classes');
            const data = await response.json();
            
            // Filter for only currently ongoing classes
            const currentTime = new Date();
            const activeClasses = data.data.lessons.filter(lesson => {
                const startTime = new Date(lesson.startTime);
                const endTime = new Date(lesson.endTime);
                return currentTime >= startTime && currentTime <= endTime;
            });
            
            setClasses(activeClasses);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleJoinClass = (lessonId) => {
        // Implement join class logic here - could be a video call link or classroom page
        window.location.href = `/classroom/${lessonId}`;
    };

    if (loading) return <div className="p-4">Loading classes...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Active Classes</h2>
                <div className="text-sm text-gray-500">
                    Current Time: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {classes.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No active classes at the moment</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((classItem) => (
                        <div key={classItem._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">{classItem.subject.title}</h3>
                                <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                                    Live
                                </span>
                            </div>
                            <div className="space-y-2 mb-4">
                                <p><span className="font-medium">Grade:</span> {classItem.gradeLevel}</p>
                                <p><span className="font-medium">Time:</span> {new Date(classItem.startTime).toLocaleTimeString()} - {new Date(classItem.endTime).toLocaleTimeString()}</p>
                                <p><span className="font-medium">Students:</span> {classItem.currentEnrollment}/{classItem.capacity}</p>
                            </div>
                            <button
                                onClick={() => handleJoinClass(classItem._id)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Join Class
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveClasses;