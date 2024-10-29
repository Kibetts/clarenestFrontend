import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../css/Home.css';

import { 
    faGraduationCap, 
    faChalkboardTeacher, 
    faChartLine, 
    faGlobe, 
    faBriefcase 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TransformCarousel = ({ features, activeFeature, setActiveFeature }) => {
    return (
        <div className="main-transform-carousel">
            <div className="main-transform-features-container">
                {features.map((feature, index) => (
                    <div 
                        key={index}
                        className={`main-transform-feature ${index === activeFeature ? 'active' : ''}`}
                        style={{
                            transform: `translateX(${(index - activeFeature) * 100}%)`,
                            opacity: 1,
                            position: 'absolute',
                            width: '100%',
                            transition: 'transform 0.5s ease'
                        }}
                    >
                        <div className="main-feature-icon">{feature.icon}</div>
                        <h3 className="main-transform-feature-title">{feature.title}</h3>
                        <p className="main-transform-feature-text">{feature.text}</p>
                        <button className="main-transform-feature-button">Learn More</button>
                    </div>
                ))}
            </div>
            <div className="main-feature-navigation">
                {features.map((_, index) => (
                    <button 
                        key={index}
                        className={`main-nav-dot ${index === activeFeature ? 'active' : ''}`}
                        onClick={() => setActiveFeature(index)}
                        aria-label={`View feature ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function Home() {
    const [activeFeature, setActiveFeature] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());

    useEffect(() => {
        const stats = [
            { selector: ".main-stat-number-1", endValue: 7 },
            { selector: ".main-stat-number-2", endValue: 500 },
            { selector: ".main-stat-number-3", endValue: 1000 },
            { selector: ".main-stat-number-4", endValue: 100 }
        ];

        function animateCountUp(element, endValue, duration = 1500) {
            let startValue = 0;
            const increment = endValue / (duration / 50);

            const counter = setInterval(() => {
                startValue += increment;
                if (startValue >= endValue) {
                    clearInterval(counter);
                    element.innerText = endValue;
                } else {
                    element.innerText = Math.floor(startValue);
                }
            }, 50);
        }

        const observerOptions = {
            threshold: 0.2,
            rootMargin: "0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    setVisibleSections(prev => new Set([...prev, section.id]));
                    
                    if (section.id === 'main-stats-section') {
                        stats.forEach((stat) => {
                            const element = document.querySelector(stat.selector);
                            if (element) animateCountUp(element, stat.endValue);
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('section[id]').forEach((section) => {
            observer.observe(section);
        });

        const featureInterval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % transformFeatures.length);
        }, 5000);

        return () => {
            clearInterval(featureInterval);
            observer.disconnect();
        };
    }, []);

    const transformFeatures = [
        {
            title: "Excellence In Education",
            text: "Our curriculum is designed to match the rigor of Ivy League institutions, featuring advanced coursework, research opportunities, and interdisciplinary learning approaches.",
            icon: <FontAwesomeIcon icon={faGraduationCap} className="fa-1x" />
        },
        {
            title: "World-Class Educators",
            text: "Learn from distinguished professors and industry leaders who bring decades of experience from top universities and Fortune 500 companies.",
            icon: <FontAwesomeIcon icon={faChalkboardTeacher} className="fa-1x" />
        },
        {
            title: "Comprehensive Monitoring",
            text: "Track your progress with our advanced analytics system, receiving personalized feedback and adaptive learning recommendations.",
            icon: <FontAwesomeIcon icon={faChartLine} className="fa-1x" />
        },
        {
            title: "Global Network",
            text: "Join a diverse community of learners from over 100 countries, fostering international connections and collaborative opportunities.",
            icon: <FontAwesomeIcon icon={faGlobe} className="fa-1x" />
        },
        {
            title: "Career Development",
            text: "Access exclusive career services, including mentorship programs, internship placements, and networking events with industry leaders.",
            icon: <FontAwesomeIcon icon={faBriefcase} className="fa-1x" />
        }
    ];

    const isSectionVisible = (sectionId) => visibleSections.has(sectionId);

    return (
        <div className="main-home">
            <Navbar />
            <div className="main-container">
                <section 
                    id="main-hero" 
                    className={`main-hero ${isSectionVisible('main-hero') ? 'visible' : ''}`}
                >
                    <div className="main-hero-content">
                        <h1 className="main-hero-title">Elevate Your Education to International Standards</h1>
                        <p className="main-hero-subtitle">Experience world-class online education that transforms futures and opens doors to exceptional opportunities</p>
                        <div className="main-hero-cta">
                            <button className="main-hero-button primary">Start Your Journey</button>
                        </div>
                    </div>
                </section>

                <section 
                    id="main-about" 
                    className={`main-about ${isSectionVisible('main-about') ? 'visible' : ''}`}
                >
                    <h2 className="main-about-title">Redefining Online Education</h2>
                    <div className="main-about-grid">
                        <div className="main-about-item main-slide-in-left">
                            <h3>Our Vision</h3>
                            <p>To be the leading online educational platform that transforms lives through accessible, engaging, and effective learning opportunities for students worldwide.</p>
                        </div>
                        <div className="main-about-item main-slide-in-right">
                            <h3>Our Mission</h3>
                            <p>To provide high-quality online education that empowers students to achieve their full potential through personalized learning experiences, innovative teaching methods, and a supportive community.</p>
                        </div>
                    </div>
                </section>

                <section 
                    id="main-stats-section" 
                    className={`main-stats ${isSectionVisible('main-stats-section') ? 'visible' : ''}`}
                >
                    <div className="main-stat-item main-fade-in">
                        <p className="main-stat-number-1">7</p>
                        <p className="main-stat-label">Student-to-Instructor Ratio</p>
                    </div>
                    <div className="main-stat-item main-fade-in">
                        <p className="main-stat-number-2">500</p>
                        <p className="main-stat-label">Students</p>
                    </div>
                    <div className="main-stat-item main-fade-in">
                        <p className="main-stat-number-3">1000</p>
                        <p className="main-stat-label">Resources</p>
                    </div>
                    <div className="main-stat-item main-fade-in">
                        <p className="main-stat-number-4">100</p>
                        <p className="main-stat-label">Graduates</p>
                    </div>
                </section>

                <section 
                    id="main-transform" 
                    className={`main-transform ${isSectionVisible('main-transform') ? 'visible' : ''}`}
                >
                    <h2 className="main-transform-title">Transform Your Future</h2>
                    <TransformCarousel 
                        features={transformFeatures}
                        activeFeature={activeFeature}
                        setActiveFeature={setActiveFeature}
                    />
                </section>

                <section 
                    id="main-programs" 
                    className={`main-programs ${isSectionVisible('main-programs') ? 'visible' : ''}`}
                >
                    <h2 className="main-programs-title">Featured Programs</h2>
                    <div className="main-programs-grid">
                        <div className="main-program-card main-slide-in-left">
                            <h3>Introductory Software Development</h3>
                            <p>Indulge cutting-edge technologies at a young age!</p>
                            <ul className="main-program-highlights">
                                <li>Foundational Programming Languages</li>
                                <li>Project-Based Learning</li>
                                <li>Problem-Solving Skills</li>
                            </ul>
                        </div>
                        <div className="main-program-card main-slide-in-right">
                            <h3>Extra-carricular activities</h3>
                            <p>Creative, social, and wellness-oriented activities</p>
                            <ul className="main-program-highlights">
                                <li>Spelling Bee</li>
                                <li>Literary and Debate Club</li>
                                <li>Virtual Sports and Wellness Activities</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section 
                    id="main-testimonials" 
                    className={`main-testimonials ${isSectionVisible('main-testimonials') ? 'visible' : ''}`}
                >
                    <h2>Student Success Stories</h2>
                    <div className="main-testimonials-grid">
                        <div className="main-testimonial-card main-fade-in">
                            <p>"The teachers here are incredibly supportive, especially in subjects like math where I used to struggle. I’ve improved so much! Plus, with clubs and activities, I’ve made amazing friends and memories. It’s a great place to learn and have fun!"</p>
                            <div className="main-testimonial-author">
                                <p className="main-author-name">Sarah Cheptoo</p>
                                <p className="main-author-title">Student</p>
                            </div>
                        </div>
                        <div className="main-testimonial-card main-fade-in">
                            <p>"This school makes everyone feel like they belong. Joining the debate club helped me discover new passions and build confidence. The encouragement from teachers and friends here has made a big difference in my life."</p>
                            <div className="main-testimonial-author">
                                <p className="main-author-name">Allan Maina</p>
                                <p className="main-author-title">Student</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section 
                    id="main-cta" 
                    className={`main-cta ${isSectionVisible('main-cta') ? 'visible' : ''}`}
                >
                    <div className="main-cta-content main-slide-in-left">
                        <h2>Begin Your Academic Journey</h2>
                        <p>Join our next intake and transform your future prospects</p>
                        <button className="main-cta-button">Apply Now</button>
                    </div>
                    <div className="main-cta-image main-slide-in-right">
                        <img src="../img/children.jpg" alt="home-school life" />
                    </div>
                </section>

                <section 
                    id="main-newsletter" 
                    className={`main-newsletter ${isSectionVisible('main-newsletter') ? 'visible' : ''}`}
                >
                    <h2 className="main-newsletter-title">Stay Updated with Our Latest Programs</h2>
                    <div className="main-newsletter-form main-fade-in">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="main-newsletter-input"
                        />
                        <button className="main-newsletter-button">Subscribe</button>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}