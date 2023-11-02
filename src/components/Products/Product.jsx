function Product({ image, description, price }) {
    return (
      <div className="product">
        <img src={image} alt="Product" />
        <div className="product-details">
          <p>{description}</p>
          <p className="price">${price}</p>
        </div>
      </div>
    );
  }
  
  export default Product;
  