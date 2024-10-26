import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/StudentApplication.css';

function StudentApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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
            relationship: 'Parent' // Added default value
        },
        learningPreferences: {
            scheduleType: ''
        },
        specialNeeds: {
            hasSpecialNeeds: false,
            accommodationsRequired: ''
        }
    });

    // Simplified prepareFormData function
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');
    
        try {
            const preparedData = prepareFormData(formData);
            console.log('Sending data:', JSON.stringify(preparedData, null, 2));
    
            const response = await fetch('http://localhost:5000/api/applications/student', {
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
    
            setSuccessMessage('Application submitted successfully!');
            setTimeout(() => {
                navigate('/application-submitted');
            }, 2000);
    
        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => {
            const [section, field] = name.split('.');
            if (!field) {
                return { ...prevState, [name]: type === 'checkbox' ? checked : value };
            }
            return {
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [field]: type === 'checkbox' ? checked : value
                }
            };
        });
    };

    return (
        <div className="student-application-form">
            <h2>Student Application Form</h2>
            
            {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <fieldset disabled={isSubmitting}>
                    <legend>Personal Information</legend>
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
                            placeholder="Email"
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
                        <select
                            name="personalInfo.gender"
                            value={formData.personalInfo.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
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
                            placeholder="Location"
                            required
                        />
                    </div>
                </fieldset>

                {/* Educational Information Section */}
                <fieldset disabled={isSubmitting}>
                    <legend>Educational Information</legend>
                    <div className="form-group">
                        <select
                            name="educationalInfo.currentGradeLevel"
                            value={formData.educationalInfo.currentGradeLevel}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Grade Level</option>
                            <option value="1st">1st Grade</option>
                            <option value="2nd">2nd Grade</option>
                            <option value="3rd">3rd Grade</option>
                            <option value="4th">4th Grade</option>
                            <option value="5th">5th Grade</option>
                            <option value="6th">6th Grade</option>
                            <option value="7th">7th Grade</option>
                            <option value="8th">8th Grade</option>
                            <option value="9th">9th Grade</option>
                            <option value="10th">10th Grade</option>
                            <option value="11th">11th Grade</option>
                            <option value="12th">12th Grade</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="educationalInfo.lastSchoolAttended"
                            value={formData.educationalInfo.lastSchoolAttended}
                            onChange={handleChange}
                            placeholder="Last School Attended"
                            required
                        />
                    </div>
                </fieldset>

                {/* Parent Information Section */}
                <fieldset disabled={isSubmitting}>
                    <legend>Parent Information</legend>
                    <div className="form-group">
                        <input
                            type="text"
                            name="parentInfo.name"
                            value={formData.parentInfo.name}
                            onChange={handleChange}
                            placeholder="Parent Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="parentInfo.email"
                            value={formData.parentInfo.email}
                            onChange={handleChange}
                            placeholder="Parent Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            name="parentInfo.phoneNumber"
                            value={formData.parentInfo.phoneNumber}
                            onChange={handleChange}
                            placeholder="Parent Phone Number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="parentInfo.relationship"
                            value={formData.parentInfo.relationship}
                            onChange={handleChange}
                            required
                        >
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Guardian">Guardian</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </fieldset>

                {/* Learning Preferences Section */}
                <fieldset disabled={isSubmitting}>
                    <legend>Learning Preferences</legend>
                    <div className="form-group">
                        <select
                            name="learningPreferences.scheduleType"
                            value={formData.learningPreferences.scheduleType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Schedule Type</option>
                            <option value="full time">Full Time</option>
                            <option value="afterclasses">After Classes</option>
                        </select>
                    </div>
                </fieldset>

                {/* Special Needs Section */}
                <fieldset disabled={isSubmitting}>
                    <legend>Special Needs</legend>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="specialNeeds.hasSpecialNeeds"
                                checked={formData.specialNeeds.hasSpecialNeeds}
                                onChange={handleChange}
                            />
                            Has Special Needs
                        </label>
                    </div>
                    {formData.specialNeeds.hasSpecialNeeds && (
                        <div className="form-group">
                            <textarea
                                name="specialNeeds.accommodationsRequired"
                                value={formData.specialNeeds.accommodationsRequired || ''}
                                onChange={handleChange}
                                placeholder="Describe required accommodations"
                                required={formData.specialNeeds.hasSpecialNeeds}
                            />
                        </div>
                    )}
                </fieldset>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={isSubmitting ? 'submitting' : ''}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
}

export default StudentApplicationForm;