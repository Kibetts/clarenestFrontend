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
  const messagesEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState('messages');

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

  const fetchMessages = async () => {
    const response = await fetch('http://localhost:5000/api/messages', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    const data = await response.json();
    setMessages(data);
  };

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:5000/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    setUsers(data.data.users);
  };

  const fetchAnnouncements = async () => {
    const response = await fetch('http://localhost:5000/api/notifications?type=Announcement', {
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
      const response = await fetch('http://localhost:5000/api/messages', {
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

    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
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
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
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

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="message-center">
      <div className="header">
        <h2>Message Center</h2>
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="messages-container">
          <div className="users-list">
            <div className="users-header">
              <h3>Contacts</h3>
              <input
                type="text"
                placeholder="Search users..."
                className="user-search"
              />
            </div>
            <div className="users-scroll">
              {users.map(user => (
                <div
                  key={user._id}
                  className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                  </div>
                  {messages.filter(m => 
                    m.sender === user._id && !m.read
                  ).length > 0 && (
                    <span className="unread-badge">
                      {messages.filter(m => m.sender === user._id && !m.read).length}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="chat-area">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <div className="chat-user-info">
                    <div className="user-avatar">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{selectedUser.name}</span>
                      <span className="user-role">{selectedUser.role}</span>
                    </div>
                  </div>
                </div>

                <div className="messages-list">
                  {getUserMessages().map(message => (
                    <div
                      key={message._id}
                      className={`message ${message.sender === selectedUser._id ? 'received' : 'sent'}`}
                      onClick={() => {
                        if (message.sender === selectedUser._id && !message.read) {
                          handleMarkAsRead(message._id);
                        }
                      }}
                    >
                      <div className="message-content">
                        {message.content}
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                        {message.sender === selectedUser._id && !message.read && (
                          <span className="unread-marker">•</span>
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
                  />
                  <button type="submit" disabled={!messageText.trim()}>
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="announcements-container">
          <div className="announcements-header">
            <button 
              className="create-announcement"
              onClick={() => setShowAnnouncementModal(true)}
            >
              Create Announcement
            </button>
          </div>

          <div className="announcements-list">
            {announcements.map(announcement => (
              <div key={announcement._id} className="announcement-card">
                <div className="announcement-header">
                  <h4>{announcement.title}</h4>
                  <span className={`priority ${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                </div>
                <div className="announcement-content">
                  {announcement.message}
                </div>
                <div className="announcement-meta">
                  <span className="timestamp">
                    {new Date(announcement.createdAt).toLocaleString()}
                  </span>
                  <span className="recipient-type">
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
          <div className="modal">
            <div className="modal-header">
              <h3>Create Announcement</h3>
              <button 
                className="close-button"
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
                  <div className="recipients-list">
                    {users.map(user => (
                      <label key={user._id} className="recipient-option">
                        <input
                          type="checkbox"
                          checked={announcementForm.recipients.includes(user._id)}
                          onChange={(e) => {
                            const newRecipients = e.target.checked
                              ? [...announcementForm.recipients, user._id]
                              : announcementForm.recipients.filter(id => id !== user._id);
                            setAnnouncementForm(prev => ({
                              ...prev,
                              recipients: newRecipients
                            }));
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
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">
                  Create Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default MessageCenter;