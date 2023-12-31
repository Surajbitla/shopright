import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import UserContext from '../../UserContext';
import { useCart } from '../../components/ShoppingCart/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { cart } = useCart(); // use the useCart hook
  const userEmail = sessionStorage.getItem('userEmail');
  const localUserData = sessionStorage.getItem('user');
  const [showDropdown, setShowDropdown] = useState(false);
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Function to calculate the total number of items in the cart
  const getTotalItems = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  const handleLogout = () => {
    setUser(null);        // Clear the user state
    setIsLoggedIn(false); // Update the isLoggedIn state
    sessionStorage.setItem('userEmail', "");
    sessionStorage.setItem('user', '');
    navigate('/home');
    window.location.reload();
  };
  // Get the total items count
  const totalItems = getTotalItems(cart);

  return (
    <>
      <div className="main-page">
        <nav id="navbar">
          <h1 className="logo">
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
              Shop<span>Right</span>
            </Link>
          </h1>

          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {localUserData ? (
              <li onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                <Link to="#">Profile</Link>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile">My Account</Link>
                    <Link to="/order-history">Order History</Link>
                    <Link to="/change-password">Change Password</Link>
                    <Link to="#" onClick={handleLogout}>Logout</Link>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login">LogIn/SignUp</Link>
              </li>
            )}
            <li>
              <Link to="/customer-service">Customer Service</Link>
            </li>
            {/* Shopping Cart Icon with Item Count */}
            <li className="cart-icon">
              <Link to="/shopping-cart">
                <FontAwesomeIcon icon={faShoppingCart} />
                {totalItems > 0 && <span className="cart-item-count">{totalItems}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
