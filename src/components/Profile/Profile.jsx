import React, { useContext } from 'react';
import UserContext from '../../UserContext';
import { Link, useNavigate  } from 'react-router-dom'; 
import './Profile.css';
import Navbar from "../Navbar";


const Profile = () => {
    const navigate = useNavigate();

    const { setIsLoggedIn } = useContext(UserContext);

    const handleLogout = () => {
        // Here you can also clear any user-related data or tokens you've stored
        setIsLoggedIn(false);
        navigate('/home');
    };

    return (
        <>
        <Navbar />
        <div className="signup-background">
                <div className="title">
                <h2>Profile</h2>
                </div>
            </div>
        <div className="profile-container">
            <div className="profile-option">
                <Link to="/change-password">Change Password</Link>
            </div>
            <div className="profile-option">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
        </>
    );
}

export default Profile;
