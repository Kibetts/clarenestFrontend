import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { 
    Facebook, 
    Twitter, 
    Linkedin, 
    Instagram, 
    Mail, 
    Phone, 
    Clock, 
    MapPin,
    ChevronDown,
    MessageSquare 
} from 'lucide-react';
import '../css/ContactUs.css';

export default function ContactUs() {
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [activeAccordion, setActiveAccordion] = useState(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: "0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    setVisibleSections(prev => new Set([...prev, section.id]));
                }
            });
        }, observerOptions);

        document.querySelectorAll('section[id]').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const isSectionVisible = (sectionId) => visibleSections.has(sectionId);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const faqData = [
        {
            question: "What are the admission requirements?",
            answer: "Our admission process considers academic excellence, extracurricular achievements, and personal character. Prospective students must submit their academic transcripts, letters of recommendation, and complete an online assessment."
        },
        {
            question: "How much is the tuition fee?",
            answer: "Tuition fees vary by program. Our comprehensive fee structure includes access to all learning materials, mentoring sessions, and career development resources. Contact our admissions office for detailed program-specific information."
        },
        {
            question: "Do you offer financial aid?",
            answer: "Yes, we offer various financial aid options including merit-based scholarships, need-based grants, and flexible payment plans. Our financial aid team is available to discuss options that best suit your situation."
        },
        {
            question: "What technical requirements do I need for online classes?",
            answer: "Students need a reliable internet connection (minimum 5Mbps), a computer with webcam and microphone, and access to basic software including Microsoft Office or equivalent. Specific programs may have additional requirements."
        },
        {
            question: "How do I access course materials?",
            answer: "All course materials are available through our secure learning management system. Upon enrollment, you'll receive login credentials and comprehensive guidance on accessing and navigating the platform."
        }
    ];

    return (
        <div className="cnt-page">
            <Navbar />
            <div className="cnt-container">
                <section 
                    id="cnt-hero" 
                    className={`cnt-hero ${isSectionVisible('cnt-hero') ? 'visible' : ''}`}
                >
                    <div className="cnt-hero-content cnt-fade-up">
                        <h1 className="cnt-hero-title">Get in Touch</h1>
                        <p className="cnt-hero-subtitle">
                            We're here to answer your questions and help you succeed in your educational journey
                        </p>
                    </div>
                </section>

                <section 
                    id="cnt-info" 
                    className={`cnt-info ${isSectionVisible('cnt-info') ? 'visible' : ''}`}
                >
                    <div className="cnt-info-grid">
                        <div className="cnt-info-card cnt-slide-in-left">
                            <div className="cnt-info-icon">
                                <Mail size={32} />
                            </div>
                            <h3>Email Us</h3>
                            <div className="cnt-info-details">
                                <p>General Inquiries: info@prestigeacademy.edu</p>
                                <p>Admissions: admissions@prestigeacademy.edu</p>
                                <p>Technical Support: support@prestigeacademy.edu</p>
                            </div>
                        </div>

                        <div className="cnt-info-card cnt-slide-in-up">
                            <div className="cnt-info-icon">
                                <Phone size={32} />
                            </div>
                            <h3>Call Us</h3>
                            <div className="cnt-info-details">
                                <p>Main Office: +1 (555) 123-4567</p>
                                <p>Admissions: +1 (555) 234-5678</p>
                                <p>Technical Support: +1 (555) 345-6789</p>
                            </div>
                        </div>

                        <div className="cnt-info-card cnt-slide-in-right">
                            <div className="cnt-info-icon">
                                <Clock size={32} />
                            </div>
                            <h3>Office Hours</h3>
                            <div className="cnt-info-details">
                                <p>Monday - Friday: 8:00 AM - 6:00 PM EST</p>
                                <p>Saturday: 9:00 AM - 1:00 PM EST</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section 
                    id="cnt-form" 
                    className={`cnt-form-section ${isSectionVisible('cnt-form') ? 'visible' : ''}`}
                >
                    <div className="cnt-form-container cnt-fade-up">
                        <div className="cnt-form-content">
                            <h2>Send Us a Message</h2>
                            <p>Fill out the form below and we'll get back to you within 24 hours</p>
                            <form className="cnt-form">
                                <div className="cnt-form-group">
                                    <input type="text" placeholder="Full Name" required />
                                </div>
                                <div className="cnt-form-group">
                                    <input type="email" placeholder="Email Address" required />
                                </div>
                                <div className="cnt-form-group">
                                    <select required>
                                        <option value="">Select Department</option>
                                        <option value="admissions">Admissions</option>
                                        <option value="academic">Academic Support</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="financial">Financial Services</option>
                                    </select>
                                </div>
                                <div className="cnt-form-group">
                                    <textarea placeholder="Your Message" rows="5" required></textarea>
                                </div>
                                <button type="submit" className="cnt-form-button">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section 
                    id="cnt-social" 
                    className={`cnt-social ${isSectionVisible('cnt-social') ? 'visible' : ''}`}
                >
                    <h2 className="cnt-section-title cnt-fade-up">Connect With Us</h2>
                    <div className="cnt-social-links">
                        <a 
                            href="https://facebook.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cnt-social-link cnt-fade-up cnt-delay-100"
                        >
                            <Facebook size={24} />
                            <span>Facebook</span>
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cnt-social-link cnt-fade-up cnt-delay-200"
                        >
                            <Twitter size={24} />
                            <span>Twitter</span>
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cnt-social-link cnt-fade-up cnt-delay-300"
                        >
                            <Linkedin size={24} />
                            <span>LinkedIn</span>
                        </a>
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cnt-social-link cnt-fade-up cnt-delay-400"
                        >
                            <Instagram size={24} />
                            <span>Instagram</span>
                        </a>
                    </div>
                </section>

                <section 
                    id="cnt-faq" 
                    className={`cnt-faq ${isSectionVisible('cnt-faq') ? 'visible' : ''}`}
                >
                    <h2 className="cnt-section-title cnt-fade-up">Frequently Asked Questions</h2>
                    <div className="cnt-faq-grid">
                        {faqData.map((faq, index) => (
                            <div 
                                key={index}
                                className={`cnt-faq-item cnt-fade-up cnt-delay-${(index + 1) * 100}`}
                            >
                                <button 
                                    className={`cnt-faq-question ${activeAccordion === index ? 'active' : ''}`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {faq.question}
                                    <ChevronDown 
                                        size={20} 
                                        className={`cnt-faq-icon ${activeAccordion === index ? 'active' : ''}`}
                                    />
                                </button>
                                <div className={`cnt-faq-answer ${activeAccordion === index ? 'active' : ''}`}>
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}