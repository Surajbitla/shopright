import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productData from './data.json'; // Ensure this path is correct
import Navbar from "../Navbar/Navbar";
import './Products.css';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); // This hook allows you to grab the id from the URL
  const [quantity, setQuantity] = useState(1);

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
        <button className="add-to-cart-button">Add to Cart</button>
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