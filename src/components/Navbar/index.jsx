import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import UserContext from '../../UserContext';

const Navbar = () => {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <>
      <div className="main-page">
        <nav id="navbar">
          <h1 className="logo">
            Shop<span>Right</span>
          </h1>

          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {isLoggedIn ? (
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                        ) : (
                            <li>
                                <Link to="/login">LogIn/SignUp</Link>
                            </li>
                        )}
            <li>
              <Link to="/customer-service">Customer Service</Link>
            </li>
            {/* <li>
              <Link to="/saved-job">Saved Job</Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
