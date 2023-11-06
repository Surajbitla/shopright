import React, { useState ,useContext} from 'react';
import './Login.css';
import Navbar from "../Navbar/Navbar";
import { Link, useNavigate  } from 'react-router-dom'; 
import UserContext from '../../UserContext';
import axios from 'axios';
import config from '../../config';

function LoginPage() {
    const navigate = useNavigate();
    console.log(config); // Log the entire config object
    console.log(config[process.env.NODE_ENV].apiUrl); // Log the apiUrl property

    const [passwordVisible, setPasswordVisible] = useState(false);
    const { setIsLoggedIn } = useContext(UserContext);
    const [errorMessageLogin, setErrorMessageLogin] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const response = await axios.post(`${config[process.env.NODE_ENV].apiUrl}/login`, { email, password });
            console.log(response);
            if (response.data.message === 'Logged in successfully') {
                setIsLoggedIn(true);
                localStorage.setItem('userEmail', email);
                if (response.data.isTempPassword) {
                    navigate('/change-password');
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response && error.response.data) {
                // If the server sent a specific error message, use that
                setErrorMessageLogin(error.response.data);
            } else {
                // Otherwise, use the generic error message
                setErrorMessageLogin('Error during login. Please try again later.');
            }
        }
        
    };


    return (
        <>
        <Navbar />
        <div className="login-background">
        <div className="title">
          <h2>LogIn</h2>
        </div>
      </div>
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
            <div className="welcome"><h2>Welcome to Shop<span>Right</span> 👋🏻</h2>
            <p>Please Login to your account and start shopping</p>
            </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type={passwordVisible ? "text" : "password"} id="password" required />
                    <button type="button" onClick={togglePasswordVisibility} className="visibility-toggle">
                        {passwordVisible ? "Hide" : "Show"}
                    </button>
                </div>
                <div className="forgot-div"><Link to="/forgot-password">Forgot password?</Link></div>
                {errorMessageLogin && <div className="error-message-login">{errorMessageLogin}</div>}
                <div className="login-actions">
                    <button type="submit" className="login-btn">Login</button>
                </div>

                <div className="register-option">
                    Don't have an account? <Link to="/signup">  Create a new account</Link>
                </div>
            </form>
        </div>
        </>
    );
}

export default LoginPage;
