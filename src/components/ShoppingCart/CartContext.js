import React, { createContext, useState, useContext, useEffect  } from 'react';
import axios from 'axios';
import config from '../../config';
import UserContext from '../../UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user, isLoggedIn } = useContext(UserContext); // Now also getting isLoggedIn from context
    const TAX_RATE = 0.10; // 10% tax rate, adjust as needed
    const totalPrice = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    // Calculate tax based on subtotal
    const tax = totalPrice * TAX_RATE;

    // Calculate total price including tax
    const totalIncludingTax = totalPrice + tax;
    const apiUrl = process.env.NODE_ENV === 'development' ? config.development.apiUrl : config.production.apiUrl;

    const saveCartToLocal = (cart) => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
      };
    const fetchCartFromDB = async (userId) => {
        try {
          const response = await axios.get(`${apiUrl}/cart/${userId}`, {
            // headers: { Authorization: `Bearer ${user.token}` }, 
          });
          setCart(response.data);
        } catch (error) {
          // Handle error, e.g., by setting some state
        }
      };

      const saveCartToDB = async (userId, cart) => {
        try {
          await axios.put(`${apiUrl}/cart/${userId}`, cart, {
            // headers: { Authorization: `Bearer ${user.token}` },
          });
        } catch (error) {
          // Handle error, e.g., by setting some state
        }
      };

     

      // Function to handle adding items to cart
const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      let updatedCart;
      if (existingProductIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...prevCart[existingProductIndex],
          quantity: prevCart[existingProductIndex].quantity + quantity,
        };
      } else {
        updatedCart = [...prevCart, { ...product, quantity }];
      }
  
      const localUserData = sessionStorage.getItem('user');
      // Save updated cart to local storage immediately
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        saveCartToDB(userData.id, updatedCart);
      } else {
        saveCartToLocal(updatedCart);
      }
      return updatedCart;
    });
  };
  
  // Function to handle removing items from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);

      const localUserData = sessionStorage.getItem('user');
  
      // Save updated cart to local storage immediately
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        saveCartToDB(userData.id, updatedCart);
      } else {
        saveCartToLocal(updatedCart);
      }
      return updatedCart;
    });
  };
  
  // Function to handle updating quantity
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === productId);
      let updatedCart;
      if (existingProductIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...prevCart[existingProductIndex],
          quantity: quantity,
        };
      } else {
        updatedCart = prevCart;
      }
      const localUserData = sessionStorage.getItem('user');

      // Save updated cart to local storage immediately
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        saveCartToDB(userData.id, updatedCart);
      } else {
        saveCartToLocal(updatedCart);
      }
      return updatedCart;
    });
  };
  // Effect for initializing the cart
// useEffect(() => {
//     const localData = sessionStorage.getItem('cart');
//     setCart(localData ? JSON.parse(localData) : []);
//   }, []);
useEffect(() => {
  const localUserData = sessionStorage.getItem('user');
  // if (localUserData) {
  //   const userData = JSON.parse(localUserData);
  //   setUser(userData);
  //   setIsLoggedIn(true);
  // }
    if (localUserData) {
      const userData = JSON.parse(localUserData);
      fetchCartFromDB(userData.id);
    } else {
      const localData = sessionStorage.getItem('cart');
      setCart(localData ? JSON.parse(localData) : []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoggedIn]);
  

  const clearCart =() =>{
    setCart([]);
    const localUserData = sessionStorage.getItem('user');

      // Save updated cart to local storage immediately
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        saveCartToDB(userData.id, []);
      } else {
        saveCartToLocal([]);
      }
      return [];
  }

  const applyCoupon = (couponCode) => {
    // Define coupon application logic here
    // Placeholder for coupon application
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, applyCoupon, clearCart, totalPrice, tax, totalIncludingTax }}>
      {children}
    </CartContext.Provider>
  );
};
