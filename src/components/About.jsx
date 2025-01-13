import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactForm from "./Contact";
import TestimonialForm from "./TestimonialForm";
import missionImage from "../img/mission.jpg";
import visionImage from "../img/vision.jpg";
import openImage from "../img/kenyanHomeschool.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardList,
    faChalkboardTeacher,
    faFileAlt,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import '../css/About.css';



export default function About() {
    const navigate = useNavigate();
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [testimonials, setTestimonials] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch(`/api/testimonials?page=${currentPage}`);
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            
            const data = await response.json();
            setTestimonials(data.data.testimonials);
            setTotalPages(Math.ceil(data.results / 10)); // Assuming 10 items per page
        } catch (err) {
            console.error('Error fetching testimonials:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        fetchTestimonials();
    }, [currentPage]);

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

    return (
        <div className="abt-page">
            <Navbar />
            <div className="abt-page-container">
                <section id="abt-hero" className={`abt-page-hero ${isSectionVisible('abt-hero') ? 'visible' : ''}`}>
                    <div className="abt-page-hero-content abt-fade-up">
                        <p className="abt-page-hero-text">
                            PROFESSIONAL
                            <br /> INSTRUCTORS YOU
                            <br /> CAN TRUST
                        </p>
                    </div>
                </section>

                <section id="abt-mission" className={`abt-page-mission ${isSectionVisible('abt-mission') ? 'visible' : ''}`}>
                    <div className="abt-page-mission-image-container abt-slide-in-left">
                        <img
                            className="abt-page-mission-image"
                            src={missionImage}
                            alt="Our Mission"
                        />
                    </div>
                    <div className="abt-page-mission-content abt-slide-in-right">
                        <h3 className="abt-page-mission-title">OUR MISSION</h3>
                        <p className="abt-page-mission-text">
                            To provide high-quality online education that empowers students to
                            achieve their full potential through personalized learning
                            experiences, innovative teaching methods, and a supportive
                            community.
                        </p>
                    </div>
                </section>

                <section id="abt-vision" className={`abt-page-vision ${isSectionVisible('abt-vision') ? 'visible' : ''}`}>
                    <div className="abt-page-vision-content abt-slide-in-left">
                        <h3 className="abt-page-vision-title">OUR VISION</h3>
                        <p className="abt-page-vision-text">
                            To be the leading online educational platform that transforms
                            lives through accessible, engaging, and effective learning
                            opportunities for students worldwide.
                        </p>
                    </div>
                    <div className="abt-page-vision-image-container abt-slide-in-right">
                        <img 
                            className="abt-page-vision-image" 
                            src={visionImage} 
                            alt="Our Vision" 
                        />
                    </div>
                </section>

                <section id="abt-services" className={`abt-page-services ${isSectionVisible('abt-services') ? 'visible' : ''}`}>
                    <h1 className="abt-page-services-title abt-fade-up">
                        Tutoring Services We Provide
                    </h1>
                    <div className="abt-page-services-grid">
                        <div className="abt-page-service abt-fade-up abt-delay-100">
                            <FontAwesomeIcon
                                icon={faClipboardList}
                                className="abt-page-service-icon"
                            />
                            <h3 className="abt-page-service-title">Detailed Assessment</h3>
                            <div className="abt-page-service-divider"></div>
                            <p className="abt-page-service-text">
                                Comprehensive evaluation of student skills and knowledge to
                                create personalized learning plans.
                            </p>
                        </div>
                        <div className="abt-page-service abt-fade-up abt-delay-200">
                            <FontAwesomeIcon
                                icon={faChalkboardTeacher}
                                className="abt-page-service-icon"
                            />
                            <h3 className="abt-page-service-title">One-on-One Tutoring</h3>
                            <div className="abt-page-service-divider"></div>
                            <p className="abt-page-service-text">
                                Individualized instruction tailored to each student's unique
                                learning needs and goals.
                            </p>
                        </div>
                        <div className="abt-page-service abt-fade-up abt-delay-300">
                            <FontAwesomeIcon 
                                icon={faFileAlt} 
                                className="abt-page-service-icon" 
                            />
                            <h3 className="abt-page-service-title">Test Preparation</h3>
                            <div className="abt-page-service-divider"></div>
                            <p className="abt-page-service-text">
                                Targeted strategies and practice for standardized tests and
                                subject-specific exams.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="abt-learning" className={`abt-page-learning ${isSectionVisible('abt-learning') ? 'visible' : ''}`}>
                    <div className="abt-page-learning-content abt-slide-in-left">
                        <div className="abt-page-learning-header">
                            <p className="abt-page-learning-subtitle">Open Learning For Everyone</p>
                        </div>
                        <h1 className="abt-page-learning-title">
                            Learn From The <br /> Experts
                        </h1>
                        <button className="abt-page-learning-button abt-pulse" onClick={() => navigate('/login')}>Start Learning</button>
                    </div>
                    <div className="abt-page-learning-image-container abt-slide-in-right">
                        <img
                            src={openImage}
                            alt="Open Learning"
                            className="abt-page-learning-image"
                        />
                    </div>
                </section>

                <section id="abt-pride" className={`abt-page-pride ${isSectionVisible('abt-pride') ? 'visible' : ''}`}>
                    <h2 className="abt-page-pride-title abt-fade-up">
                        We Take Pride In The Tutoring Service We Provide
                    </h2>
                    <p className="abt-page-pride-text abt-fade-up abt-delay-100">
                        Our dedicated team of expert tutors is committed to helping every
                        student succeed in their academic journey.
                    </p>
                </section>

                {/* <section id="abt-testimonials" className={`abt-page-testimonials ${isSectionVisible('abt-testimonials') ? 'visible' : ''}`}>
                    <div className="abt-page-testimonials-header">
                        <h2 className="abt-page-testimonials-title abt-fade-up">
                            What People Are Saying About Us
                        </h2>
                        <p className="abt-page-testimonials-subtitle abt-fade-up abt-delay-100">
                            Hear from our students and parents about their experiences with
                            Clarenest Online School.
                        </p>
                    </div>
                    <div className="abt-page-testimonials-grid">
                        {[1, 2, 3, 4].map((index) => (
                            <div 
                                key={index} 
                                className={`abt-page-testimonial abt-fade-up abt-delay-${index * 100}`}
                            >
                                <h4 className="abt-page-testimonial-title">Great Platform</h4>
                                <div className="abt-page-testimonial-divider"></div>
                                <p className="abt-page-testimonial-text">
                                    Clarenest has transformed my learning experience. The tutors
                                    are knowledgeable and supportive, and the platform is easy to
                                    use.
                                </p>
                                <div className="abt-page-testimonial-divider"></div>
                                <div className="abt-page-testimonial-user">
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="abt-page-testimonial-icon" 
                                    />
                                    <p className="abt-page-testimonial-name">John Doe</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section> */}
                 <section id="abt-testimonials" className={`abt-page-testimonials ${isSectionVisible('abt-testimonials') ? 'visible' : ''}`}>
                <div className="abt-page-testimonials-header">
                    <h2 className="abt-page-testimonials-title abt-fade-up">
                        What People Are Saying About Us
                    </h2>
                    <p className="abt-page-testimonials-subtitle abt-fade-up abt-delay-100">
                        Hear from our students and parents about their experiences with
                        Clarenest Online School.
                    </p>
                    {isAuthenticated && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="abt-page-learning-button mt-4 abt-fade-up abt-delay-200"
                        >
                            Share Your Experience
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg max-w-md w-full mx-4">
                            <TestimonialForm 
                                onSubmitSuccess={() => {
                                    fetchTestimonials();
                                    setShowForm(false);
                                }}
                                onClose={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="abt-page-testimonials-grid">
                    {loading ? (
                        <div className="col-span-full text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="col-span-full text-center">
                            No testimonials available yet.
                        </div>
                    ) : (
                        testimonials.map((testimonial, index) => (
                            <div 
                                key={testimonial._id} 
                                className={`abt-page-testimonial abt-fade-up abt-delay-${index * 100}`}
                            >
                                <h4 className="abt-page-testimonial-title">{testimonial.title}</h4>
                                <div className="flex gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="abt-page-testimonial-divider"></div>
                                <p className="abt-page-testimonial-text">
                                    {testimonial.content}
                                </p>
                                <div className="abt-page-testimonial-divider"></div>
                                <div className="abt-page-testimonial-user">
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="abt-page-testimonial-icon" 
                                    />
                                    <p className="abt-page-testimonial-name">
                                        {testimonial.author.name}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === i + 1
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </section>
            </div>
            <ContactForm />
            <Footer />
        </div>
    );
}