import React, { useState } from 'react';
import './CustomerService.css';
import Navbar from "../Navbar/Navbar";

const CustomerService = () => {
    const [submitted, setSubmitted] = useState(false);
    const [previouslySubmitted, setPreviouslySubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!previouslySubmitted) {
            setPreviouslySubmitted(true);
        }
        setSubmitted(true);
    }
    const handleAnotherRequest = () => {
        setSubmitted(false);
    }
    return (
        <>
            <Navbar />
            <div className="signup-background">
                <div className="title">
                    <h2>Customer Service</h2>
                </div>
            </div>
            <div className="customer-service-container">

                <div className="contact-section">
                    <div className="block">
                        <i className="call-icon">📞</i>
                        <span className="call-number">1-800-123-4567</span>
                        <div>Call us for support</div>
                    </div>

                    <div className="block">
                        <i className="email-icon">📧</i>
                        <span className="email-id">support@shopright.com</span>
                        <div>Email us your queries</div>
                    </div>
                </div>
                {previouslySubmitted && !submitted && (
                    <div className="warning-message">
                        You've already created a ticket before. Please ensure you're not submitting the same request multiple times.
                        If this is about something else, you can continue.
                    </div>
                )}
                {submitted && (
                    <div className="thank-you-section">
                        <div className="thank-you-message">
                            Thank you for reaching out! We will get back to you as soon as possible.
                        </div>
                        <button className="another-request-btn" onClick={handleAnotherRequest}>
                            Submit Another Request
                        </button>
                    </div>
                )}
                {!submitted && (
                    <div className="form-section">
                        <h3 class="form-heading">Fill out the form and we’ll be in touch as soon as possible.</h3>
                        <form className="email-form" onSubmit={handleSubmit} >
                            <input type="text" placeholder="Your Name" required />
                            <input type="email" placeholder="Your Gmail Address" required />
                            <textarea placeholder="How can we help?" required></textarea>
                            <button type="submit">Submit Request</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default CustomerService;
