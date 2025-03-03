import React, { useState, useEffect, useRef } from 'react';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState({
        tutors: [],
        admins: [],
        students: [],
        parents: []
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [userType, setUserType] = useState('tutors');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        fetchUsers();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const responses = await Promise.all([
                fetch('http://localhost:5000/api/users?role=tutor', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/users?role=admin', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/users?role=student', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/users?role=parent', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            const [tutors, admins, students, parents] = await Promise.all(
                responses.map(r => r.json())
            );

            setUsers({
                tutors: tutors.data.users,
                admins: admins.data.users,
                students: students.data.users,
                parents: parents.data.users
            });
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    recipientId: selectedUser._id,
                    content: newMessage
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            await fetchMessages();
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const filterMessages = () => {
        if (!selectedUser) return [];
        return messages.filter(msg => 
            (msg.sender === selectedUser._id && msg.recipient === localStorage.getItem('userId')) ||
            (msg.recipient === selectedUser._id && msg.sender === localStorage.getItem('userId'))
        );
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (loading) return <div className="p-4">Loading messages...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow-md">
                {/* Sidebar */}
                <div className="w-64 border-r">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold mb-4">Messages</h2>
                        <select
                            value={userType}
                            onChange={(e) => {
                                setUserType(e.target.value);
                                setSelectedUser(null);
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="tutors">Tutors</option>
                            <option value="admins">Administrators</option>
                            <option value="students">Students</option>
                            <option value="parents">Parents</option>
                        </select>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-5rem)]">
                        {users[userType].map(user => (
                            <button
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`w-full p-4 text-left hover:bg-gray-50 ${
                                    selectedUser?._id === user._id ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b">
                                <h3 className="font-medium">{selectedUser.name}</h3>
                                <p className="text-sm text-gray-500">{selectedUser.role}</p>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-4">
                                    {filterMessages().map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.sender === localStorage.getItem('userId')
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${
                                                    message.sender === localStorage.getItem('userId')
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100'
                                                }`}
                                            >
                                                <p>{message.content}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.sender === localStorage.getItem('userId')
                                                        ? 'text-blue-100'
                                                        : 'text-gray-500'
                                                }`}>
                                                    {formatTime(message.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t">
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 rounded-md border-gray-300 shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a user to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;