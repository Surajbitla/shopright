import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import UserContext from '../../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


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
            {/* Shopping Cart Icon */}
            <li>
              <Link to="/shopping-cart">
                <FontAwesomeIcon icon={faShoppingCart} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
