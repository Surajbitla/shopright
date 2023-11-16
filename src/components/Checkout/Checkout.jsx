// src/components/Checkout/Checkout.js
import React, { useState, useEffect } from 'react';
import './Checkout.css'; // Ensure your CSS file is correctly linked
import MyAddresses from '../Profile/MyAddresses';
import MyPayments from '../Profile/MyPayments';
import Navbar from "../Navbar/Navbar";
import { useCart } from '../ShoppingCart/CartContext';
import axios from 'axios';
import config from '../../config';


const Checkout = () => {
    const { cart, totalPrice, tax, totalIncludingTax } = useCart(); // Use the hook to get cart details
    const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressList, setShowAddressList] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentList, setShowPaymentList] = useState(false);


    const handleAddressChange = async (address) => {
        // Update the selected address
        setSelectedAddress(address);
        setShowAddressList(false);

        // Make an API call to update the primary address in the database
        try {
            await axios.put(`${apiUrl}/addresses/${address.address_id}/set-primary`);
            // Fetch updated addresses again if necessary
        } catch (error) {
            console.error('Error updating primary address:', error);
        }
    };

    const handlePaymentChange = async (payment) => {
        // Update the selected payment
        setSelectedPayment(payment);
        setShowPaymentList(false);

        // Make an API call to update the default payment method in the database
        try {
            await axios.put(`${apiUrl}/payments/${payment.payment_id}/set-default`);
            // Fetch updated payments again if necessary
        } catch (error) {
            console.error('Error updating default payment:', error);
        }
    };

    const [defaultAddress, setDefaultAddress] = useState(null);
    const [defaultPayment, setDefaultPayment] = useState(null);

    const fetchAddressesFromDB = async (userId) => {
        try {
            const response = await axios.get(`${apiUrl}/addresses/${userId}`);
            setDefaultAddress(response.data.find(addr => addr.is_primary));
            // ... set other addresses if needed
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchPaymentsFromDB = async (userId) => {
        try {
            const response = await axios.get(`${apiUrl}/payments/${userId}`);
            setDefaultPayment(response.data.find(pm => pm.is_default));
            // ... set other payments if needed
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    // useEffect(() => {
    //     // This should be replaced with actual data fetching logic
    //     const addresses = [
    //         {
    //             id: 1,
    //             addressLine: '123 Main St, Apt 4B',
    //             city: 'New York',
    //             state: 'NY',
    //             postalCode: '10001',
    //             isPrimary: true,
    //         },
    //         {
    //             id: 2,
    //             addressLine: '456 Elm St, Unit 2C',
    //             city: 'Los Angeles',
    //             state: 'CA',
    //             postalCode: '90001',
    //             isPrimary: false,
    //         },
    //     ];

    //     // Find the primary address
    //     const primaryAddress = addresses.find(address => address.isPrimary);
    //     setDefaultAddress(primaryAddress);


    //     const payments = [
    //         {
    //             id: 1,
    //             cardNumber: '1234 **** **** 5678',
    //             cardType: 'Visa',
    //             expiryDate: '12/25',
    //             cvv: '123',
    //             isDefault: true,
    //         },
    //         {
    //             id: 2,
    //             cardNumber: '5678 **** **** 1234',
    //             cardType: 'MasterCard',
    //             expiryDate: '10/23',
    //             cvv: '456',
    //             isDefault: false,
    //         },];

    //     // Find the default payment method
    //     const defaultMethod = payments.find(payment => payment.isDefault);
    //     setDefaultPayment(defaultMethod);
    // }, []);
    useEffect(() => {
        const localUserData = sessionStorage.getItem('user');
        if (localUserData) {
            const userData = JSON.parse(localUserData);
            fetchAddressesFromDB(userData.id);
            fetchPaymentsFromDB(userData.id);
        } else {
            // Handle non-logged-in user scenario
            // You might want to redirect them to login or show a message
        }
    }, []);
    

    return (
        <>
            <Navbar />
            <div className="signup-background">
                <div className="title">
                    <h2>Checkout</h2>
                </div>
            </div>
            <div className="checkout-container">
                <div className="checkout-left">
                    <div className="shipping-address-section">
                        <h2>Shipping Address</h2>
                        {selectedAddress ? (
                            <p>{selectedAddress.address_line}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.postal_code}</p>
                        ) : defaultAddress ? (
                            <p>{defaultAddress.address_line}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.postal_code}</p>
                        ) : (
                            <p>No address selected</p>
                        )}
                        <button onClick={() => setShowAddressList(!showAddressList)}>Change</button>
                    </div>

                    {showAddressList && (
                        <MyAddresses onSelectAddress={handleAddressChange} isCheckout={true} />
                    )}
                    <div className="payment-method-section">
                        <h2>Payment Method</h2>
                        {selectedPayment ? (
                            <p>{selectedPayment.card_type} -  {`${selectedPayment.card_number.slice(0, 4)} **** **** ${selectedPayment.card_number.slice(-4)}`}</p>
                        ) : defaultPayment ? (
                            <p>{defaultPayment.card_type} - {`${defaultPayment.card_number.slice(0, 4)} **** **** ${defaultPayment.card_number.slice(-4)}`}</p>
                        ) : (
                            <p>No payment method selected</p>
                        )}
                        <button onClick={() => setShowPaymentList(!showPaymentList)}>Change</button>
                    </div>

                    {showPaymentList && (
                        <MyPayments onSelectPayment={handlePaymentChange} isCheckout={true} />
                    )}
                     <div className="product-details-checkout">
                        <table>
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>DESCRIPTION</th>
                                    <th>PRICE</th>
                                    <th>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img src={product.image} alt={product.name} className="product-image-checkout" />
                                        </td>
                                        <td>{product.description}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>${(product.price * product.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="checkout-right">
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <p>Items: {cart.length}</p>
                        <p>Subtotal: ${totalPrice.toFixed(2)}</p>
                        <p>Tax: ${tax.toFixed(2)}</p>
                        <h4>Total: ${totalIncludingTax.toFixed(2)}</h4>
                        <button className="place-order-button">Place Order</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Checkout;
