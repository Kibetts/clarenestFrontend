import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../css/Navbar.css';
import navImage from '../img/clarenest.png';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar">
            <div className="navbar-top-accent"></div>
            <nav className="navbar-container">
                <div className="navbar-brand">
                    <div className="navbar-logo-container">
                        <img 
                            className="navbar-logo"
                            src={navImage} 
                            alt="Clarenest School Logo" 
                        />
                    </div>
                    <div className="navbar-title-container">
                        <p className="navbar-title-main">Clarenest</p>
                        <p className="navbar-title-sub">School</p>
                    </div>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button 
                    className="navbar-mobile-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="navbar-links">
                        <li className="navbar-item">
                            <Link 
                                className="navbar-link" 
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link 
                                className="navbar-link" 
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link 
                                className="navbar-link" 
                                to="/contact-us"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link 
                                className="navbar-link" 
                                to="/team"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Our Team
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link 
                                className="navbar-link navbar-link-login" 
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log In
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}