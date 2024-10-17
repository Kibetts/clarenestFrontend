import React from "react";
import { Link } from 'react-router-dom';

export default function Navbar() {
    return(
        <header>
            <nav className="nav-items">
                <img 
                src="../public/img/clarenestLogo.png" 
                alt="navImage" 
                />
                <p>Clarenest School</p>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/signin">Sign In</Link></li>
                </ul>
            </nav>
        </header>
    )
}