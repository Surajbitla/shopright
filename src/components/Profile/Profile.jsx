import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Profile.css';
import Navbar from "../Navbar/Navbar";
import MyDetails from './MyDetails'; // Import your component
import MyAddresses from './MyAddresses'; // Import your component
import MyPayments from './MyPayments'; // Import your component


const Profile = () => {

    const [selectedOption, setSelectedOption] = useState('details');


    // Render the appropriate component based on the selected option
    const renderOption = () => {
        switch(selectedOption) {
            case 'details':
                return <MyDetails />;
            case 'addresses':
                return <MyAddresses />;
            case 'payments':
                return <MyPayments />;
            default:
                return <MyDetails />;
        }
    };

    return (
        <>
            <Navbar />
            <div className="signup-background">
                <div className="title">
                <h2>My Account</h2>
                </div>
            </div>
            <div className="profile-layout">
                <div className="profile-sidebar">
                    <Link to="#" onClick={() => setSelectedOption('details')}>My Details</Link>
                    <Link to="#" onClick={() => setSelectedOption('addresses')}>My Addresses</Link>
                    <Link to="#" onClick={() => setSelectedOption('payments')}>My Payments</Link>
                </div>
                <div className="profile-content">
                    {renderOption()}
                </div>
            </div>
        </>
    );
}

export default Profile;
