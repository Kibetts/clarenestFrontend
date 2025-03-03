import React, { useState, useEffect } from 'react';
import '../css/CourseMaterials.css';

const CourseMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard/student/materials', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch course materials');
            }

            const data = await response.json();
            // Make sure we're accessing the correct property path
            setMaterials(data.data.materials || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching materials:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePreview = (material) => {
        setSelectedMaterial(material);
        setShowPreview(true);
    };

    const handleDownload = async (material) => {
        try {
            // Add download functionality here if needed
            console.log('Downloading material:', material);
        } catch (err) {
            console.error('Download error:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="materials-loading">Loading...</div>;
    if (error) return <div className="materials-error">Error: {error}</div>;
    if (!materials || materials.length === 0) return <div className="no-materials">No course materials available.</div>;

    return (
        <div className="materials-container">
            <header className="materials-header">
                <h2>Course Materials</h2>
            </header>

            <div className="materials-content">
                <div className="materials-grid">
                    {materials.map(material => (
                        <div key={material._id} className="material-card">
                            <div className="material-icon">
                                {material.type === 'document' && '📄'}
                                {material.type === 'video' && '🎥'}
                                {material.type === 'link' && '🔗'}
                                {material.type === 'assignment' && '📝'}
                            </div>
                            <div className="material-info">
                                <h3>{material.title}</h3>
                                <p className="material-subject">
                                    {material.subject?.title || 'No Subject'}
                                </p>
                                <p className="material-date">
                                    Uploaded: {formatDate(material.createdAt)}
                                </p>
                            </div>
                            <div className="material-actions">
                                {material.type === 'document' && (
                                    <button 
                                        className="preview-btn"
                                        onClick={() => handlePreview(material)}
                                    >
                                        Preview
                                    </button>
                                )}
                                <button 
                                    className="download-btn"
                                    onClick={() => handleDownload(material)}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPreview && selectedMaterial && (
                <div className="preview-modal">
                    <div className="preview-content">
                        <button 
                            className="close-preview"
                            onClick={() => setShowPreview(false)}
                        >
                            ×
                        </button>
                        <h3>{selectedMaterial.title}</h3>
                        <div className="preview-frame">
                            {selectedMaterial.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;