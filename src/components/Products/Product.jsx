function Product({ image, description, price }) {
    const imageUrl = `${process.env.PUBLIC_URL}/${image}`;
    return (
      <div className="product">
        <img src={imageUrl} alt="Product" />
        <div className="product-details">
          <p>{description}</p>
          <p className="price">${price}</p>
        </div>
      </div>
    );
  }
  
  export default Product;
  