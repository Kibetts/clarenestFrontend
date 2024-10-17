import React from "react";
import { Link } from 'react-router-dom';
import '../All.css'

export default function Footer() {
    return(
        <>
        <div class="footer-container">
        <div class="footer-info">
            <div>
                <p>Clarenest Online School</p>
                <p>clarenestschool@outlool.com</p>
                <p>+254 720 944 056</p>
            </div>
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/signin">Sign In</Link></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-socials">
            <a href="facebook.com">fb</a>
            <a href="instagram.com">ig</a>
            <a href="twitter.com">X</a>
        </div>
        <div class="footer-pink-line"></div>
        <div>All Rights Reserves 2024</div>
        <div class="footer-big-pink"></div>
        </div>
        </>
    )
}