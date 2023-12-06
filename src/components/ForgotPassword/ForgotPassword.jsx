import React, { useState } from 'react';
import './ForgotPassword.css';
import Navbar from "../Navbar/Navbar";
import { Link, useNavigate  } from 'react-router-dom'; 
import axios from 'axios';
import config from '../../config';


function ForgotPassword() {
    
    const navigate = useNavigate();
    const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

    const [formData, setFormData] = useState({ email: '' });
    const [errors, setErrors] = useState({});

    const validateEmail = email => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));

        if (name === 'email') {
            if (!validateEmail(value)) {
                setErrors(prevErrors => ({ ...prevErrors, email: 'Please enter a valid email' }));
            } else {
                setErrors(prevErrors => {
                    const { email, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email } = formData;
        console.log(email);
        try {
            const response = await axios.post(`${apiUrl}/forgot-password`, { email });
            console.log('Forgot password response:', response.data);
            navigate('/email-notification'); 
    
        } catch (error) {
            console.error('Error in password reset:', error);
        }
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
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    {errors.email && <div className="error-message">{errors.email}</div>}
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
