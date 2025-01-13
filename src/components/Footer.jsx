import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import '../css/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-info">
                        <div className="footer-contact">
                            <h3 className="footer-brand">Clarenest International School</h3>
                            <p className="footer-email">clarenestschool@outlook.com</p>
                            <p className="footer-phone">+254 720 944 056</p>
                        </div>
                        <nav className="footer-nav">
                            <ul className="footer-links">
                                <li className="footer-item">
                                    <Link className="footer-link" to="/">Home</Link>
                                </li>
                                <li className="footer-item">
                                    <Link className="footer-link" to="/about">About</Link>
                                </li>
                                <li className="footer-item">
                                    <Link className="footer-link" to="/signin">Sign In</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    
                    <div className="footer-social">
                        <a 
                            href="https://facebook.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-social-link"
                        >
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-social-link"
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-social-link"
                        >
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="footer-accent"></div>
                    <p className="footer-copyright">All Rights Reserved 2024</p>
                    {/* <div className="footer-accent-large"></div> */}
                </div>
            </div>
        </footer>
    );
}