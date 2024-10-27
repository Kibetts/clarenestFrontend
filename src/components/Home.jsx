import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../css/Home.css';

export default function Home() {
    useEffect(() => {
        const stats = [
            { selector: ".home-stat-number-1", endValue: 7 },
            { selector: ".home-stat-number-2", endValue: 500 },
            { selector: ".home-stat-number-3", endValue: 1000 },
            { selector: ".home-stat-number-4", endValue: 100 }
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

        stats.forEach((stat) => {
            const element = document.querySelector(stat.selector);
            if (element) animateCountUp(element, stat.endValue);
        });
    }, []);

    return (
        <div className="home">
            <Navbar />
            <div className="home-container">
                <section className="home-hero">
                    <h1 className="home-hero-title">Getting Quality Education Is Now More Easy</h1>
                </section>

                <section className="home-about">
                    <h2 className="home-about-title">Who We Are</h2>
                    <p className="home-about-text">Lorem Ipsum</p>
                </section>

                <section className="home-features">
                    <h2 className="home-features-title">Where Pupils Grow And Learn</h2>
                    <p className="home-features-text">lorem ipsum</p>
                    <img className="home-features-image" src="" alt="Students learning" />
                </section>

                <section className="home-stats">
                    <div className="home-stat-item">
                        <p className="home-stat-number-1">7</p>
                        <p className="home-stat-label">student ratio</p>
                    </div>
                    <div className="home-stat-item">
                        <p className="home-stat-number-2">500+</p>
                        <p className="home-stat-label">graduates</p>
                    </div>
                    <div className="home-stat-item">
                        <p className="home-stat-number-3">1000+</p>
                        <p className="home-stat-label">resources</p>
                    </div>
                    <div className="home-stat-item">
                        <p className="home-stat-number-4">100+</p>
                        <p className="home-stat-label">students</p>
                    </div>
                </section>

                <section className="home-transform">
                    <h2 className="home-transform-title">Transformative Learning</h2>
                    <p className="home-transform-text">Lorem Ipsum</p>
                    
                    <div className="home-transform-features">
                        <div className="home-transform-feature">
                            <h3 className="home-transform-feature-title">Excellence In Education</h3>
                            <p className="home-transform-feature-text">Lorem Ipsum</p>
                            <button className="home-transform-feature-button">Read More</button>
                        </div>
                        <div className="home-transform-feature">
                            <h3 className="home-transform-feature-title">Excellent Educators</h3>
                            <p className="home-transform-feature-text">Lorem Ipsum</p>
                            <button className="home-transform-feature-button">Read More</button>
                        </div>
                        <div className="home-transform-feature">
                            <h3 className="home-transform-feature-title">Comprehensive Monitoring</h3>
                            <p className="home-transform-feature-text">Lorem Ipsum</p>
                            <button className="home-transform-feature-button">Read More</button>
                        </div>
                    </div>
                </section>

                <section className="home-cta">
                    <img className="home-cta-image" src="" alt="School environment" />
                    <div className="home-cta-content">
                        <p className="home-cta-text">Register Today</p>
                        <button className="home-cta-button">Register</button>
                    </div>
                </section>

                <section className="home-events">
                    <h2 className="home-events-title">Upcoming Events</h2>
                    <div className="home-events-list">
                        <div className="home-event">
                            <img className="home-event-image" src="" alt="Book Fair" />
                            <div className="home-event-content">
                                <h3 className="home-event-title">Book Fair</h3>
                                <p className="home-event-text">Lorem Ipsum</p>
                            </div>
                        </div>
                        <div className="home-event">
                            <img className="home-event-image" src="" alt="Talent Show" />
                            <div className="home-event-content">
                                <h3 className="home-event-title">Talent Show</h3>
                                <p className="home-event-text">Lorem Ipsum</p>
                            </div>
                        </div>
                        <div className="home-event">
                            <img className="home-event-image" src="" alt="Graduation Ceremony" />
                            <div className="home-event-content">
                                <h3 className="home-event-title">Graduation Ceremony</h3>
                                <p className="home-event-text">Lorem Ipsum</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-newsletter">
                    <h2 className="home-newsletter-title">Get Our Newsletter Straight To Your Inbox</h2>
                    <div className="home-newsletter-form">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="home-newsletter-input"
                        />
                        <button className="home-newsletter-button">Subscribe</button>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}