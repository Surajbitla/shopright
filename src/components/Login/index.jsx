import React, { useState ,useContext} from 'react';
import './index.css';
import Navbar from "../Navbar";
import { Link, useNavigate  } from 'react-router-dom'; 
import UserContext from '../../UserContext';



function LoginPage() {
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const { setIsLoggedIn } = useContext(UserContext);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
        navigate('/home');
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
