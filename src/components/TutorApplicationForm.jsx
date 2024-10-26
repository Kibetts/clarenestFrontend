import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TutorApplication.css';

const GRADE_LEVELS = [
    '1st', '2nd', '3rd', '4th', '5th', '6th', 
    '7th', '8th', '9th', '10th', '11th', '12th'
];

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science"
];

function TutorApplication() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isSubjectsDropdownOpen, setIsSubjectsDropdownOpen] = useState(false);
    const [isGradeLevelsDropdownOpen, setIsGradeLevelsDropdownOpen] = useState(false);
    const subjectsDropdownRef = useRef(null);
    const gradeLevelsDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
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
            cv: null,
            academicCertificates: [],
            governmentId: null
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
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (subjectsDropdownRef.current && !subjectsDropdownRef.current.contains(event.target)) {
                setIsSubjectsDropdownOpen(false);
            }
            if (gradeLevelsDropdownRef.current && !gradeLevelsDropdownRef.current.contains(event.target)) {
                setIsGradeLevelsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: values
            }
        }));
    };

    const handleSubjectToggle = (subject) => {
        setFormData(prev => {
            const currentSubjects = prev.professionalInfo.subjectsSpecialization;
            const updatedSubjects = currentSubjects.includes(subject)
                ? currentSubjects.filter(s => s !== subject)
                : [...currentSubjects, subject];
            
            return {
                ...prev,
                professionalInfo: {
                    ...prev.professionalInfo,
                    subjectsSpecialization: updatedSubjects
                }
            };
        });
    };

    const handleGradeLevelToggle = (level) => {
        setFormData(prev => {
            const currentLevels = prev.professionalInfo.preferredGradeLevels;
            const updatedLevels = currentLevels.includes(level)
                ? currentLevels.filter(l => l !== level)
                : [...currentLevels, level];
            
            return {
                ...prev,
                professionalInfo: {
                    ...prev.professionalInfo,
                    preferredGradeLevels: updatedLevels
                }
            };
        });
    };

    const handleReferenceChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            professionalReferences: prev.professionalReferences.map((ref, i) => 
                i === index ? { ...ref, [field]: value } : ref
            )
        }));
    };

    const handleFileChange = (fieldName, files) => {
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [fieldName]: fieldName === 'academicCertificates' ? Array.from(files) : files[0]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
    
        try {
            const formDataToSend = new FormData();
            const { documents, ...otherFormData } = formData;
            
            const applicationData = {
                personalInfo: {
                    fullName: otherFormData.personalInfo.fullName,
                    email: otherFormData.personalInfo.email,
                    dateOfBirth: otherFormData.personalInfo.dateOfBirth,
                    nationality: otherFormData.personalInfo.nationality,
                    location: otherFormData.personalInfo.location
                },
                professionalInfo: {
                    academicQualifications: otherFormData.professionalInfo.academicQualifications,
                    teachingExperience: parseInt(otherFormData.professionalInfo.teachingExperience),
                    subjectsSpecialization: otherFormData.professionalInfo.subjectsSpecialization,
                    certifications: otherFormData.professionalInfo.certifications,
                    preferredGradeLevels: otherFormData.professionalInfo.preferredGradeLevels,
                    availability: otherFormData.professionalInfo.availability
                },
                additionalSkills: otherFormData.additionalSkills,
                professionalReferences: otherFormData.professionalReferences,
                essay: otherFormData.essay
            };
    
            // Debug log
            console.log('Application data being sent:', JSON.stringify(applicationData, null, 2));
    
            if (documents.cv) {
                formDataToSend.append('cv', documents.cv);
            }
            
            if (documents.academicCertificates.length > 0) {
                documents.academicCertificates.forEach(file => {
                    formDataToSend.append('academicCertificates', file);
                });
            }
            
            if (documents.governmentId) {
                formDataToSend.append('governmentId', documents.governmentId);
            }
    
            formDataToSend.append('application', JSON.stringify(applicationData));
    
            const response = await fetch('http://localhost:5000/api/applications/tutor', {
                method: 'POST',
                body: formDataToSend
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to submit application');
            }
    
            alert(`Application submitted successfully! Application ID: ${responseData.data.applicationId}`);
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
            
            {error && <div className="error-alert">{error}</div>}

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

                    <div className="form-group" ref={subjectsDropdownRef}>
                        <label>Subjects Specialization</label>
                        <div className="custom-select">
                            <div 
                                className="select-trigger"
                                onClick={() => setIsSubjectsDropdownOpen(!isSubjectsDropdownOpen)}
                            >
                                {formData.professionalInfo.subjectsSpecialization.length > 0 
                                    ? formData.professionalInfo.subjectsSpecialization.join(', ')
                                    : 'Select subject(s)'}
                            </div>
                            {isSubjectsDropdownOpen && (
                                <div className="select-options">
                                    {subjects.map((subject) => (
                                        <div
                                            key={subject}
                                            className={`select-option ${
                                                formData.professionalInfo.subjectsSpecialization.includes(subject)
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                            onClick={() => handleSubjectToggle(subject)}
                                        >
                                            {subject}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {formData.professionalInfo.subjectsSpecialization.length === 0 && (
                            <div className="error-text">Please select at least one subject</div>
                        )}
                    </div>

                    <div className="form-group" ref={gradeLevelsDropdownRef}>
                        <label>Preferred Grade Levels</label>
                        <div className="custom-select">
                            <div 
                                className="select-trigger"
                                onClick={() => setIsGradeLevelsDropdownOpen(!isGradeLevelsDropdownOpen)}
                            >
                                {formData.professionalInfo.preferredGradeLevels.length > 0 
                                    ? formData.professionalInfo.preferredGradeLevels.join(', ')
                                    : 'Select grade level(s)'}
                            </div>
                            {isGradeLevelsDropdownOpen && (
                                <div className="select-options">
                                    {GRADE_LEVELS.map((level) => (
                                        <div
                                            key={level}
                                            className={`select-option ${
                                                formData.professionalInfo.preferredGradeLevels.includes(level)
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                            onClick={() => handleGradeLevelToggle(level)}
                                        >
                                            {level}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {formData.professionalInfo.preferredGradeLevels.length === 0 && (
                            <div className="error-text">Please select at least one grade level</div>
                        )}
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
                    <h3>Required Documents</h3>
                    <div className="form-group">
                        <label>CV (PDF, DOC, or DOCX)</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange('cv', e.target.files)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Academic Certificates (PDF only)</label>
                        <input
                            type="file"
                            accept=".pdf"
                            multiple
                            onChange={(e) => handleFileChange('academicCertificates', e.target.files)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Government ID (PDF, JPEG, or PNG)</label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('governmentId', e.target.files)}
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
                            placeholder="What motivates you to teach? (minimum 100 characters)"
                            required
                            rows="4"
                            minLength="100"
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="essay.teachingPhilosophy"
                            value={formData.essay.teachingPhilosophy}
                            onChange={handleChange}
                            placeholder="Describe your teaching philosophy (minimum 100 characters)"
                            required
                            rows="4"
                            minLength="100"
                        />
                    </div>
                </section>

                <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={isSubmitting || 
                        formData.professionalInfo.subjectsSpecialization.length === 0 || 
                        formData.professionalInfo.preferredGradeLevels.length === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
}

export default TutorApplication;