import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faLinkedin, 
    faTwitter 
} from "@fortawesome/free-brands-svg-icons";
import '../css/Team.css';

export default function MeetTheTeam() {
    const [visibleSections, setVisibleSections] = useState(new Set());

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

    const managementTeam = [
        {
            name: "Franisca Chepkirui",
            role: "Principal",
            image: "/api/placeholder/300/300",
            bio: "20+ years in education leadership, focused on innovative learning methods",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "francisca Chepkirui",
            role: "Academic Director",
            image: "/api/placeholder/300/300",
            bio: "PhD in Education Technology, pioneering digital learning solutions",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Brian Kibet",
            role: "IT Head",
            image: "/api/placeholder/300/300",
            bio: "Dedicated to creating inclusive and supportive learning environments",
            linkedin: "#",
            twitter: "#"
        }
    ];

    const tutors = [
        {
            name: "Francisca Chepkirui",
            subject: "English Literature",
            image: "/api/placeholder/300/300",
            bio: "Specializes in making complex concepts accessible and engaging",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Prof. Emma Wilson",
            subject: "Sciences",
            image: "/api/placeholder/300/300",
            bio: "Research background in Physics with passion for practical learning",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Brian Kibet",
            subject: "Introductory Coding",
            image: "/api/placeholder/300/300",
            bio: "Published author with creative writing expertise",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Dr. Lisa Chen",
            subject: "Computer Science",
            image: "/api/placeholder/300/300",
            bio: "Industry veteran teaching modern programming concepts",
            linkedin: "#",
            twitter: "#"
        }
    ];

    const isSectionVisible = (sectionId) => visibleSections.has(sectionId);

    return (
        <div className="team-page">
            <Navbar />
            <div className="team-container">
                <section 
                    id="team-hero" 
                    className={`team-hero ${isSectionVisible('team-hero') ? 'visible' : ''}`}
                >
                    <div className="team-hero-content team-fade-up">
                        <h1 className="team-hero-title">Meet Our Team</h1>
                        <p className="team-hero-subtitle">
                            Dedicated professionals committed to educational excellence
                        </p>
                    </div>
                </section>

                <section 
                    id="management-team" 
                    className={`team-section ${isSectionVisible('management-team') ? 'visible' : ''}`}
                >
                    <h2 className="team-section-title team-fade-up">Management Team</h2>
                    <div className="team-grid">
                        {managementTeam.map((member, index) => (
                            <div 
                                key={index} 
                                className={`team-card team-fade-up team-delay-${index * 100}`}
                            >
                                <div className="team-card-image">
                                    <img src={member.image} alt={member.name} />
                                    <div className="team-social-links">
                                        <a href={member.linkedin} aria-label="LinkedIn Profile">
                                            <FontAwesomeIcon icon={faLinkedin} />
                                        </a>
                                        <a href={member.twitter} aria-label="Twitter Profile">
                                            <FontAwesomeIcon icon={faTwitter} />
                                        </a>
                                    </div>
                                </div>
                                <div className="team-card-content">
                                    <h3>{member.name}</h3>
                                    <h4>{member.role}</h4>
                                    <p>{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section 
                    id="tutors-team" 
                    className={`team-section ${isSectionVisible('tutors-team') ? 'visible' : ''}`}
                >
                    <h2 className="team-section-title team-fade-up">Our Expert Tutors</h2>
                    <div className="team-grid">
                        {tutors.map((tutor, index) => (
                            <div 
                                key={index} 
                                className={`team-card team-fade-up team-delay-${index * 100}`}
                            >
                                <div className="team-card-image">
                                    <img src={tutor.image} alt={tutor.name} />
                                    <div className="team-social-links">
                                        <a href={tutor.linkedin} aria-label="LinkedIn Profile">
                                            <FontAwesomeIcon icon={faLinkedin} />
                                        </a>
                                        <a href={tutor.twitter} aria-label="Twitter Profile">
                                            <FontAwesomeIcon icon={faTwitter} />
                                        </a>
                                    </div>
                                </div>
                                <div className="team-card-content">
                                    <h3>{tutor.name}</h3>
                                    <h4>{tutor.subject}</h4>
                                    <p>{tutor.bio}</p>
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