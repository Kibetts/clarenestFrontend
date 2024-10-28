import React from 'react';
import '../css/ContactForm.css';

const ContactForm = () => {
    return (
        <div className="contact">
            <div className="contact-container">
                <h2 className='contact-title'>Let's Get in Touch</h2>
                
                <form className="contact-form">
                    <div className="contact-row">
                        <div className="contact-field">
                            <label className="contact-label" htmlFor="firstName">First Name</label>
                            <input 
                                className="contact-input"
                                type="text" 
                                id="firstName" 
                                name="firstName" 
                            />
                        </div>
                        <div className="contact-field">
                            <label className="contact-label" htmlFor="lastName">Last Name</label>
                            <input 
                                className="contact-input"
                                type="text" 
                                id="lastName" 
                                name="lastName" 
                            />
                        </div>
                    </div>

                    <div className="contact-row">
                        <div className="contact-field">
                            <label className="contact-label" htmlFor="phoneNumber">Phone Number</label>
                            <input 
                                className="contact-input"
                                type="tel" 
                                id="phoneNumber" 
                                name="phoneNumber" 
                            />
                        </div>
                        <div className="contact-field">
                            <label className="contact-label" htmlFor="email">Email</label>
                            <input 
                                className="contact-input"
                                type="email" 
                                id="email" 
                                name="email" 
                            />
                        </div>
                    </div>

                    <div className="contact-field contact-field-full">
                        <label className="contact-label" htmlFor="subject">Subject</label>
                        <input 
                            className="contact-input"
                            type="text" 
                            id="subject" 
                            name="subject" 
                        />
                    </div>

                    <div className="contact-field contact-field-full">
                        <label className="contact-label" htmlFor="message">Message</label>
                        <textarea 
                            className="contact-textarea"
                            id="message" 
                            name="message" 
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="contact-field contact-field-full">
                        <button type="submit" className="contact-button">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;