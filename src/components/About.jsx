import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactForm from "./Contact";
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
    return (
        <div className="about">
            <Navbar />
            <div className="about-container">
                <section className="about-hero">
                    <div className="about-hero-content">
                        <p className="about-hero-text">
                            PROFESSIONAL
                            <br /> INSTRUCTORS YOU
                            <br /> CAN TRUST
                        </p>
                    </div>
                </section>

                <section className="about-mission">
                    <div className="about-mission-image-container">
                        <img
                            className="about-mission-image"
                            src={missionImage}
                            alt="Our Mission"
                        />
                    </div>
                    <div className="about-mission-content">
                        <h3 className="about-mission-title">OUR MISSION</h3>
                        <p className="about-mission-text">
                            To provide high-quality online education that empowers students to
                            achieve their full potential through personalized learning
                            experiences, innovative teaching methods, and a supportive
                            community.
                        </p>
                    </div>
                </section>

                <section className="about-vision">
                    <div className="about-vision-content">
                        <h3 className="about-vision-title">OUR VISION</h3>
                        <p className="about-vision-text">
                            To be the leading online educational platform that transforms
                            lives through accessible, engaging, and effective learning
                            opportunities for students worldwide.
                        </p>
                    </div>
                    <div className="about-vision-image-container">
                        <img 
                            className="about-vision-image" 
                            src={visionImage} 
                            alt="Our Vision" 
                        />
                    </div>
                </section>

                <section className="about-services">
                    <h1 className="about-services-title">
                        Tutoring Services We Provide
                    </h1>
                    <div className="about-services-grid">
                        <div className="about-service">
                            <FontAwesomeIcon
                                icon={faClipboardList}
                                className="about-service-icon"
                            />
                            <h3 className="about-service-title">Detailed Assessment</h3>
                            <div className="about-service-divider"></div>
                            <p className="about-service-text">
                                Comprehensive evaluation of student skills and knowledge to
                                create personalized learning plans.
                            </p>
                        </div>
                        <div className="about-service">
                            <FontAwesomeIcon
                                icon={faChalkboardTeacher}
                                className="about-service-icon"
                            />
                            <h3 className="about-service-title">One-on-One Tutoring</h3>
                            <div className="about-service-divider"></div>
                            <p className="about-service-text">
                                Individualized instruction tailored to each student's unique
                                learning needs and goals.
                            </p>
                        </div>
                        <div className="about-service">
                            <FontAwesomeIcon 
                                icon={faFileAlt} 
                                className="about-service-icon" 
                            />
                            <h3 className="about-service-title">Test Preparation</h3>
                            <div className="about-service-divider"></div>
                            <p className="about-service-text">
                                Targeted strategies and practice for standardized tests and
                                subject-specific exams.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="about-learning">
                    <div className="about-learning-content">
                        <div className="about-learning-header">
                            <p className="about-learning-subtitle">Open Learning For Everyone</p>
                        </div>
                        <h1 className="about-learning-title">
                            Learn From The <br /> Experts
                        </h1>
                        <button className="about-learning-button">Start Learning</button>
                    </div>
                    <div className="about-learning-image-container">
                        <img
                            src={openImage}
                            alt="Open Learning"
                            className="about-learning-image"
                        />
                    </div>
                </section>

                <section className="about-pride">
                    <h2 className="about-pride-title">
                        We Take Pride In The Tutoring Service We Provide
                    </h2>
                    <p className="about-pride-text">
                        Our dedicated team of expert tutors is committed to helping every
                        student succeed in their academic journey.
                    </p>
                </section>

                <section className="about-testimonials">
                    <div className="about-testimonials-header">
                        <h2 className="about-testimonials-title">
                            What People Are Saying About Us
                        </h2>
                        <p className="about-testimonials-subtitle">
                            Hear from our students and parents about their experiences with
                            Clarenest Online School.
                        </p>
                    </div>
                    <div className="about-testimonials-grid">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="about-testimonial">
                                <h4 className="about-testimonial-title">Great Platform</h4>
                                <div className="about-testimonial-divider"></div>
                                <p className="about-testimonial-text">
                                    Clarenest has transformed my learning experience. The tutors
                                    are knowledgeable and supportive, and the platform is easy to
                                    use.
                                </p>
                                <div className="about-testimonial-divider"></div>
                                <div className="about-testimonial-user">
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="about-testimonial-icon" 
                                    />
                                    <p className="about-testimonial-name">John Doe</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <ContactForm />
            <Footer />
        </div>
    );
}