import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productData from './data.json'; // Ensure this path is correct
import Navbar from "../Navbar/Navbar";
import './Products.css';
import { useCart  } from '../ShoppingCart/CartContext';

function ProductDetails() {

  const [cartMessage, setCartMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); // This hook allows you to grab the id from the URL
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span className="star full-star" key={`full_${i}`}>★</span>);
      } else if (i - 1 < rating && i > rating) {
        stars.push(<span className="star half-star" key={`half_${i}`}>★</span>);
      } else {
        stars.push(<span className="star empty-star" key={`empty_${i}`}>★</span>);
      }
    }
    return stars;
  };
  useEffect(() => {
    // This function will be called when the component mounts and whenever the id changes
    const fetchProductDetails = () => {
      const product = productData.find(p => p.id.toString() === id);
      if (product) {
        setProduct(product);
      } else {
        setError('Product not found');
      }
    };

    fetchProductDetails();
  }, [id]); // The useEffect will re-run when the value of `id` changes

  // Function to handle quantity changes
  const handleQuantityChange = (event) => {
    const newQuantity = Math.max(1, parseInt(event.target.value, 10));
    setQuantity(newQuantity);
  };

  const handlePincodeChange = (e) => {
    setDeliveryPincode(e.target.value);
  };

  const checkDeliveryAvailability = () => {
    // Logic to check delivery availability
    console.log('Checking delivery for pincode:', deliveryPincode);
    // This would typically involve setting some state or alerting the user
  };
  const handleAddToCartClick = () => {
    addToCart(product, quantity);
    setCartMessage('Product added to cart successfully!');
    setIsMessageVisible(true);
  };

  useEffect(() => {
    let timer;
    if (isMessageVisible) {
      timer = setTimeout(() => {
        setIsMessageVisible(false);
      }, 3000); // Message will disappear after 3 seconds
    }
    return () => clearTimeout(timer); // Cleanup the timer
  }, [isMessageVisible]);


  if (error) {
    return <div className="product-error">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const imageUrl = `${process.env.PUBLIC_URL}/${product.image}`;

  return (
    <>
    <Navbar />
    <div className="product-details-container">
      <div className="product-image-section">
        <img src={imageUrl} alt={product.description} className="product-details-image" />
      </div>
      <div className="product-info-section">
        <h2 className="product-name">{product.description}</h2>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <div className="product-rating">
          {product.rating && renderStars(product.rating)}
        </div>
        <div className="product-quantity">
            <label htmlFor="quantity" className="quantity-label">Quantity:</label>
            <input
              type="number"
              id="quantity"
              className="quantity-input"
              value={quantity}
              onChange={handleQuantityChange}
              min="1" // The minimum quantity should be 1
              step="1" // The steps for the quantity field
            />
          </div>
          <div className="delivery-pincode-wrapper">
            <input
              type="text"
              placeholder="Enter delivery pincode"
              value={deliveryPincode}
              onChange={handlePincodeChange}
              className="pincode-input"
            />
            <button onClick={checkDeliveryAvailability} className="check-pincode-button">
              Check
            </button>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCartClick}>
          Add to Cart
        </button>
        <div className={`cart-message ${isMessageVisible ? 'cart-message-visible' : ''}`}>
        {cartMessage}
      </div>
        <p className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Vestibulum feugiat mi eget elit elementum, id pulvinar tellus eleifend.
        Integer porttitor elit id euismod elementum. Nulla vel molestie massa, eget iaculis elit. 
        Quisque a tortor vel lectus ultricies pretium quis non purus. Pellentesque molestie leo eget rutrum tristique.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>

    </>
  );
}

export default ProductDetails;