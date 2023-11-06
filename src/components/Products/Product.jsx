import React from 'react';
import { Link } from "react-router-dom";
import './Products.css'; // Assuming you have a separate CSS file for Product

function Product({ id, image, description, price, rating }) {
  const imageUrl = `${process.env.PUBLIC_URL}/${image}`;

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span className="star full-star" key={i}>★</span>);
      } else if (i - 1 < rating && i > rating) {
        stars.push(<span className="star half-star" key={i}>★</span>);
      } else {
        stars.push(<span className="star empty-star" key={i}>★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product">

    <Link to={`/product/${id}`} className="product-link" style={{ textDecoration: 'none' }}>
      <img src={imageUrl} alt="Product" />
      <div className="product-details">
        <p>{description}</p>
        <div className="product-rating">
          {renderStars(rating)}
        </div>
        <p className="price">${price}</p>
      </div>
    </Link>
    </div>

  );
}

export default Product;
