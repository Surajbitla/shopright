import React, { useState } from 'react';
import './index.css';
import Navbar from "../Navbar";
import { Link, useNavigate  } from 'react-router-dom'; 

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    const [errors, setErrors] = useState({});

    const validateEmail = email => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = phoneNumber => {
        const plainNumber = phoneNumber.replace(/-/g, '');
        return /^\d{10}$/.test(plainNumber);
    };
    
    const formatPhoneNumber = number => {
        const plainNumber = number.replace(/-/g, ''); 
        if (validatePhoneNumber(plainNumber)) {
            return plainNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        return number;
    };
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));

        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    setErrors(prevErrors => ({ ...prevErrors, email: 'Please enter a valid email' }));
                } else {
                    setErrors(prevErrors => {
                        const { email, ...rest } = prevErrors;
                        return rest;
                    });
                }
                break;
            case 'phoneNumber':
                if (!validatePhoneNumber(value)) {
                    setErrors(prevErrors => ({ ...prevErrors, phoneNumber: 'Please enter a valid phone number' }));
                } else {
                    setErrors(prevErrors => {
                        const { phoneNumber, ...rest } = prevErrors;
                        return rest;
                    });
                }
                break;
            default:
                break;
        }
    };

    const handlePhoneBlur = () => {
        const formattedPhone = formatPhoneNumber(formData.phoneNumber);
        setFormData(prevState => ({ ...prevState, phoneNumber: formattedPhone }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/email-notification');  // Use navigate instead of history.push
    };

    const isFormValid = () => {
        return Object.values(formData).every(value => value !== '') && Object.keys(errors).length === 0;
    };

    return (
        <>
            <Navbar />
            <div className="signup-background">
                <div className="title">
                    <h2>SignUp</h2>
                </div>
            </div>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="welcome">
                        <h2>Shopping starts here 🚀</h2>
                        <p>Make your profile management easy and fun!</p>
                    </div>
                    <div className="input-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} onBlur={handlePhoneBlur} required />
                        {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                    </div>
                    <div className="signup-actions">
                        <button type="submit" className="signup-btn" disabled={!isFormValid()}>Signup</button>
                    </div>
                    <div className="register-option">
                        Already have an account? <Link to="/login">Sign in instead</Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Signup;
