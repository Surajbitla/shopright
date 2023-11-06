import React, { useState, useEffect } from 'react';
import './AutoScrollProducts.css'; // Ensure you have this CSS file created

function AutoScrollProducts({ products }) {
    const [index, setIndex] = useState(0);
    const scrollInterval = 5000; // 5 seconds
    const appleProducts = products.filter(product =>
        product.description.toLowerCase().includes("apple")
    );
    const imageUrl = `${process.env.PUBLIC_URL}/${'images/apple.png'}`;

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % appleProducts.length);
        }, scrollInterval);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [appleProducts.length]);

    // Calculate the product to display
    const productToDisplay = appleProducts[index];

    return (
        <div className="auto-scroll-container">
            <div className="special-deals-banner">
                <div className="special-deals-content">
                    <h2>🌟 Exclusive Apple Deals 🌟</h2>
                    <p>Grab your favorite Apple products at unbeatable prices! Limited stock available.</p>
                    <img
                        src={imageUrl}
                        alt="Shop Now"
                        className="shop-now-img"
                        onClick={() => {/* function to navigate to the deals page */ }}
                    />
                </div>
            </div>

            <div className="scroll-product-item">
                <img src={`${process.env.PUBLIC_URL}/${productToDisplay.image}`} alt={productToDisplay.description} className="scroll-product-image" />
                <div className="scroll-product-details">
                    <h3>{productToDisplay.description}</h3>
                    <p className="price">${productToDisplay.price.toFixed(2)}</p>
                    <p className="offer">Limited time offer</p>
                    {/* <button className="buy-now-btn">Buy Now</button> */}
                </div>
            </div>
        </div>
    );
}

export default AutoScrollProducts;
