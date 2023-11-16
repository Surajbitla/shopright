// MyDetails.js
import React, { useState, useEffect } from 'react';
import './MyDetails.css';
const imageUrl = `${process.env.PUBLIC_URL}/${'images/profile.png'}`;

const MyDetails = () => {
    // Sample user data, replace with actual user data
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: 'Male', // Editable
        dateOfBirth: '', // Editable
    });

    // State for editable fields
    const [editableFields, setEditableFields] = useState({
        gender: 'Male',
        dateOfBirth: '',
    });

    // Function to handle changes in editable fields
    const handleFieldChange = (fieldName, value) => {
        setEditableFields({ ...editableFields, [fieldName]: value });
    };

    // Function to handle save button click
    const handleSave = () => {
        // Perform API call to save editable fields
        // Update userData with the new values
        // Reset editableFields state
        // Example:
        // updateUserData({ gender: editableFields.gender, dateOfBirth: editableFields.dateOfBirth });
        // setEditableFields({ gender: userData.gender, dateOfBirth: userData.dateOfBirth });
    };

    // Load user data from local storage on component mount
    useEffect(() => {
        const storedUserData = JSON.parse(sessionStorage.getItem('user'));
        console.log(storedUserData);
        if (storedUserData) {
            setUserData(storedUserData);
            setEditableFields({
                gender: storedUserData.gender || 'Male',
                dateOfBirth: storedUserData.dateOfBirth || '',
            });
        }
    }, []);

    return (
        <div className="my-details-container">
            <div className="user-profile">
                <img src={imageUrl} alt="User Profile" className="profile-image" />
                <p className="user-name">{userData.firstName} {userData.lastName}</p>
            </div>
            <div className="details-content">
                <div className="form-container">
                    <div className="form-row">
                        <label className="form-label">First Name:</label>
                        <input type="text" className="form-input" value={userData.firstName} disabled />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Last Name:</label>
                        <input type="text" className="form-input" value={userData.lastName} disabled />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Email:</label>
                        <input type="text" className="form-input" value={userData.email} disabled />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Phone Number:</label>
                        <input type="text" className="form-input" value={userData.phoneNumber} disabled />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Gender:</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={editableFields.gender === 'Male'}
                                    onChange={() => handleFieldChange('gender', 'Male')}
                                />
                                Male
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={editableFields.gender === 'Female'}
                                    onChange={() => handleFieldChange('gender', 'Female')}
                                />
                                Female
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <label className="form-label">Date of Birth:</label>
                        <input
                            type="date"
                            className="form-input"
                            value={editableFields.dateOfBirth}
                            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                        />
                    </div>
                    <button className="edit-button" onClick={handleSave}>Save</button>
                </div>
                <div className="profile-summary">
                    <h4>Profile Summary</h4>
                    <div className="profile-completeness">
                        <label>Profile Completeness:</label>
                        <progress value="50" max="100"></progress> {/* Example value */}
                    </div>
                    <div className="recent-activity">
                        <label>Recent Activity:</label>
                        <p>Last login: 2 days ago</p> {/* Example data */}
                        {/* Add other activities as needed */}
                    </div>
                    <div className="tips">
                        <label>Tips:</label>
                        <ul>
                            <li>Complete your profile for a better experience.</li>
                            <li>Check out the new features in the settings.</li>
                            {/* Add more tips as needed */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDetails;
