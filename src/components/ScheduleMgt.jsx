import React, { useState, useEffect } from 'react';

const ScheduleManagement = () => {
    const [schedule, setSchedule] = useState([]);
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchSchedule();
    }, [selectedDate]);

    const fetchSchedule = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch schedule');
            const data = await response.json();

            // Organize lessons by day
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const organized = weekDays.reduce((acc, day) => {
                acc[day] = [];
                return acc;
            }, {});

            data.data.lessons.forEach(lesson => {
                lesson.schedule.forEach(slot => {
                    organized[slot.day].push({
                        ...lesson,
                        startTime: new Date(slot.startTime),
                        endTime: new Date(slot.endTime)
                    });
                });
            });

            setWeeklySchedule(organized);
            
            // Get today's schedule
            const today = weekDays[selectedDate.getDay()];
            setSchedule(organized[today].sort((a, b) => a.startTime - b.startTime));
            
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTimeSlotStatus = (startTime, endTime) => {
        const now = new Date();
        if (now < startTime) return 'upcoming';
        if (now > endTime) return 'completed';
        return 'ongoing';
    };

    const renderDaySchedule = (dayName) => {
        const dayLessons = weeklySchedule[dayName] || [];
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">{dayName}</h3>
                {dayLessons.length === 0 ? (
                    <p className="text-gray-500">No classes scheduled</p>
                ) : (
                    <div className="space-y-3">
                        {dayLessons.map((lesson, index) => {
                            const status = getTimeSlotStatus(lesson.startTime, lesson.endTime);
                            return (
                                <div 
                                    key={`${lesson._id}-${index}`}
                                    className={`border-l-4 p-3 ${
                                        status === 'ongoing' ? 'border-green-500 bg-green-50' :
                                        status === 'upcoming' ? 'border-blue-500 bg-blue-50' :
                                        'border-gray-300 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{lesson.subject.title}</h4>
                                            <p className="text-sm text-gray-600">Grade {lesson.gradeLevel}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                            status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm">
                                        <span className="font-medium">Time: </span>
                                        {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                                    </div>
                                    <div className="mt-2 text-sm">
                                        <span className="font-medium">Students: </span>
                                        {lesson.currentEnrollment}/{lesson.capacity}
                                    </div>
                                    {status === 'ongoing' && (
                                        <button
                                            onClick={() => window.location.href = `/classroom/${lesson._id}`}
                                            className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            Join Class
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="p-4">Loading schedule...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Schedule Management</h2>
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-2">Quick Navigation</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {Object.keys(weeklySchedule).map((day) => (
                            <button
                                key={day}
                                onClick={() => {
                                    const date = new Date();
                                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    const diff = days.indexOf(day) - date.getDay();
                                    date.setDate(date.getDate() + diff);
                                    setSelectedDate(date);
                                }}
                                className={`p-2 rounded ${
                                    selectedDate.getDay() === ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.keys(weeklySchedule).map(day => renderDaySchedule(day))}
            </div>
        </div>
    );
};

export default ScheduleManagement;