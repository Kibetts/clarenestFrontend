import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactForm from "./Contactform"
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
import '../css/About.css'

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="professional-instructors-container">
          <div>
            <p className="professional-heading">
              PROFESSIONAL
              <br /> INSTRUCTORS YOU
              <br /> CAN TRUST
            </p>
          </div>
        </div>
        <div className="mission-container">
          <div>
            <img
              className="mission-image"
              src={missionImage}
              alt="Our Mission"
            />
          </div>
          <div>
            <h3 className="mission-h3">OUR MISSION</h3>
            <p>
              To provide high-quality online education that empowers students to
              achieve their full potential through personalized learning
              experiences, innovative teaching methods, and a supportive
              community.
            </p>
          </div>
        </div>
        <div className="vision-container">
          <div>
            <h3 className="vision-h3">OUR VISION</h3>
            <p>
              To be the leading online educational platform that transforms
              lives through accessible, engaging, and effective learning
              opportunities for students worldwide.
            </p>
          </div>
          <div>
            <img className="vision-image" src={visionImage} alt="Our Vision" />
          </div>
        </div>
        <div className="tutor-services-container">
          <h1 className="tutoring-services-heading">
            Tutoring Services We Provide
          </h1>
          <div className="services-container">
            <div className="service">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="service-icon"
              />
              <h3 className="service-name">Detailed Assessment</h3>
              <div className="service-container-line"></div>
              <p className="service-info">
                Comprehensive evaluation of student skills and knowledge to
                create personalized learning plans.
              </p>
            </div>
            <div className="service">
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                className="service-icon"
              />
              <h3 className="service-name">One-on-One Tutoring</h3>
              <div className="service-container-line"></div>
              <p className="service-info">
                Individualized instruction tailored to each student's unique
                learning needs and goals.
              </p>
            </div>
            <div className="service">
              <FontAwesomeIcon icon={faFileAlt} className="service-icon" />
              <h3 className="service-name">Test Preparation</h3>
              <div className="service-container-line"></div>
              <p className="service-info">
                Targeted strategies and practice for standardized tests and
                subject-specific exams.
              </p>
            </div>
          </div>
        </div>
        <div className="open-learning-container">
          <div>
            <div className="open-p-div">
              <p className="open-p">Open Learning For Everyone</p>
            </div>
            <div>
              <h1 className="learn-experts">
                Learn From The <br /> Experts
              </h1>
            </div>
            <div>
              <button className="start-learning-btn">Start Learning</button>
            </div>
          </div>
          <div>
            <img
              src={openImage}
              alt="Open Learning"
              className="open-learning-image"
            />
          </div>
        </div>
        <div className="pride-section">
          <h2>We Take Pride In The Tutoring Service We Provide</h2>
          <p>
            Our dedicated team of expert tutors is committed to helping every
            student succeed in their academic journey.
          </p>
        </div>
        <div className="testimonials-section">
          <div>
            <h2>What People Are Saying About Us</h2>
            <p>
              Hear from our students and parents about their experiences with
              Clarenest Online School.
            </p>
          </div>
          <div className="testimonials-cards">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="testimonial-card">
                <h4>Great Platform</h4>
                <div className="testimonial-line"></div>
                <p>
                  Clarenest has transformed my learning experience. The tutors
                  are knowledgeable and supportive, and the platform is easy to
                  use.
                </p>
                <div className="testimonial-line"></div>
                <div className="testimonial-user">
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                  <p>John Doe</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ContactForm />
      <Footer />
    </>
  );
}
