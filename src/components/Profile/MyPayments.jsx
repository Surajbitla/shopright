import React, { useState, useEffect } from 'react';
import './MyPayments.css';
import axios from 'axios';
import config from '../../config';

const MyPayments = ({ onSelectPayment, isCheckout }) => {
  // Sample payment data, replace with actual user data
  const [payments, setPayments] = useState([]);
  const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

  // Form state for adding new payment
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    cardType: 'Visa', // Default card type
    expiryDate: '',
    cvv: '',
    isDefault: false,
  });

  // Predefined card types
  const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover'];

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    cardNumber: '',
    cvv: '',
    expiryDate: '',
  });

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem('user'));
    if (storedUserData) {
      const userId = storedUserData.id;
      fetchPayments(userId);
    }
  }, []);


  const fetchPayments = async (userId) => {
    try {
      const response = await axios.get(`${apiUrl}/payments/${userId}`);
      setPayments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  // Function to set a payment method as default
  const setDefaultPayment = async (paymentId) => {
    const storedUserData = JSON.parse(sessionStorage.getItem('user'));
    const userId = storedUserData.id;
    try {
      await axios.put(`${apiUrl}/payments/${paymentId}/set-default`, { userId });
      fetchPayments(userId); // Refresh the payment methods list
    } catch (error) {
      console.error('Error setting default payment:', error);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });

    // Validate card number
    if (name === 'cardNumber') {
      if (/^[0-9]{16}$/.test(value)) {
        setValidationErrors({ ...validationErrors, cardNumber: '' });
      } else {
        setValidationErrors({ ...validationErrors, cardNumber: 'Card number must be 16 digits.' });
      }
    }

    // Validate CVV
    if (name === 'cvv') {
      if (/^[0-9]{3}$/.test(value)) {
        setValidationErrors({ ...validationErrors, cvv: '' });
      } else {
        setValidationErrors({ ...validationErrors, cvv: 'CVV must be 3 digits.' });
      }
    }

    // Validate expiry date
    if (name === 'expiryDate') {
      if (/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)) {
        setValidationErrors({ ...validationErrors, expiryDate: '' });
      } else {
        setValidationErrors({ ...validationErrors, expiryDate: 'Expiry date must be in MM/YY format.' });
      }
    }
  };
  // Function to remove a payment method
  const removePayment = async (paymentId) => {
    const storedUserData = JSON.parse(sessionStorage.getItem('user'));
    const userId = storedUserData.id;
    try {
      await axios.delete(`${apiUrl}/payments/${paymentId}`);
      fetchPayments(userId); // Refresh the payment methods list
    } catch (error) {
      console.error('Error removing payment:', error);
    }
  };

  // Function to add a new payment method
  const addNewPayment = async () => {

    const storedUserData = JSON.parse(sessionStorage.getItem('user'));
    const userId = storedUserData.id;
    // Check if there are validation errors
    if (
      validationErrors.cardNumber ||
      validationErrors.cvv ||
      validationErrors.expiryDate
    ) {
      return;
    }

    // Generate a new unique ID for the payment
    const newId = payments.length > 0 ? Math.max(...payments.map((payment) => payment.id)) + 1 : 1;

    // Mask the card number to show only the first and last 4 digits
    // Assuming all card numbers are 16 digits long
    const maskedCardNumber = `${newPayment.cardNumber.slice(0, 4)} **** **** ${newPayment.cardNumber.slice(-4)}`;

    // Add the new payment method to the payments array
    const newPaymentWithMaskedNumber = {
      ...newPayment,
      id: newId,
      cardNumber: maskedCardNumber
    };
    setPayments([...payments, newPaymentWithMaskedNumber]);

    try {
      await axios.post(`${apiUrl}/payments`, { ...newPayment, userId });
      fetchPayments(userId); // Refresh the payment methods list
      setNewPayment({ cardNumber: '', cardType: 'Visa', expiryDate: '', cvv: '', isDefault: false });
      setValidationErrors({ cardNumber: '', cvv: '', expiryDate: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding new payment:', error);
    }
  };


  // State to track if the form should be shown
  const [showForm, setShowForm] = useState(false);

  // Function to toggle the form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    // Clear validation errors when form is toggled
    setValidationErrors({ cardNumber: '', cvv: '', expiryDate: '' });
  };

  return (
    <div className="my-payments-container">
      <h3>My Payments</h3>
      <div className="payment-list">
        {payments.length === 0 ? (
          <p>No payments added.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.payment_id} className="payment-item">
              <div className="payment-details">
                <p className="payment-card-number">
                  {`${payment.card_number?.slice(0, 4) || '****'} **** **** ${payment.card_number?.slice(-4) || '****'}`}
                </p>
                <p className="payment-card-type">{payment.card_type}</p>
                {(payment.is_default != 0) && <p className="default-payment">Default</p>}
              </div>
              <div className="payment-actions">
                {!isCheckout && !(payment.is_default != 0) && (
                  <button
                    className="set-default-button"
                    onClick={() => setDefaultPayment(payment.payment_id)}
                  >
                    Set as Default
                  </button>
                )}
                {!isCheckout && (

                  <button
                    className="remove-payment-button"
                    onClick={() => removePayment(payment.payment_id)}
                  >
                    Remove
                  </button>
                )}
                {onSelectPayment && (
                  <button onClick={() => onSelectPayment(payment)}>
                    Select
                  </button>
                )}
              </div>
            </div>
          ))

        )}
      </div>
      <div className="add-payment-form">
        {showForm ? (
          <>
            <h4>Add New Payment</h4>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={newPayment.cardNumber}
              onChange={handleInputChange}
            />
            <select
              name="cardType"
              value={newPayment.cardType}
              onChange={handleInputChange}
            >
              {cardTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="expiryDate"
              placeholder="Expiry Date (MM/YY)"
              value={newPayment.expiryDate}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              value={newPayment.cvv}
              onChange={handleInputChange}
            />
            <button className="add-payment-button" onClick={addNewPayment}>
              Add Payment
            </button>
            <button className="cancel-button" onClick={toggleForm}>
              Cancel
            </button>
            {validationErrors.cardNumber && (
              <p className="validation-error">{validationErrors.cardNumber}</p>
            )}
            {validationErrors.expiryDate && (
              <p className="validation-error">{validationErrors.expiryDate}</p>
            )}
            {validationErrors.cvv && (
              <p className="validation-error">{validationErrors.cvv}</p>
            )}
          </>
        ) : (
          <button className="add-payment-button" onClick={toggleForm}>
            Add Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default MyPayments;
