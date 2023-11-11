import React, { useContext } from 'react';
import { Link, useNavigate  } from 'react-router-dom'; 
import './Profile.css';
import Navbar from "../Navbar/Navbar";
import UserContext from '../../UserContext';


const Profile = () => {
    const navigate = useNavigate();
    const { setUser, setIsLoggedIn } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);        // Clear the user state
        setIsLoggedIn(false); // Update the isLoggedIn state
        sessionStorage.setItem('userEmail', "");
        sessionStorage.setItem('user','');
        navigate('/home');
        window.location.reload();
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
