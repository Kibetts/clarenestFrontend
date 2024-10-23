import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TutorApplication.css';

function TutorApplication() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            dateOfBirth: '',
            nationality: '',
            location: ''
        },
        professionalInfo: {
            academicQualifications: [],
            teachingExperience: '',
            subjectsSpecialization: [],
            certifications: [],
            preferredGradeLevels: [],
            availability: []
        },
        additionalSkills: {
            technologySkills: [],
            languagesSpoken: []
        },
        documents: {
            cv: '',
            academicCertificates: [],
            governmentId: ''
        },
        professionalReferences: [
            {
                name: '',
                relationship: '',
                contactInfo: ''
            },
            {
                name: '',
                relationship: '',
                contactInfo: ''
            }
        ],
        essay: {
            motivation: '',
            teachingPhilosophy: ''
        }
    });;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');
        
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (e, section, field) => {
        const values = e.target.value.split(',').map(item => item.trim());
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: values
            }
        }));
    };

    const handleReferenceChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            professionalReferences: prev.professionalReferences.map((ref, i) => 
                i === index ? { ...ref, [field]: value } : ref
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
    
        try {
            const transformedData = {
                personalInfo: {
                    fullName: formData.personalInfo.fullName,
                    dateOfBirth: formData.personalInfo.dateOfBirth,
                    nationality: formData.personalInfo.nationality,
                    location: formData.personalInfo.location
                },
                professionalInfo: {
                    academicQualifications: formData.professionalInfo.academicQualifications,
                    teachingExperience: parseInt(formData.professionalInfo.teachingExperience),
                    subjectsSpecialization: formData.professionalInfo.subjectsSpecialization,
                    certifications: formData.professionalInfo.certifications,
                    preferredGradeLevels: formData.professionalInfo.preferredGradeLevels.map(
                        level => parseInt(level)
                    ),
                    availability: formData.professionalInfo.availability
                },
                additionalSkills: {
                    technologySkills: formData.additionalSkills.technologySkills,
                    languagesSpoken: formData.additionalSkills.languagesSpoken
                },
                documents: {
                    cv: 'https://example.com/placeholder-cv.pdf',
                    academicCertificates: ['https://example.com/placeholder-cert.pdf'],
                    governmentId: 'https://example.com/placeholder-id.pdf'
                },
                professionalReferences: formData.professionalReferences,
                essay: formData.essay
            };
    
            const response = await fetch('http://localhost:5000/api/applications/tutor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedData),
                credentials: 'include' // Add this line
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }
    
            // Show success message and redirect
            alert('Application submitted successfully!');
            navigate('/application-submitted');
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="tutor-application">
            <h2>Tutor Application Form</h2>
            
            {error && (
                <div className="error-alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            name="personalInfo.fullName"
                            value={formData.personalInfo.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="personalInfo.email"
                            value={formData.personalInfo.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="date"
                            name="personalInfo.dateOfBirth"
                            value={formData.personalInfo.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="personalInfo.nationality"
                            value={formData.personalInfo.nationality}
                            onChange={handleChange}
                            placeholder="Nationality"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="personalInfo.location"
                            value={formData.personalInfo.location}
                            onChange={handleChange}
                            placeholder="Current Location"
                            required
                        />
                    </div>
                </section>

                <section className="form-section">
                    <h3>Professional Information</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'professionalInfo', 'academicQualifications')}
                            value={formData.professionalInfo.academicQualifications.join(', ')}
                            placeholder="Academic Qualifications (comma-separated)"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            name="professionalInfo.teachingExperience"
                            value={formData.professionalInfo.teachingExperience}
                            onChange={handleChange}
                            placeholder="Years of Teaching Experience"
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'professionalInfo', 'subjectsSpecialization')}
                            value={formData.professionalInfo.subjectsSpecialization.join(', ')}
                            placeholder="Subjects Specialization (comma-separated)"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'professionalInfo', 'certifications')}
                            value={formData.professionalInfo.certifications.join(', ')}
                            placeholder="Certifications (comma-separated)"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'professionalInfo', 'preferredGradeLevels')}
                            value={formData.professionalInfo.preferredGradeLevels.join(', ')}
                            placeholder="Preferred Grade Levels (comma-separated numbers)"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'professionalInfo', 'availability')}
                            value={formData.professionalInfo.availability.join(', ')}
                            placeholder="Availability (e.g., 'Monday 9-5, Tuesday 10-6')"
                            required
                        />
                    </div>
                </section>

                <section className="form-section">
                    <h3>Additional Skills</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'additionalSkills', 'technologySkills')}
                            value={formData.additionalSkills.technologySkills.join(', ')}
                            placeholder="Technology Skills (comma-separated)"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => handleArrayChange(e, 'additionalSkills', 'languagesSpoken')}
                            value={formData.additionalSkills.languagesSpoken.join(', ')}
                            placeholder="Languages Spoken (comma-separated)"
                            required
                        />
                    </div>
                </section>

                <section className="form-section">
                    <h3>Professional References</h3>
                    {formData.professionalReferences.map((reference, index) => (
                        <div key={index} className="reference-group">
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={reference.name}
                                    onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                                    placeholder="Reference Name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={reference.relationship}
                                    onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                                    placeholder="Relationship/Position"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={reference.contactInfo}
                                    onChange={(e) => handleReferenceChange(index, 'contactInfo', e.target.value)}
                                    placeholder="Contact Information"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="form-section">
                    <h3>Essay Questions</h3>
                    <div className="form-group">
                        <textarea
                            name="essay.motivation"
                            value={formData.essay.motivation}
                            onChange={handleChange}
                            placeholder="What motivates you to teach?"
                            required
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="essay.teachingPhilosophy"
                            value={formData.essay.teachingPhilosophy}
                            onChange={handleChange}
                            placeholder="Describe your teaching philosophy"
                            required
                            rows="4"
                        />
                    </div>
                </section>

                <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
}

export default TutorApplication;