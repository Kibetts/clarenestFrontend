import React from "react";
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import navImage from '../img/clarenest.png';

export default function Navbar() {
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

                <div className="navbar-menu">
                    <ul className="navbar-links">
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/">Home</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/about">About</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/contact-us">Contact Us</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="navbar-link navbar-link-login" to="/login">Log In</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}