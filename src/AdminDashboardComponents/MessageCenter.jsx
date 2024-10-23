import React, { useState, useEffect, useRef } from 'react';
import '../css/MessageCenter.css';

const MessageCenter = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    recipients: []
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      showAlert('Failed to fetch messages', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data.data.users);
    } catch (error) {
      showAlert('Failed to fetch users', 'error');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAnnouncements(data.data.notifications.filter(n => n.type === 'Announcement'));
    } catch (error) {
      showAlert('Failed to fetch announcements', 'error');
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessageText('');
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
          content: messageText
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setMessageText('');
      fetchMessages();
      showAlert('Message sent successfully', 'success');
    } catch (error) {
      showAlert('Failed to send message', 'error');
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
      setAnnouncementForm({ title: '', content: '', recipients: [] });
      fetchAnnouncements();
      showAlert('Announcement created successfully', 'success');
    } catch (error) {
      showAlert('Failed to create announcement', 'error');
    }
  };

  const getUserMessages = () => {
    if (!selectedUser) return [];
    return messages.filter(msg => 
      msg.sender === selectedUser._id || msg.recipient === selectedUser._id
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const showAlert = (message, type) => {
    setAlert({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 3000);
  };

  return (
    <div className="message-center">
      <div className="message-grid">
        <div className="users-panel">
          <div className="panel-header">
            <h3>Users</h3>
          </div>
          <div className="users-list">
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-panel">
          <div className="panel-header">
            <h3>{selectedUser ? `Chat with ${selectedUser.name}` : 'Select a user to start chatting'}</h3>
            <button 
              className="announce-button"
              onClick={() => setShowAnnouncementModal(true)}
            >
              📢 New Announcement
            </button>
          </div>
          
          <div className="messages-container">
            {selectedUser ? (
              <>
                <div className="messages-list">
                  {getUserMessages().map((message) => (
                    <div
                      key={message._id}
                      className={`message ${message.sender === selectedUser._id ? 'received' : 'sent'}`}
                    >
                      <div className="message-content">
                        {message.content}
                      </div>
                      <div className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString()}
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
              <div className="no-selection">
                Select a user from the list to start a conversation
              </div>
            )}
          </div>
        </div>

        <div className="announcements-panel">
          <div className="panel-header">
            <h3>Recent Announcements</h3>
          </div>
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="announcement-item">
                <div className="announcement-header">
                  <span className="announcement-icon">📢</span>
                  <span className="announcement-time">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="announcement-content">
                  {announcement.message}
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="no-announcements">
                No announcements yet
              </div>
            )}
          </div>
        </div>
      </div>

      {showAnnouncementModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Announcement</h3>
              <button 
                className="close-button"
                onClick={() => setShowAnnouncementModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({
                    ...announcementForm,
                    title: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({
                    ...announcementForm,
                    content: e.target.value
                  })}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Recipients</label>
                <div className="checkbox-group">
                  {['all', 'students', 'tutors', 'parents'].map((role) => (
                    <label key={role} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={announcementForm.recipients.includes(role)}
                        onChange={(e) => {
                          const newRecipients = e.target.checked
                            ? [...announcementForm.recipients, role]
                            : announcementForm.recipients.filter(r => r !== role);
                          setAnnouncementForm({
                            ...announcementForm,
                            recipients: newRecipients
                          });
                        }}
                      />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Send Announcement
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