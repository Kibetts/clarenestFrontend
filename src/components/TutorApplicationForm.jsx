import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TutorApplication.css';

const GRADE_LEVELS = [
    '1st', '2nd', '3rd', '4th', '5th', '6th', 
    '7th', '8th', '9th', '10th', '11th', '12th'
];

const SUBJECTS = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science"
];

const STEPS = [
    {
        title: 'Personal Information',
        fields: ['personalInfo']
    },
    {
        title: 'Professional Information',
        fields: ['professionalInfo']
    },
    {
        title: 'Documents & Certifications',
        fields: ['documents']
    },
    {
        title: 'References & Essay',
        fields: ['professionalReferences', 'essay']
    }
];

function TutorApplication() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

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

    const handleInputChange = (e, section, field, index = null) => {
        const { value, files, type, checked } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev };
            
            if (type === 'file') {
                if (files.length > 0) {
                    if (field === 'academicCertificates') {
                        newState.documents[field] = Array.from(files);
                    } else {
                        newState.documents[field] = files[0];
                    }
                }
            } else if (index !== null) {
                newState[section][index][field] = value;
            } else if (field === 'subjectsSpecialization' || field === 'preferredGradeLevels') {
                const values = value.split(',').map(item => item.trim());
                newState[section][field] = values;
            } else if (type === 'checkbox') {
                newState[section][field] = checked;
            } else {
                newState[section][field] = value;
            }
            
            return newState;
        });
    };

    const validateStep = (step) => {
        const currentStepFields = STEPS[step - 1].fields;
        let isValid = true;
        let errorMessage = '';

        currentStepFields.forEach(section => {
            if (section === 'documents') {
                if (step === 3 && (!formData.documents.cv || !formData.documents.governmentId)) {
                    isValid = false;
                    errorMessage = 'Please upload all required documents';
                }
            } else if (section === 'professionalReferences') {
                formData.professionalReferences.forEach((ref, index) => {
                    if (!ref.name || !ref.relationship || !ref.contactInfo) {
                        isValid = false;
                        errorMessage = 'Please complete all reference information';
                    }
                });
            } else {
                Object.entries(formData[section]).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length === 0) {
                        isValid = false;
                        errorMessage = 'Please fill in all required fields';
                    } else if (!value && typeof value === 'string') {
                        isValid = false;
                        errorMessage = 'Please fill in all required fields';
                    }
                });
            }
        });

        if (!isValid) {
            setError(errorMessage);
        } else {
            setError(null);
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            const { documents, ...otherFormData } = formData;
            
            // Append documents
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

            // Append other form data
            formDataToSend.append('application', JSON.stringify(otherFormData));

            const response = await fetch('http://localhost:5000/api/applications/tutor', {
                method: 'POST',
                body: formDataToSend
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to submit application');
            }

            navigate('/application-submitted');
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
            setShowConfirmation(false);
        }
    };

    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="tutor-app-step">
                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Full Name</label>
                            <input
                                type="text"
                                value={formData.personalInfo.fullName}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'fullName')}
                                className="tutor-app-input"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Email</label>
                            <input
                                type="email"
                                value={formData.personalInfo.email}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'email')}
                                className="tutor-app-input"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.personalInfo.dateOfBirth}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'dateOfBirth')}
                                className="tutor-app-input"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Nationality</label>
                            <input
                                type="text"
                                value={formData.personalInfo.nationality}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'nationality')}
                                className="tutor-app-input"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Current Location</label>
                            <input
                                type="text"
                                value={formData.personalInfo.location}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'location')}
                                className="tutor-app-input"
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="tutor-app-step">
                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Academic Qualifications (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.professionalInfo.academicQualifications.join(', ')}
                                onChange={(e) => handleInputChange(e, 'professionalInfo', 'academicQualifications')}
                                className="tutor-app-input"
                                placeholder="e.g., BSc Mathematics, MSc Physics"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Years of Teaching Experience</label>
                            <input
                                type="number"
                                value={formData.professionalInfo.teachingExperience}
                                onChange={(e) => handleInputChange(e, 'professionalInfo', 'teachingExperience')}
                                className="tutor-app-input"
                                min="0"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Subjects Specialization</label>
                            <div className="tutor-app-checkbox-group">
                                {SUBJECTS.map(subject => (
                                    <label key={subject} className="tutor-app-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.professionalInfo.subjectsSpecialization.includes(subject)}
                                            onChange={(e) => {
                                                const newSubjects = e.target.checked
                                                    ? [...formData.professionalInfo.subjectsSpecialization, subject]
                                                    : formData.professionalInfo.subjectsSpecialization.filter(s => s !== subject);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    professionalInfo: {
                                                        ...prev.professionalInfo,
                                                        subjectsSpecialization: newSubjects
                                                    }
                                                }));
                                            }}
                                            className="tutor-app-checkbox"
                                        />
                                        {subject}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Preferred Grade Levels</label>
                            <div className="tutor-app-checkbox-group">
                                {GRADE_LEVELS.map(grade => (
                                    <label key={grade} className="tutor-app-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.professionalInfo.preferredGradeLevels.includes(grade)}
                                            onChange={(e) => {
                                                const newGrades = e.target.checked
                                                    ? [...formData.professionalInfo.preferredGradeLevels, grade]
                                                    : formData.professionalInfo.preferredGradeLevels.filter(g => g !== grade);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    professionalInfo: {
                                                        ...prev.professionalInfo,
                                                        preferredGradeLevels: newGrades
                                                    }
                                                }));
                                            }}
                                            className="tutor-app-checkbox"
                                        />
                                        {grade}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Availability (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.professionalInfo.availability.join(', ')}
                                onChange={(e) => handleInputChange(e, 'professionalInfo', 'availability')}
                                className="tutor-app-input"
                                placeholder="e.g., Monday 9-5, Tuesday 10-6"
                                required
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Certifications (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.professionalInfo.certifications.join(', ')}
                                onChange={(e) => handleInputChange(e, 'professionalInfo', 'certifications')}
                                className="tutor-app-input"
                                placeholder="e.g., TEFL, CELTA"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="tutor-app-step">
                        <div className="tutor-app-field">
                            <label className="tutor-app-label">CV/Resume (PDF, DOC, or DOCX)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleInputChange(e, 'documents', 'cv')}
                                className="tutor-app-file"
                                required
                            />
                            {formData.documents.cv && (
                                <span className="tutor-app-file-name">
                                    Selected: {formData.documents.cv.name}
                                </span>
                            )}
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Academic Certificates (PDF only)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={(e) => handleInputChange(e, 'documents', 'academicCertificates')}
                                className="tutor-app-file"
                                required
                            />
                            {formData.documents.academicCertificates.length > 0 && (
                                <div className="tutor-app-file-list">
                                    {Array.from(formData.documents.academicCertificates).map((file, index) => (
                                        <span key={index} className="tutor-app-file-name">
                                            {file.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Government ID (PDF, JPEG, or PNG)</label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleInputChange(e, 'documents', 'governmentId')}
                                className="tutor-app-file"
                                required
                            />
                            {formData.documents.governmentId && (
                                <span className="tutor-app-file-name">
                                    Selected: {formData.documents.governmentId.name}
                                </span>
                            )}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="tutor-app-step">
                        {formData.professionalReferences.map((reference, index) => (
                            <div key={index} className="tutor-app-reference">
                                <h3 className="tutor-app-subtitle">
                                    Professional Reference {index + 1}
                                </h3>
                                <div className="tutor-app-field">
                                    <label className="tutor-app-label">Name</label>
                                    <input
                                        type="text"
                                        value={reference.name}
                                        onChange={(e) => handleInputChange(e, 'professionalReferences', 'name', index)}
                                        className="tutor-app-input"
                                        required
                                    />
                                </div>
                                <div className="tutor-app-field">
                                    <label className="tutor-app-label">Relationship/Position</label>
                                    <input
                                        type="text"
                                        value={reference.relationship}
                                        onChange={(e) => handleInputChange(e, 'professionalReferences', 'relationship', index)}
                                        className="tutor-app-input"
                                        required
                                    />
                                </div>
                                <div className="tutor-app-field">
                                    <label className="tutor-app-label">Contact Information</label>
                                    <input
                                        type="text"
                                        value={reference.contactInfo}
                                        onChange={(e) => handleInputChange(e, 'professionalReferences', 'contactInfo', index)}
                                        className="tutor-app-input"
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Teaching Philosophy</label>
                            <textarea
                                value={formData.essay.teachingPhilosophy}
                                onChange={(e) => handleInputChange(e, 'essay', 'teachingPhilosophy')}
                                className="tutor-app-textarea"
                                rows="6"
                                placeholder="Describe your teaching philosophy and approach..."
                                required
                                minLength={100}
                            />
                        </div>

                        <div className="tutor-app-field">
                            <label className="tutor-app-label">Motivation</label>
                            <textarea
                                value={formData.essay.motivation}
                                onChange={(e) => handleInputChange(e, 'essay', 'motivation')}
                                className="tutor-app-textarea"
                                rows="6"
                                placeholder="What motivates you to teach?"
                                required
                                minLength={100}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="tutor-app">
            <div className="tutor-app-container">
                <h1 className="tutor-app-title">Tutor Application</h1>
                
                <div className="tutor-app-progress">
                    {STEPS.map((step, index) => (
                        <div 
                            key={index}
                            className={`tutor-app-progress-step ${
                                currentStep > index + 1 ? 'completed' : 
                                currentStep === index + 1 ? 'active' : ''
                            }`}
                        >
                            <div className="tutor-app-progress-number">
                                {index + 1}
                            </div>
                            <span className="tutor-app-progress-title">
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="tutor-app-error">
                        {error}
                    </div>
                )}

                <form className="tutor-app-form" onSubmit={(e) => e.preventDefault()}>
                    {renderFormStep()}

                    <div className="tutor-app-actions">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="tutor-app-button secondary"
                                disabled={isSubmitting}
                            >
                                Previous
                            </button>
                        )}
                        
                        {currentStep < STEPS.length ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="tutor-app-button primary"
                                disabled={isSubmitting}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(true)}
                                className="tutor-app-button primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {showConfirmation && (
                <div className="tutor-app-modal">
                    <div className="tutor-app-modal-content">
                        <h2 className="tutor-app-modal-title">Confirm Submission</h2>
                        <p className="tutor-app-modal-text">
                            Are you sure you want to submit your application? Please verify that all information is correct.
                        </p>
                        <div className="tutor-app-modal-actions">
                            <button
                                className="tutor-app-button secondary"
                                onClick={() => setShowConfirmation(false)}
                                disabled={isSubmitting}
                            >
                                Review Application
                            </button>
                            <button
                                className="tutor-app-button primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TutorApplication;