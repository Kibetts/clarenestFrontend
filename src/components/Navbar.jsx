import React from "react";
import { Link } from 'react-router-dom';
import '../css/Navbar.css'
import navImage from '../img/clarenest.png'

export default function Navbar() {
    return(
        <header>
            <div className="nav-pink"></div>
            <nav className="nav-items">
                <div className="image-school-name">
                <div>
                <img className="navimage"
                src={navImage} 
                alt="navImage" 
                />
                </div>
                <div className="school-title">
                <p className="top-school-title">Clarenest</p>
                <p className="bottom-school-title"> School</p>
                </div>
                </div>

                <div className="nav-list">
                <ul >
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/login">Log In</Link></li>
                </ul>
                </div>
            </nav>
        </header>
    )
}