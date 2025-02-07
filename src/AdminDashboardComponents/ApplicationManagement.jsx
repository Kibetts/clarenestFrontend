import React, { useState, useEffect } from 'react';
import '../css/ApplicationManagement.css';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState({
    studentApplications: [],
    tutorApplications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://clarenest-6bd4.onrender.com/api/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (id, type, action) => {
    try {
      const response = await fetch(
        `https://clarenest-6bd4.onrender.com/api/applications/${type}/${id}/${action}`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error(`Failed to ${action} application`);
      
      showAlert(`Application successfully ${action}ed`, 'success');
      fetchApplications();
      setShowDetailsModal(false);
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const getFilteredApplications = (type) => {
    const apps = type === 'student' 
      ? applications.studentApplications 
      : applications.tutorApplications;

    return apps.filter(app => {
      const matchesStatus = filters.status === 'all' || app.status === filters.status;
      const matchesSearch = !filters.searchTerm || 
        app.personalInfo.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        app.personalInfo.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleViewDetails = (application, type) => {
    setSelectedApplication({ ...application, type });
    setShowDetailsModal(true);
  };

  const renderApplicationList = (type) => {
    const filteredApps = getFilteredApplications(type);
    
    return (
      <div className="applications-list">
        {filteredApps.map(app => (
          <div key={app._id} className="application-card">
            <div className="application-header">
              <div className="applicant-info">
                <h3>{app.personalInfo.fullName}</h3>
                <span className="email">{app.personalInfo.email}</span>
                <span className={`status-badge ${app.status}`}>
                  {app.status}
                </span>
              </div>
              <div className="application-meta">
                <span className="application-date">
                  Applied: {new Date(app.applicationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="application-preview">
              {type === 'student' ? (
                <div className="preview-details">
                  <p><strong>Grade Level:</strong> {app.educationalInfo.currentGradeLevel}</p>
                  <p><strong>Previous School:</strong> {app.educationalInfo.lastSchoolAttended}</p>
                </div>
              ) : (
                <div className="preview-details">
                  <p><strong>Experience:</strong> {app.professionalInfo.teachingExperience} years</p>
                  <p><strong>Subjects:</strong> {app.professionalInfo.subjectsSpecialization.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="application-actions">
              <button
                className="view-button"
                onClick={() => handleViewDetails(app, type)}
              >
                View Details
              </button>
              {app.status === 'pending' && (
                <>
                  <button
                    className="approve-button"
                    onClick={() => handleApplicationAction(app._id, type, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleApplicationAction(app._id, type, 'reject')}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="no-applications">
            No {type} applications found
          </div>
        )}
      </div>
    );
  };

  const renderDetailsModal = () => {
    if (!selectedApplication) return null;
  
    const isTutor = selectedApplication.type === 'tutor';
    
    return (
      <div className="modal-overlay">
        <div className="modal application-details-modal">
          <div className="modal-header">
            <h2>Application Details</h2>
            <button 
              className="close-button"
              onClick={() => setShowDetailsModal(false)}
            >
              ×
            </button>
          </div>
  
          <div className="modal-content">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name</label>
                  <p>{selectedApplication.personalInfo?.fullName}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedApplication.personalInfo?.email}</p>
                </div>
                <div className="detail-item">
                  <label>Date of Birth</label>
                  <p>{selectedApplication.personalInfo?.dateOfBirth ? 
                      new Date(selectedApplication.personalInfo.dateOfBirth).toLocaleDateString() : 
                      'Not specified'}</p>
                </div>
                <div className="detail-item">
                  <label>Nationality</label>
                  <p>{selectedApplication.personalInfo?.nationality || 'Not specified'}</p>
                </div>
              </div>
            </div>
  
            {isTutor ? (
              <>
                <div className="detail-section">
                  <h3>Professional Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Teaching Experience</label>
                      <p>{selectedApplication.professionalInfo?.teachingExperience} years</p>
                    </div>
                    <div className="detail-item">
                      <label>Subjects</label>
                      <p>{selectedApplication.professionalInfo?.subjectsSpecialization?.join(', ') || 'Not specified'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Certifications</label>
                      <ul>
                        {selectedApplication.professionalInfo?.certifications?.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        )) || <li>No certifications provided</li>}
                      </ul>
                    </div>
                    <div className="detail-item">
                      <label>Preferred Grade Levels</label>
                      <p>{selectedApplication.professionalInfo?.preferredGradeLevels?.join(', ') || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
  
                <div className="detail-section">
                  <h3>Documents</h3>
                  <div className="documents-grid">
                    {selectedApplication.documents && (
                      <>
                        <div className="document-item">
                          <label>CV</label>
                          <a 
                            href={`/api/applications/download/${selectedApplication.documents.cv?.path}`}
                            download
                            className="download-link"
                          >
                            Download CV
                          </a>
                        </div>
                        <div className="document-item">
                          <label>Academic Certificates</label>
                          {selectedApplication.documents.academicCertificates?.map((cert, index) => (
                            <a 
                              key={index}
                              href={`/api/applications/download/${cert.path}`}
                              download
                              className="download-link"
                            >
                              Certificate {index + 1}
                            </a>
                          ))}
                        </div>
                        <div className="document-item">
                          <label>Government ID</label>
                          <a 
                            href={`/api/applications/download/${selectedApplication.documents.governmentId?.path}`}
                            download
                            className="download-link"
                          >
                            Download ID
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
  
                <div className="detail-section">
                  <h3>Teaching Philosophy</h3>
                  <p className="philosophy-text">
                    {selectedApplication.essay?.teachingPhilosophy || 'No teaching philosophy provided'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="detail-section">
                  <h3>Educational Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Current Grade Level</label>
                      <p>{selectedApplication.educationalInfo?.currentGradeLevel || 'Not specified'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Previous School</label>
                      <p>{selectedApplication.educationalInfo?.lastSchoolAttended || 'Not specified'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Interested Subjects</label>
                      <p>{selectedApplication.educationalInfo?.interestedSubjects?.join(', ') || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
  
                <div className="detail-section">
                  <h3>Parent Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Parent Name</label>
                      <p>{selectedApplication.parentInfo?.name || 'Not specified'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Parent Email</label>
                      <p>{selectedApplication.parentInfo?.email || 'Not specified'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Parent Phone</label>
                      <p>{selectedApplication.parentInfo?.phoneNumber || 'Not specified'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Relationship</label>
                      <p>{selectedApplication.parentInfo?.relationship || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
  
                {selectedApplication.specialNeeds?.hasSpecialNeeds && (
                  <div className="detail-section">
                    <h3>Special Needs</h3>
                    <p>{selectedApplication.specialNeeds?.accommodationsRequired || 'No details provided'}</p>
                  </div>
                )}
              </>
            )}
          </div>
  
          {selectedApplication.status === 'pending' && (
            <div className="modal-actions">
              <button 
                className="reject-button"
                onClick={() => handleApplicationAction(
                  selectedApplication._id, 
                  selectedApplication.type, 
                  'reject'
                )}
              >
                Reject
              </button>
              <button 
                className="approve-button"
                onClick={() => handleApplicationAction(
                  selectedApplication._id, 
                  selectedApplication.type, 
                  'approve'
                )}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="application-management">
      <div className="header">
        <h2>Application Management</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search applications..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              searchTerm: e.target.value
            }))}
            className="search-input"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              status: e.target.value
            }))}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="view-filters">
            <button
              className={`view-filter ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              All
            </button>
            <button
              className={`view-filter ${viewMode === 'student' ? 'active' : ''}`}
              onClick={() => setViewMode('student')}
            >
              Students
            </button>
            <button
              className={`view-filter ${viewMode === 'tutor' ? 'active' : ''}`}
              onClick={() => setViewMode('tutor')}
            >
              Tutors
            </button>
          </div>
        </div>
      </div>

      <div className="applications-container">
        {(viewMode === 'all' || viewMode === 'student') && (
          <div className="application-section">
            <h3>Student Applications</h3>
            {renderApplicationList('student')}
          </div>
        )}

        {(viewMode === 'all' || viewMode === 'tutor') && (
          <div className="application-section">
            <h3>Tutor Applications</h3>
            {renderApplicationList('tutor')}
          </div>
        )}
      </div>

      {showDetailsModal && renderDetailsModal()}

      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;