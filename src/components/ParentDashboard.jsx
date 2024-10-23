import React, { useState, useEffect } from 'react';
import '../css/ParentDashboard.css';

function ParentDashboard() {
    const [parent, setParent] = useState(null);
    const [children, setChildren] = useState([]);

    useEffect(() => {
        fetchParentData();
        fetchChildren();
    }, []);

    const fetchParentData = async () => {
        try {
            const response = await fetch('/api/parents/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch parent data');
            const data = await response.json();
            setParent(data);
        } catch (error) {
            console.error('Error fetching parent data:', error);
        }
    };

    const fetchChildren = async () => {
        try {
            const response = await fetch('/api/parents/children', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch children data');
            const data = await response.json();
            setChildren(data);
        } catch (error) {
            console.error('Error fetching children data:', error);
        }
    };

    if (!parent) return <div>Loading...</div>;

    return (
        <div className="parent-dashboard">
            <h1>Welcome, {parent.name}</h1>
            <div className="dashboard-section">
                <h2>Your Children</h2>
                {children.map(child => (
                    <div key={child._id} className="child-info">
                        <h3>{child.name}</h3>
                        <p>Grade: {child.grade}</p>
                        <p>Subjects: {child.subjects.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ParentDashboard;