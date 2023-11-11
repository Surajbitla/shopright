// src/components/ShoppingCart/ShoppingCart.js

import React, { useState } from 'react';
import './ShoppingCart.css';
import Navbar from "../Navbar/Navbar";
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';


const ShoppingCart = () => {
    // Use the useCart hook instead of local state
    const { cart, removeFromCart, updateQuantity, applyCoupon, clearCart, totalPrice } = useCart();
    const [coupon, setCoupon] = useState('');
    let navigate = useNavigate();

    // Handle coupon input change
    const handleCouponChange = (e) => {
        setCoupon(e.target.value);
    };

    // Apply the coupon code
    const handleApplyCoupon = () => {
        applyCoupon(coupon); // Apply coupon logic from context
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };
    const handleloginaccount = () => {
        navigate('/login');
    };

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="shopping-cart-empty">
                    <h2>Shopping Cart</h2>
                    <p>Your cart is empty!</p>
                    <button onClick={handleContinueShopping}>CONTINUE SHOPPING</button> 
                </div>
                <div className="shopping-cart-empty"><button onClick={handleloginaccount}>Sign in to your account</button></div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="shopping-cart-container">
            <div className="cart-and-summary">
            <div className="cart-table">

                <table>
                    <thead>
                        <tr>
                            <th>PRODUCT</th>
                            <th>DESCRIPTION</th>
                            <th>PRICE</th>
                            <th>QUANTITY</th>
                            <th>TOTAL</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.image} alt={product.name} className="cart-product-image" />
                                </td>
                                <td>{product.description}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>
                                    <div className="quantity-input">
                                        <button className="decrement" onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}>-</button>
                                        <input
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value, 10)))}
                                            min="1"
                                        />
                                        <button className="increment" onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</button>
                                    </div>

                                </td>

                                <td>${(product.price * product.quantity).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => removeFromCart(product.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <div className="order-summary">
                    <h3>Order summary</h3>
                    <p>Sub total: ${totalPrice.toFixed(2)}</p>
                    <p>Total (Inclusive of tax $0.00): ${totalPrice.toFixed(2)}</p>
                    <button onClick={() => console.log('Proceed to checkout')}>CHECKOUT</button>
                </div>
            </div>
                <div className="coupon-section">
                    <p>Promotion code?</p>
                    <input
                        type="text"
                        value={coupon}
                        onChange={handleCouponChange}
                        placeholder="Enter coupon code"
                    />
                    <button onClick={handleApplyCoupon}>Apply</button>
                    <button className="clearCart" onClick={clearCart}>Clear Cart</button>
                </div>
                
            </div>
        </>
    );
};

export default ShoppingCart;
