// import React from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import '../css/Home.css'


// export default function Home() {
//     return(
//         <>
//         <Navbar/>
//         <section>
//             <h1>Getting Quality Is Now More Easy</h1>
//             <img src="" alt="" />
//         </section>
//         <section>
//             <h1>Who We Are</h1>
//             <p>Lorem Ipsum</p>
//         </section>
//         <section>
//             <h2>Where Pupils Grow And Learn</h2>
//             <p>lorem ipsum</p>
//             <img src="" alt="" />
//         </section>
//         <section>
//             <section>7 to 1 student ratio</section>
//             <section>500+ graduates</section>
//             <section>1000+ resources</section>
//             <section>100+ students</section>
//         </section>
//         <section>
//             <h3>Transformative Learning</h3>
//             <p>Lorem Ipsum</p>
//             <section>
//                 <h3>Excellence In Education</h3>
//                 <p>Lorem Ipsum</p>
//                 <button>Read More</button>
//             </section>
//             <section>
//                 <h3>Excellent Educators</h3>
//                 <p>Lorem Ipsum</p>
//                 <button>Read More</button>
//             </section>
//             <section>
//                 <h3>Comprehensive Monitoring</h3>
//                 <p>Lorem Ipsum</p>
//                 <button>Read More</button>
//                 </section>
//         </section>
//         <section>
//             <img src="" alt="" />
//             <section>
//             <p>Register Today</p>
//             <button>Register</button>
//             </section>
//         </section>
//         <section>
//             <h2>Upcoming Events</h2>
//             <section>
//                 <img src="" alt="" />
//                 <h3>Book Fair</h3>
//                 <p>Lorem Ipsum</p>
//             </section>
//             <section>
//             <img src="" alt="" />
//                 <h3>Talent Show</h3>
//                 <p>Lorem Ipsum</p>
//             </section>
//             <section>
//             <img src="" alt="" />
//                 <h3>Graduation Ceremony</h3>
//                 <p>Lorem Ipsum</p>
//             </section>
//         </section>
//         <section>
//             <h2>Get Our Neswletter Straight To Your Inbox</h2>
//             <input type="email" />
//         </section>
//         <Footer/>
//         </>
//     )
// }

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../css/Home.css';

export default function Home() {
    return(
        <>
        <Navbar/>
        <div className="home">
            <section className="hero">
                <h1>Getting Quality Education Is Now More Easy</h1>
            </section>

            <section className="about-section">
                <h2>Who We Are</h2>
                <p>Lorem Ipsum</p>
            </section>

            <section className="features-section">
                <h2>Where Pupils Grow And Learn</h2>
                <p>lorem ipsum</p>
                <img src="" alt="Students learning" />
            </section>

            <section className="stats-section">
                <div className="stat">
                    <p>7:1</p>
                    <p>student ratio</p>
                </div>
                <div className="stat">
                    <p>500+</p>
                    <p>graduates</p>
                </div>
                <div className="stat">
                    <p>1000+</p>
                    <p>resources</p>
                </div>
                <div className="stat">
                    <p>100+</p>
                    <p>students</p>
                </div>
            </section>

            <section className="features-section">
                <h2>Transformative Learning</h2>
                <p>Lorem Ipsum</p>
                <div className="feature">
                    <h3>Excellence In Education</h3>
                    <p>Lorem Ipsum</p>
                    <button>Read More</button>
                </div>
                <div className="feature">
                    <h3>Excellent Educators</h3>
                    <p>Lorem Ipsum</p>
                    <button>Read More</button>
                </div>
                <div className="feature">
                    <h3>Comprehensive Monitoring</h3>
                    <p>Lorem Ipsum</p>
                    <button>Read More</button>
                </div>
            </section>

            <section className="cta-section">
                <img src="" alt="School environment" />
                <div>
                    <p>Register Today</p>
                    <button>Register</button>
                </div>
            </section>

            <section className="events-section">
                <h2>Upcoming Events</h2>
                <div className="event">
                    <img src="" alt="Book Fair" />
                    <div>
                        <h3>Book Fair</h3>
                        <p>Lorem Ipsum</p>
                    </div>
                </div>
                <div className="event">
                    <img src="" alt="Talent Show" />
                    <div>
                        <h3>Talent Show</h3>
                        <p>Lorem Ipsum</p>
                    </div>
                </div>
                <div className="event">
                    <img src="" alt="Graduation Ceremony" />
                    <div>
                        <h3>Graduation Ceremony</h3>
                        <p>Lorem Ipsum</p>
                    </div>
                </div>
            </section>

            <section className="newsletter-section">
                <h2>Get Our Newsletter Straight To Your Inbox</h2>
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
            </section>
        </div>
        <Footer/>
        </>
    );
}