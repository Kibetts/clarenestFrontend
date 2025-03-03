import React, { useState, useEffect, useRef } from 'react';
import '../css/MessagesSt.css';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchInitialData = async () => {
        try {
            await Promise.all([
                fetchMessages(),
                fetchContacts()
            ]);
        } catch (err) {
            setError('Failed to load messages');
            setLoading(false);
        }
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
            console.error('Error fetching messages:', err);
            throw err;
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();
            
            // Filter out current user and group contacts by role
            const filteredContacts = data.data.users
                .filter(user => user._id !== localStorage.getItem('userId'))
                .reduce((acc, user) => {
                    if (!acc[user.role]) {
                        acc[user.role] = [];
                    }
                    acc[user.role].push(user);
                    return acc;
                }, {});

            setContacts(filteredContacts);
        } catch (err) {
            console.error('Error fetching contacts:', err);
            throw err;
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    recipientId: selectedContact._id,
                    content: newMessage,
                    recipientModel: selectedContact.role.charAt(0).toUpperCase() + 
                                  selectedContact.role.slice(1)
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            await fetchMessages();
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to mark message as read');
            await fetchMessages();
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    };

    const getContactMessages = () => {
        if (!selectedContact) return [];
        
        return messages
            .filter(msg => 
                msg.sender === selectedContact._id || 
                msg.recipient === selectedContact._id
            )
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    const getUnreadCount = (contactId) => {
        return messages.filter(msg => 
            msg.sender === contactId && 
            !msg.read
        ).length;
    };

    const formatTime = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        
        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        return messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

    const getRoleIcon = (role) => {
        switch (role.toLowerCase()) {
            case 'tutor':
                return '👨‍🏫';
            case 'admin':
                return '👨‍💼';
            case 'student':
                return '👨‍🎓';
            default:
                return '👤';
        }
    };

    if (loading) return <div className="messages-loading">Loading...</div>;
    if (error) return <div className="messages-error">{error}</div>;

    return (
        <div className="messages-container">
            <div className="messages-sidebar">
                <div className="messages-tabs">
                    <button 
                        className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inbox')}
                    >
                        Inbox
                    </button>
                    <button 
                        className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        Sent
                    </button>
                </div>

                <div className="contacts-list">
                    {Object.entries(contacts).map(([role, users]) => (
                        <div key={role} className="contact-group">
                            <div className="contact-group-header">
                                <span className="role-icon">{getRoleIcon(role)}</span>
                                <span>{role.charAt(0).toUpperCase() + role.slice(1)}s</span>
                            </div>
                            {users.map(contact => (
                                <div
                                    key={contact._id}
                                    className={`contact-item ${selectedContact?._id === contact._id ? 'active' : ''}`}
                                    onClick={() => setSelectedContact(contact)}
                                >
                                    <div className="contact-details">
                                        <span className="contact-name">{contact.name}</span>
                                        <span className="contact-role">{contact.role}</span>
                                    </div>
                                    {getUnreadCount(contact._id) > 0 && (
                                        <span className="unread-badge">
                                            {getUnreadCount(contact._id)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="messages-main">
                {selectedContact ? (
                    <>
                        <div className="messages-header">
                            <div className="selected-contact">
                                <span className="contact-name">{selectedContact.name}</span>
                                <span className="contact-role">{selectedContact.role}</span>
                            </div>
                        </div>

                        <div className="messages-list">
                            {getContactMessages().map(message => (
                                <div
                                    key={message._id}
                                    className={`message ${message.sender === localStorage.getItem('userId') ? 
                                        'sent' : 'received'}`}
                                    onClick={() => {
                                        if (!message.read && 
                                            message.recipient === localStorage.getItem('userId')) {
                                            handleMarkAsRead(message._id);
                                        }
                                    }}
                                >
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                    <div className="message-meta">
                                        <span className="message-time">
                                            {formatTime(message.createdAt)}
                                        </span>
                                        {message.sender !== localStorage.getItem('userId') && 
                                         !message.read && (
                                            <span className="unread-indicator">•</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="message-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                required
                            />
                            <button type="submit" disabled={!newMessage.trim()}>
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-selection">
                        Select a contact to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;