import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/StudentApplication.css';

function StudentApplicationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            dateOfBirth: '',
            gender: '',
            nationality: '',
            location: ''
        },
        educationalInfo: {
            currentGradeLevel: '',
            lastSchoolAttended: ''
        },
        parentInfo: {
            name: '',
            email: '',
            phoneNumber: '',
            relationship: 'Parent'
        },
        learningPreferences: {
            scheduleType: ''
        },
        specialNeeds: {
            hasSpecialNeeds: false,
            accommodationsRequired: ''
        }
    });

    const steps = [
        {
            title: 'Personal Information',
            fields: ['personalInfo']
        },
        {
            title: 'Educational Background',
            fields: ['educationalInfo']
        },
        {
            title: 'Parent/Guardian Information',
            fields: ['parentInfo']
        },
        {
            title: 'Learning Preferences & Special Needs',
            fields: ['learningPreferences', 'specialNeeds']
        }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const [section, field] = name.split('.');
        
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [field]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const validateStep = (step) => {
        const currentStepFields = steps[step - 1].fields;
        let isValid = true;
        let errorMessage = '';

        currentStepFields.forEach(section => {
            Object.entries(formData[section]).forEach(([key, value]) => {
                if (typeof value === 'boolean') return;
                if (!value && !(section === 'specialNeeds' && key === 'accommodationsRequired')) {
                    isValid = false;
                    errorMessage = 'Please fill in all required fields';
                }
            });
        });

        if (currentStep === 1) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.personalInfo.email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (currentStep === 3) {
            const parentEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!parentEmailRegex.test(formData.parentInfo.email)) {
                isValid = false;
                errorMessage = 'Please enter a valid parent email address';
            }

            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(formData.parentInfo.phoneNumber)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        setError(errorMessage);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            setError('');
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    };

    const prepareFormData = (data) => {
        return {
            personalInfo: {
                ...data.personalInfo,
                dateOfBirth: new Date(data.personalInfo.dateOfBirth).toISOString()
            },
            educationalInfo: {
                currentGradeLevel: data.educationalInfo.currentGradeLevel,
                lastSchoolAttended: data.educationalInfo.lastSchoolAttended
            },
            parentInfo: {
                name: data.parentInfo.name,
                email: data.parentInfo.email,
                phoneNumber: data.parentInfo.phoneNumber,
                relationship: data.parentInfo.relationship
            },
            learningPreferences: {
                scheduleType: data.learningPreferences.scheduleType
            },
            specialNeeds: {
                hasSpecialNeeds: data.specialNeeds.hasSpecialNeeds,
                accommodationsRequired: data.specialNeeds.hasSpecialNeeds 
                    ? data.specialNeeds.accommodationsRequired 
                    : null
            }
        };
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        setError('');

        try {
            const preparedData = prepareFormData(formData);
            
            const response = await fetch('https://clarenest-6bd4.onrender.com/api/applications/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(preparedData)
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || responseData.error || 'Failed to submit application');
            }

            navigate('/application-submitted');
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFormFields = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="student-app-step">
                        <div className="student-app-field">
                            <label className="student-app-label">Full Name</label>
                            <input
                                type="text"
                                name="personalInfo.fullName"
                                value={formData.personalInfo.fullName}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Email</label>
                            <input
                                type="email"
                                name="personalInfo.email"
                                value={formData.personalInfo.email}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Date of Birth</label>
                            <input
                                type="date"
                                name="personalInfo.dateOfBirth"
                                value={formData.personalInfo.dateOfBirth}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Gender</label>
                            <select
                                name="personalInfo.gender"
                                value={formData.personalInfo.gender}
                                onChange={handleChange}
                                className="student-app-select"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Nationality</label>
                            <input
                                type="text"
                                name="personalInfo.nationality"
                                value={formData.personalInfo.nationality}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Location</label>
                            <input
                                type="text"
                                name="personalInfo.location"
                                value={formData.personalInfo.location}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="student-app-step">
                        <div className="student-app-field">
                    <label className="student-app-label">Current Grade Level</label>
                    <select
                        name="educationalInfo.currentGradeLevel"
                        value={formData.educationalInfo.currentGradeLevel}
                        onChange={handleChange}
                        className="student-app-select"
                        required
                    >
                        <option value="">Select Grade Level</option>
                        {[
                            '1st', '2nd', '3rd', '4th', '5th', '6th',
                            '7th', '8th', '9th', '10th', '11th', '12th'
                        ].map((grade) => (
                            <option key={grade} value={grade}>
                                {grade}
                            </option>
                        ))}
                    </select>
                </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Last School Attended</label>
                            <input
                                type="text"
                                name="educationalInfo.lastSchoolAttended"
                                value={formData.educationalInfo.lastSchoolAttended}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="student-app-step">
                        <div className="student-app-field">
                            <label className="student-app-label">Parent/Guardian Name</label>
                            <input
                                type="text"
                                name="parentInfo.name"
                                value={formData.parentInfo.name}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Parent/Guardian Email</label>
                            <input
                                type="email"
                                name="parentInfo.email"
                                value={formData.parentInfo.email}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Parent/Guardian Phone</label>
                            <input
                                type="tel"
                                name="parentInfo.phoneNumber"
                                value={formData.parentInfo.phoneNumber}
                                onChange={handleChange}
                                className="student-app-input"
                                required
                            />
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-label">Relationship</label>
                            <select
                                name="parentInfo.relationship"
                                value={formData.parentInfo.relationship}
                                onChange={handleChange}
                                className="student-app-select"
                                required
                            >
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="student-app-step">
                        <div className="student-app-field">
                            <label className="student-app-label">Schedule Type</label>
                            <select
                                name="learningPreferences.scheduleType"
                                value={formData.learningPreferences.scheduleType}
                                onChange={handleChange}
                                className="student-app-select"
                                required
                            >
                                <option value="">Select Schedule Type</option>
                                <option value="full time">Full Time</option>
                                <option value="afterclasses">After Classes</option>
                            </select>
                        </div>

                        <div className="student-app-field">
                            <label className="student-app-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="specialNeeds.hasSpecialNeeds"
                                    checked={formData.specialNeeds.hasSpecialNeeds}
                                    onChange={handleChange}
                                    className="student-app-checkbox"
                                />
                                <span>Does the student have any special needs?</span>
                            </label>
                        </div>

                        {formData.specialNeeds.hasSpecialNeeds && (
                            <div className="student-app-field">
                                <label className="student-app-label">
                                    Please describe required accommodations
                                </label>
                                <textarea
                                    name="specialNeeds.accommodationsRequired"
                                    value={formData.specialNeeds.accommodationsRequired}
                                    onChange={handleChange}
                                    className="student-app-textarea"
                                    rows="4"
                                    required
                                />
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="student-app">
            <div className="student-app-container">
                <h2 className="student-app-title">Student Application</h2>
                
                <div className="student-app-progress">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className={`student-app-progress-step ${
                                currentStep > index + 1 ? 'completed' : 
                                currentStep === index + 1 ? 'active' : ''
                            }`}
                        >
                            <div className="student-app-progress-number">{index + 1}</div>
                            <span className="student-app-progress-title">{step.title}</span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="student-app-error">
                        {error}
                    </div>
                )}

                <form className="student-app-form">
                    {renderFormFields()}

                    <div className="student-app-actions">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="student-app-button secondary"
                                disabled={isSubmitting}
                            >
                                Previous
                            </button>
                        )}
                        
                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="student-app-button primary"
                                disabled={isSubmitting}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="student-app-button primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentApplicationForm;