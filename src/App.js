import './App.css';
import UserContext from './UserContext';
import React, { useState, useEffect } from 'react';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from './components/Error/Error';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import EmailNotification from './components/EmailNotification/EmailNotification';
import ChangePassword from './components/ChangePassword/ChangePassword';
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import CustomerService from './components/CustomerService/CustomerService';
import Products from './components/Products/Products';
import ProductDetails from './components/Products/ProductDetails';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import OrderHistory from './components/OrderHistory/OrderHistory';
import Checkout from './components/Checkout/Checkout';
import Maintenance from './components/Maintenance/Maintenance';
import Admin from './components/Admin/Admin';
import { CartProvider } from './components/ShoppingCart/CartContext';


function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const checkMaintenance = () => {
      const currentTime = new Date();
      const startMaintenance = new Date();
      const endMaintenance = new Date();

      startMaintenance.setHours(20, 40, 0); // Set start time (9:00 PM)
      endMaintenance.setHours(20, 43, 0); // Set end time (9:30 PM)

      setIsMaintenance(currentTime >= startMaintenance && currentTime <= endMaintenance);
    };

    const interval = setInterval(checkMaintenance, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                {isMaintenance ? (
                  <Route path="*" element={<Maintenance />} />
                ) : (
                  <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/email-notification" element={<EmailNotification />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/customer-service" element={<CustomerService />} />
                    <Route path="/shopping-cart" element={<ShoppingCart />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Error />} />
                  </>)}
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserContext.Provider>
    </>
  );
}

export default App;
