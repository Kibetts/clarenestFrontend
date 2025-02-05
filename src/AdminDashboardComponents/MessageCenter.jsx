import React, { useState, useEffect, useRef } from 'react';
import '../css/MessageCenter.css';

const MessageCenter = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        message: '',
        recipientType: 'all',
        recipients: [],
        priority: 'medium'
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [activeTab, setActiveTab] = useState('messages');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchMessages(),
                fetchUsers(),
                fetchAnnouncements()
            ]);
            setError(null);
        } catch (err) {
            setError('Failed to load message center data');
        } finally {
            setLoading(false);
        }
    };

    // In MessageCenter.jsx
const fetchMessages = async () => {
    try {
        const response = await fetch('https://clarenest-6bd4.onrender.com/api/messages', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
    } catch (err) {
        setError('Failed to load message center data');
    }
};

    const fetchUsers = async () => {
        const response = await fetch('https://clarenest-6bd4.onrender.com/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.data.users);
    };

    const fetchAnnouncements = async () => {
        const response = await fetch('https://clarenest-6bd4.onrender.com/api/notifications?type=Announcement', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch announcements');
        const data = await response.json();
        setAnnouncements(data.data.notifications);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUser) return;

        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    recipientId: selectedUser._id,
                    content: messageText,
                    recipientModel: selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)
                })
            });

            if (!response.ok) throw new Error('Failed to send message');
            
            setMessageText('');
            fetchMessages();
            showAlert('Message sent successfully', 'success');
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementForm.message || !announcementForm.title) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        try {
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...announcementForm,
                    type: 'Announcement'
                })
            });

            if (!response.ok) throw new Error('Failed to create announcement');

            setShowAnnouncementModal(false);
            setAnnouncementForm({
                title: '',
                message: '',
                recipientType: 'all',
                recipients: [],
                priority: 'medium'
            });
            fetchAnnouncements();
            showAlert('Announcement created successfully', 'success');
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            const response = await fetch(`https://clarenest-6bd4.onrender.com/api/messages/${messageId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to mark message as read');
            fetchMessages();
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const getUserMessages = () => {
        if (!selectedUser) return [];
        return messages.filter(msg =>
            (msg.sender === selectedUser._id || msg.recipient === selectedUser._id)
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    const getFilteredUsers = () => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    if (loading) return <div className="message-loading">Loading...</div>;
    if (error) return <div className="message-error">{error}</div>;

    return (
        <div className="message-center">
            <div className="message-header">
                <h2>Message Center</h2>
                <div className="message-tabs">
                    <button 
                        className={`message-tab ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        Messages
                    </button>
                    <button 
                        className={`message-tab ${activeTab === 'announcements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        Announcements
                    </button>
                </div>
            </div>

            {activeTab === 'messages' ? (
                <div className="message-container">
                    <div className="message-users">
                        <div className="message-users-header">
                            <h3>Contacts</h3>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="message-search"
                            />
                        </div>
                        <div className="message-users-list">
                            {getFilteredUsers().map(user => (
                                <div
                                    key={user._id}
                                    className={`message-user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <div className="message-user-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="message-user-info">
                                        <span className="message-user-name">{user.name}</span>
                                        <span className="message-user-role">{user.role}</span>
                                    </div>
                                    {messages.filter(m => 
                                        m.sender === user._id && !m.read
                                    ).length > 0 && (
                                        <span className="message-unread-badge">
                                            {messages.filter(m => m.sender === user._id && !m.read).length}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="message-chat">
                        {selectedUser ? (
                            <>
                                <div className="message-chat-header">
                                    <div className="message-chat-user">
                                        <div className="message-user-avatar">
                                            {selectedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="message-user-details">
                                            <span className="message-user-name">
                                                {selectedUser.name}
                                            </span>
                                            <span className="message-user-role">
                                                {selectedUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="message-list">
                                    {getUserMessages().map(message => (
                                        <div
                                            key={message._id}
                                            className={`message-item ${message.sender === selectedUser._id ? 
                                                'received' : 'sent'}`}
                                            onClick={() => {
                                                if (message.sender === selectedUser._id && !message.read) {
                                                    handleMarkAsRead(message._id);
                                                }
                                            }}
                                        >
                                            <div className="message-bubble">
                                                {message.content}
                                            </div>
                                            <div className="message-meta">
                                                <span className="message-time">
                                                    {new Date(message.createdAt).toLocaleTimeString()}
                                                </span>
                                                {message.sender === selectedUser._id && !message.read && (
                                                    <span className="message-unread">•</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form className="message-form" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="message-input"
                                    />
                                    <button 
                                        type="submit" 
                                        className="message-send-btn"
                                        disabled={!messageText.trim()}
                                    >
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="message-no-chat">
                                Select a user to start messaging
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="announcement-container">
                    <div className="announcement-header">
                        <button 
                            className="announcement-create-btn"
                            onClick={() => setShowAnnouncementModal(true)}
                        >
                            Create Announcement
                        </button>
                    </div>

                    <div className="announcement-list">
                        {announcements.map(announcement => (
                            <div key={announcement._id} className="announcement-item">
                                <div className="announcement-item-header">
                                    <h4>{announcement.title}</h4>
                                    <span className={`announcement-priority ${announcement.priority}`}>
                                        {announcement.priority}
                                    </span>
                                </div>
                                <div className="announcement-content">
                                    {announcement.message}
                                </div>
                                <div className="announcement-meta">
                                    <span className="announcement-time">
                                        {new Date(announcement.createdAt).toLocaleString()}
                                    </span>
                                    <span className="announcement-recipient">
                                        To: {announcement.recipientType}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showAnnouncementModal && (
                <div className="modal-overlay">
                    <div className="announcement-modal">
                        <div className="modal-header">
                            <h3>Create Announcement</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowAnnouncementModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateAnnouncement}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    value={announcementForm.message}
                                    onChange={(e) => setAnnouncementForm(prev => ({
                                        ...prev,
                                        message: e.target.value
                                    }))}
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Recipient Type</label>
                                <select
                                    value={announcementForm.recipientType}
                                    onChange={(e) => setAnnouncementForm(prev => ({
                                        ...prev,
                                        recipientType: e.target.value,
                                        recipients: []
                                    }))}
                                >
                                    <option value="all">All Users</option>
                                    <option value="students">All Students</option>
                                    <option value="tutors">All Tutors</option>
                                    <option value="parents">All Parents</option>
                                    <option value="specific">Specific Users</option>
                                </select>
                            </div>

                            {announcementForm.recipientType === 'specific' && (
                                <div className="form-group">
                                    <label>Select Recipients</label>
                                    <div className="recipient-list">
                                        {users.map(user => (
                                            <label key={user._id} className="recipient-option">
                                                <input
                                                    type="checkbox"
                                                    checked={announcementForm.recipients.includes(user._id)}
                                                    onChange={(e) => {
                                                        const newRecipients = e.target.checked
                                                            ? [...announcementForm.recipients, user._id]
                                                            : announcementForm.recipients.filter(id => 
                                                                id !== user._id);
                                                        setAnnouncementForm(prev => ({
                                                            ...prev,
                                                            recipients: newRecipients}));
                                                          }}
                                                      />
                                                      {user.name} ({user.role})
                                                  </label>
                                              ))}
                                          </div>
                                      </div>
                                  )}
      
                                  <div className="form-group">
                                      <label>Priority</label>
                                      <select
                                          value={announcementForm.priority}
                                          onChange={(e) => setAnnouncementForm(prev => ({
                                              ...prev,
                                              priority: e.target.value
                                          }))}
                                      >
                                          <option value="low">Low</option>
                                          <option value="medium">Medium</option>
                                          <option value="high">High</option>
                                      </select>
                                  </div>
      
                                  <div className="modal-actions">
                                      <button 
                                          type="button" 
                                          className="modal-cancel-btn"
                                          onClick={() => setShowAnnouncementModal(false)}
                                      >
                                          Cancel
                                      </button>
                                      <button 
                                          type="submit"
                                          className="modal-submit-btn"
                                      >
                                          Create Announcement
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  )}
      
                  {alert.show && (
                      <div className={`message-alert ${alert.type}`}>
                          {alert.message}
                      </div>
                  )}
              </div>
          );
      };
      
      export default MessageCenter;