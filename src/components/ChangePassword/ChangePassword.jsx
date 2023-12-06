import React, { useState } from 'react';
import './ChangePassword.css';
import Navbar from "../Navbar/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const email = sessionStorage.getItem('userEmail');
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

    // Toggle functions
    const toggleCurrentPasswordVisibility = () => setCurrentPasswordVisible(!currentPasswordVisible);
    const toggleNewPasswordVisibility = () => setNewPasswordVisible(!newPasswordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);


    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= 8 && hasUppercase && hasLowercase && hasSpecialChar;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!validatePassword(newPassword)) {
            setError("Password does not meet guidelines");
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/change-password`, {
                email: email, 
                currentPassword,
                newPassword
            });
    
            console.log('Response from server:', response.data);
            if (response.data.success) {
                console.log('Password changed successfully');
                setError(''); 
                setSuccessMessage('Password changed successfully! Redirecting to home...');
                
                // Redirect to home page after a delay
                setTimeout(() => {
                    navigate('/home');
                }, 3000);  // 3 seconds delay
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError("Error during password change. Please try again later.");
        }
        console.log('Password changed successfully');
    };

    return (
        <>
        <Navbar />
        <div className="signup-background">
                <div className="title">
                <h2>Change Your Password</h2>
                </div>
            </div>
        <div className="change-password-container">
            <p>Please follow the guidelines while setting your new password.</p>
            <ul>
                <li>Minimum password length - 8 characters.</li>
                <li>Requirement for a combination of uppercase and lowercase letters</li>
                <li>Requirement for at least one special character</li>
            </ul>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Current Password:</label>
                    <input type={currentPasswordVisible ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <button type="button" onClick={toggleCurrentPasswordVisibility} className="visibility-toggle">
                        {currentPasswordVisible ? "Hide" : "Show"}
                    </button>
                </div>
                <div className="input-group">
                    <label>New Password:</label>
                    <input type={newPasswordVisible ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button type="button" onClick={toggleNewPasswordVisibility} className="visibility-toggle">
                        {newPasswordVisible ? "Hide" : "Show"}
                    </button>
                </div>
                <div className="input-group">
                    <label>Confirm New Password:</label>
                    <input type={confirmPasswordVisible ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="visibility-toggle">
                        {confirmPasswordVisible ? "Hide" : "Show"}
                    </button>
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}    
                <button type="submit" className="submit-btn">Change Password</button>
            </form>
            {successMessage && <div className="success-message show" >{successMessage}</div>}
        </div>
        </>
    );
}

export default ChangePassword;
