import React, { useState } from 'react';
import './ForgotPassword.css';
import Navbar from "../Navbar";
import { Link, useNavigate  } from 'react-router-dom'; 


function ForgotPassword() {
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Password changed successfully');
        navigate('/email-notification');  // Use navigate instead of history.push

    };


    return (
        <>
        <Navbar />
        <div className="signup-background">
                <div className="title">
                <h2>Forgot Your Password</h2>
                </div>
            </div>
        {/* <div className="forgot-password-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Please enter your Email address to receive a temporary password:</label>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required />
                </div>
                <button type="submit">Get Temporary Password</button>
            </form>
        </div> */}

        
        <div className="forgot-container">
            <form className="forgot-form" onSubmit={handleSubmit}>
            
                <div className="input-group">
                    <label>Please enter your Email address to receive a temporary password:</label>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required />
                </div>
                <div className="forgot-actions">
                    <button type="submit" className="forgot-btn">Get Temporary Password</button>
                </div>
            </form>
        </div>

        </>
    );
}

export default ForgotPassword;
