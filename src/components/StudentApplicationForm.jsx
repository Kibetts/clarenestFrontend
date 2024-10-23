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
            lastSchoolAttended: '',
            interestedSubjects: []
        },
        parentInfo: {
            name: '',
            email: '',
            phoneNumber: ''
        },
        learningPreferences: {
            preferredSchedule: '',
            learningInterests: []
        },
        specialNeeds: {
            hasSpecialNeeds: false,
            accommodationsRequired: ''
        }
    });

    // Convert form data to match backend expectations
    const prepareFormData = (data) => {
        return {
            ...data,
            educationalInfo: {
                ...data.educationalInfo,
                currentGradeLevel: parseInt(data.educationalInfo.currentGradeLevel, 10),
                interestedSubjects: Array.isArray(data.educationalInfo.interestedSubjects) 
                    ? data.educationalInfo.interestedSubjects 
                    : data.educationalInfo.interestedSubjects.split(',').map(s => s.trim())
            },
            learningPreferences: {
                ...data.learningPreferences,
                learningInterests: Array.isArray(data.learningPreferences.learningInterests)
                    ? data.learningPreferences.learningInterests
                    : data.learningPreferences.learningInterests.split(',').map(s => s.trim())
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            console.log('Submitting form data:', formData); // Debug log

            const preparedData = prepareFormData(formData);
            console.log('Prepared data:', preparedData); // Debug log

            const response = await fetch('http://localhost:5000/api/applications/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData)
            });

            const responseData = await response.json();
            console.log('Response:', responseData); // Debug log

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to submit application');
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

    const handleArrayChange = (e, field) => {
        const { value } = e.target;
        const [section, subfield] = field.split('.');
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [subfield]: value.split(',').map(item => item.trim())
            }
        }));
    };

    return (
        <div className="student-application-form">
            <h2>Student Application Form</h2>
            
            {errorMessage && (
                <div className="alert alert-error">
                    {errorMessage}
                </div>
            )}
            
            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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

                {/* Educational Information */}
                <fieldset disabled={isSubmitting}>
                    <legend>Educational Information</legend>
                    <div className="form-group">
                        <input
                            type="number"
                            name="educationalInfo.currentGradeLevel"
                            value={formData.educationalInfo.currentGradeLevel}
                            onChange={handleChange}
                            placeholder="Current Grade Level"
                            min="1"
                            max="12"
                            required
                        />
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

                    <div className="form-group">
                        <input
                            type="text"
                            name="educationalInfo.interestedSubjects"
                            value={formData.educationalInfo.interestedSubjects.join(', ')}
                            onChange={(e) => handleArrayChange(e, 'educationalInfo.interestedSubjects')}
                            placeholder="Interested Subjects (comma-separated)"
                            required
                        />
                    </div>
                </fieldset>

                {/* Parent Information */}
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
                </fieldset>

                {/* Learning Preferences */}
                <fieldset disabled={isSubmitting}>
                    <legend>Learning Preferences</legend>
                    <div className="form-group">
                        <input
                            type="text"
                            name="learningPreferences.preferredSchedule"
                            value={formData.learningPreferences.preferredSchedule}
                            onChange={handleChange}
                            placeholder="Preferred Schedule"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="learningPreferences.learningInterests"
                            value={formData.learningPreferences.learningInterests.join(', ')}
                            onChange={(e) => handleArrayChange(e, 'learningPreferences.learningInterests')}
                            placeholder="Learning Interests (comma-separated)"
                            required
                        />
                    </div>
                </fieldset>

                {/* Special Needs */}
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
                                value={formData.specialNeeds.accommodationsRequired}
                                onChange={handleChange}
                                placeholder="Describe required accommodations"
                                required
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