import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import UserContext from '../../UserContext';
import { useCart } from '../../components/ShoppingCart/CartContext'; // Update the path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { cart } = useCart(); // use the useCart hook
  const userEmail = sessionStorage.getItem('userEmail');
  // Function to calculate the total number of items in the cart
  const getTotalItems = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get the total items count
  const totalItems = getTotalItems(cart);

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
            {isLoggedIn || userEmail!=='' ? (
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
