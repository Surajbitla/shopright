import React, { useState, useEffect } from 'react';
import './MyAddresses.css';
import axios from 'axios';
import config from '../../config';

const MyAddresses = ({ onSelectAddress, isCheckout }) => {
  // Sample address data, replace with actual user data
  const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

  const [addresses, setAddresses] = useState([]);
  // Form state for adding new address
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    isPrimary: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem('user'));
    if(storedUserData){
      const userId = storedUserData.id;
    fetchAddresses(userId);
    }
    
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      const response = await axios.get(`${apiUrl}/addresses/${userId}`);
      setAddresses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });

    // Postal code validation
    if (name === 'postalCode') {
      const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
      if (!postalCodeRegex.test(value)) {
        setValidationErrors({ ...validationErrors, postalCode: 'Invalid postal code format.' });
      } else {
        setValidationErrors({ ...validationErrors, postalCode: '' });
      }
    }

    // Add other field validations as needed
  };


  const addNewAddress = async () => {
    const storedUserData = JSON.parse(sessionStorage.getItem('user'));
    const userId = storedUserData.id;
    if (newAddress.addressLine && newAddress.city && newAddress.state && newAddress.postalCode) {
      try {
        await axios.post(`${apiUrl}/addresses`, { ...newAddress, userId });
        fetchAddresses(userId); // Refresh the addresses list
        setNewAddress({ addressLine: '', city: '', state: '', postalCode: '', isPrimary: false });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding new address:', error);
      }
    }
  };

  
    // Function to remove an address
    const removeAddress = async (addressId) => {
      const storedUserData = JSON.parse(sessionStorage.getItem('user'));
      const userId = storedUserData.id;
      try {
        await axios.delete(`${apiUrl}/addresses/${addressId}`);
        fetchAddresses(userId); // Refresh the addresses list
      } catch (error) {
        console.error('Error removing address:', error);
      }
    };

    const setPrimaryAddress = async (addressId) => {
      const storedUserData = JSON.parse(sessionStorage.getItem('user'));
      const userId = storedUserData.id;
      try {
        await axios.put(`${apiUrl}/addresses/${addressId}/set-primary`, { userId });
        fetchAddresses(userId); // Refresh the addresses list
      } catch (error) {
        console.error('Error setting primary address:', error);
      }
    };
    

  // Function to toggle the form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="my-addresses-container">
      <h3>My Addresses</h3>
      <div className="address-list">
        {addresses.length === 0 ? (
          <p>No addresses added.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.address_id} className="address-item">
              <div className="address-details">
                <p className="address-line">{address.address_line}</p>
                <p className="address-info">{`${address.city}, ${address.state} ${address.postal_code}`}</p>
                {(address.is_primary!=0) && <p className="primary-address">Primary Address</p>}
              </div>
              <div className="address-actions">
                {!isCheckout && !(address.is_primary!=0) && (
                  <button
                    className="set-primary-button"
                    onClick={() => setPrimaryAddress(address.address_id)}
                  >
                    Set as Primary
                  </button>
                )}
                {!isCheckout && (
                  <button
                    className="remove-address-button"
                    onClick={() => removeAddress(address.address_id)}
                  >
                    Remove
                  </button>
                )}
                {onSelectAddress && (
                  <button onClick={() => onSelectAddress(address)}>Select</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="add-address-form">
        {showForm ? (
          <>
            <h4>Add New Address</h4>
            <input
              type="text"
              name="addressLine"
              placeholder="Address Line"
              value={newAddress.addressLine}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={newAddress.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={newAddress.state}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={newAddress.postalCode}
              onChange={handleInputChange}
            />
            {validationErrors.postalCode && (
              <p className="validation-error">{validationErrors.postalCode}</p>
            )}
            <button className="add-address-button" onClick={addNewAddress}>
              Add Address
            </button>
            <button className="cancel-button" onClick={toggleForm}>
              Cancel
            </button>
          </>
        ) : (
          <button className="add-address-button" onClick={toggleForm}>
            Add Address
          </button>
        )}
      </div>
    </div>
  );
};

export default MyAddresses;
