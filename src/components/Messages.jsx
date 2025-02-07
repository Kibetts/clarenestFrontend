import React, { useState, useEffect, useRef } from 'react';
import '../css/Messages.css';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        fetchRecipients();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/messages', {
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

    const fetchRecipients = async () => {
        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch recipients');

            const data = await response.json();
            setRecipients(data.data.users);
        } catch (err) {
            console.error('Error fetching recipients:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedRecipient) return;

        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    recipientId: selectedRecipient._id,
                    content: newMessage
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            // Add new message to the list
            fetchMessages();
            setNewMessage('');

            // Show success alert
            const alertDiv = document.createElement('div');
            alertDiv.className = 'messages-alert success';
            alertDiv.textContent = 'Message sent successfully!';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);

        } catch (err) {
            console.error('Error sending message:', err);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'messages-alert error';
            alertDiv.textContent = 'Failed to send message';
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 3000);
        }
    };

    const getCurrentUserMessages = () => {
        const userId = localStorage.getItem('userId');
        if (activeTab === 'inbox') {
            return messages.filter(msg => msg.recipient === userId);
        } else {
            return messages.filter(msg => msg.sender === userId);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await fetch(`https://clarenest-6bd4.onrender.com/api/messages/${messageId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchMessages();
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (loading) return <div className="messages-loading">Loading...</div>;
    if (error) return <div className="messages-error">{error}</div>;

    return (
        <div className="messages-container">
            <div className="messages-header">
                <h2>Messages</h2>
            </div>

            <div className="messages-content">
                {/* Left Sidebar */}
                <div className="messages-sidebar">
                    <div className="messages-tabs">
                        <button 
                            className={`messages-tab ${activeTab === 'inbox' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inbox')}
                        >
                            Inbox
                        </button>
                        <button 
                            className={`messages-tab ${activeTab === 'sent' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sent')}
                        >
                            Sent
                        </button>
                    </div>

                    <div className="messages-recipients">
                        <h3>Recipients</h3>
                        <div className="messages-recipients-list">
                            {recipients.map(recipient => (
                                <div 
                                    key={recipient._id}
                                    className={`messages-recipient ${selectedRecipient?._id === recipient._id ? 'active' : ''}`}
                                    onClick={() => setSelectedRecipient(recipient)}
                                >
                                    <div className="messages-recipient-info">
                                        <span className="messages-recipient-name">{recipient.name}</span>
                                        <span className="messages-recipient-role">{recipient.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="messages-main">
                    {selectedRecipient ? (
                        <>
                            <div className="messages-chat-header">
                                <h3>{selectedRecipient.name}</h3>
                                <span>{selectedRecipient.role}</span>
                            </div>

                            <div className="messages-chat">
                                {getCurrentUserMessages().map(message => (
                                    <div 
                                        key={message._id}
                                        className={`message ${message.sender === localStorage.getItem('userId') ? 'sent' : 'received'}`}
                                        onClick={() => !message.read && markAsRead(message._id)}
                                    >
                                        <div className="message-content">{message.content}</div>
                                        <div className="message-timestamp">
                                            {formatTimestamp(message.createdAt)}
                                            {!message.read && message.recipient === localStorage.getItem('userId') && 
                                                <span className="message-unread">Unread</span>
                                            }
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="messages-form">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    required
                                />
                                <button type="submit">Send</button>
                            </form>
                        </>
                    ) : (
                        <div className="messages-no-selection">
                            <p>Select a recipient to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;