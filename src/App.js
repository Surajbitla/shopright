import logo from './logo.svg';
import './App.css';
import UserContext from './UserContext';
import React, { useState } from 'react';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from './components/Error';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailNotification from './components/EmailNotification/EmailNotification';
import ChangePassword from './components/ChangePassword/ChangePassword';
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/email-notification" element={<EmailNotification />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="forgot-password" element={<ForgotPassword />}/>
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
    </>
  );
}

export default App;
