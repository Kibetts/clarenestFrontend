import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import '../css/CalendarSt.css';

const CalendarSt = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const fetchCalendarData = async () => {
        try {
            const [lessonsResponse, assignmentsResponse, assessmentsResponse] = await Promise.all([
                fetch('http://localhost:5000/api/lessons', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/dashboard/student/assignments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/dashboard/student/assessments', { // Updated this endpoint
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);
    
            const [lessonsData, assignmentsData, assessmentsData] = await Promise.all([
                lessonsResponse.json(),
                assignmentsResponse.json(),
                assessmentsResponse.json()
            ]);
    
            // Format events for the calendar
            const lessonEvents = lessonsData.data.lessons.map(lesson => ({
                id: `lesson-${lesson._id}`,
                title: `${lesson.subject.title} Class`,
                start: lesson.schedule?.startTime || lesson.startTime, // Handle both formats
                end: lesson.schedule?.endTime || lesson.endTime,
                color: '#4CAF50',
                type: 'lesson'
            })).filter(event => event.start && event.end); // Filter out invalid events
    
            const assignmentEvents = assignmentsData.data.assignments.map(assignment => ({
                id: `assignment-${assignment._id}`,
                title: `Due: ${assignment.title}`,
                start: assignment.dueDate,
                allDay: true,
                color: '#2196F3',
                type: 'assignment'
            }));
    
            const assessmentEvents = assessmentsData.data.assessments.map(assessment => ({
                id: `assessment-${assessment._id}`,
                title: `Assessment: ${assessment.title}`,
                start: assessment.dueDate,
                allDay: true,
                color: '#F44336',
                type: 'assessment'
            }));
    
            setEvents([...lessonEvents, ...assignmentEvents, ...assessmentEvents]);
            setLoading(false);
        } catch (err) {
            console.error('Calendar fetch error:', err);
            setError('Failed to fetch calendar data');
            setLoading(false);
        }
    };

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim() || !selectedDate) return;

        const todo = {
            id: Date.now(),
            text: newTodo,
            date: selectedDate,
            completed: false
        };

        setTodoList([...todoList, todo]);
        setNewTodo('');
        setSelectedDate('');

        // Add todo as an event
        setEvents([...events, {
            id: `todo-${todo.id}`,
            title: `Todo: ${todo.text}`,
            start: todo.date,
            allDay: true,
            color: '#9C27B0',
            type: 'todo'
        }]);
    };

    const handleCompleteTodo = (todoId) => {
        setTodoList(todoList.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const handleDeleteTodo = (todoId) => {
        setTodoList(todoList.filter(todo => todo.id !== todoId));
        setEvents(events.filter(event => event.id !== `todo-${todoId}`));
    };

    const handleEventClick = (info) => {
        const event = info.event;
        // Handle event click based on type
        switch (event.extendedProps.type) {
            case 'lesson':
                alert(`Class: ${event.title}\nTime: ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`);
                break;
            case 'assignment':
                alert(`Assignment Due: ${event.title}`);
                break;
            case 'assessment':
                alert(`Assessment: ${event.title}`);
                break;
            case 'todo':
                alert(`Todo: ${event.title}`);
                break;
            default:
                break;
        }
    };

    if (loading) return <div className="calendar-loading">Loading...</div>;
    if (error) return <div className="calendar-error">{error}</div>;

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                    dayMaxEvents={true}
                />
            </div>

            <div className="todo-section">
                <h3>To-Do List</h3>
                <form onSubmit={handleAddTodo} className="todo-form">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Enter a new task"
                        required
                    />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                    />
                    <button type="submit">Add Task</button>
                </form>

                <div className="todo-list">
                    {todoList.sort((a, b) => new Date(a.date) - new Date(b.date)).map(todo => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleCompleteTodo(todo.id)}
                            />
                            <span className="todo-text">{todo.text}</span>
                            <span className="todo-date">
                                {new Date(todo.date).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="delete-todo"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarSt;