import React from 'react';
import './EmailNotification.css';  // Assuming you keep styles in a separate CSS file
import { Link } from 'react-router-dom';
import gmailIcon from '../../Assets/images/Gmail-Logo.png';  // Adjust the path accordingly


function EmailNotification() {
    
    const gmailUrl = `${process.env.PUBLIC_URL}/${'images/Gmail.Logo.png'}`;
    return (
        <div className="notification-container">
            <div className="gmail-icon">
                <img src={gmailUrl} alt="Gmail Icon" />
            </div>
            
            <h2>Email Sent!</h2>
            <p>We've sent an email to your registered address containing the temporary password. Please check your inbox.</p>
            
            <Link to="/login" className="back-to-login">Back to Login</Link>
        </div>
    );
}

export default EmailNotification;
