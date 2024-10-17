import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactForm from "./Contactform";

export default function Home() {
    return(
        <>
        <Navbar/>
        <div>
        <div>
            <p>PROFESSIONAL INSTRUCTORS YOU CAN TRUST</p>
        </div>
        <div>
            <div className="mission-container">
                <img src="" alt="" />
            </div>
            <div>
                <h3>OUR MISSION</h3>
                <p>Lorem Ipsum</p>
            </div>
        </div>
        <div className="vision-container">
            <div>
                <h3>OUR VISION</h3>
                <p>Lorem Ipsum</p>
            </div>
            <div>
                <img src="" alt="" />
            </div>
        </div>
        <div>
            <h1>Tutoring Services We Provide</h1>
            <div className="services-container">
                <div>
                    <p>icon</p>
                    <h3>Detailed Assessment</h3>
                    <div className="service-container-line"></div>
                    <p>Lorem Ipsum</p>
                </div>
                <div>
                    <p>icon</p>
                    <h3>Tutoring</h3>
                    <div className="service-container-line"></div>
                    <p>Lorem Ipsum</p>
                </div>
                <div>
                    <p>icon</p>
                    <h3>Test Prep</h3>
                    <div className="service-container-line"></div>
                    <p>Lorem Ipsum</p>
                </div>
            </div>
        </div>
        <div>
            <div>
            <div><p>Open Learning For Everone</p></div>
            <div><h3>Learn From The Experts</h3></div>
            <div><p>Start Learning</p></div>
            </div>
            <div><img src="" alt="" /></div>
        </div>
        <div>
            <div><h2>We Take Pride In The Tutoring Service We Provide</h2></div>
            <div><p>Lorem Ipsum</p></div>
        </div>
        <div className="testimonials-section">
            <div >
                <h2>What People Are Saying About Us</h2>
                <p>Lorem Ipsum</p>
            </div>
            <div className="testimonials-cards">
                <div>
                    <h4>Great Platform</h4>
                    <div className="testimonial-line"></div>
                    <p>Lorem Ipsum</p>
                    <div className="testimonial-line"></div>
                    <div>
                        <p>user icon</p>
                        <h4>user name</h4>
                    </div>
                </div>
                <div>
                <h4>Great Platform</h4>
                    <div className="testimonial-line"></div>
                    <p>Lorem Ipsum</p>
                    <div className="testimonial-line"></div>
                    <div>
                        <p>user icon</p>
                        <h4>user name</h4>
                    </div>
                </div>
                <div>
                <h4>Great Platform</h4>
                    <div className="testimonial-line"></div>
                    <p>Lorem Ipsum</p>
                    <div className="testimonial-line"></div>
                    <div>
                        <p>user icon</p>
                        <h4>user name</h4>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <ContactForm/>
        <Footer/>
        </>
    )
}