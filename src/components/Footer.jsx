import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import '../css/Footer.css'

export default function Footer() {
    return(
        <>
        <div className="footer-container">
        <div className="footer-info">
            <div className="footer-contacts">
                <p>Clarenest Online School</p>
                <p>clarenestschool@outlool.com</p>
                <p>+254 720 944 056</p>
            </div>
            <div className="footer-links">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/signin">Sign In</Link></li>
                </ul>
            </div>
        </div>
        
        <div className="footer-socials">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                </div>
        <div className="footer-pink-line"></div>
        <div className="all-rights">All Rights Reserves 2024</div>
        <div className="footer-big-pink"></div>
        </div>
        </>
    )
}