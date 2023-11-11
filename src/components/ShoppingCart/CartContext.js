import React, { createContext, useState, useContext, useEffect  } from 'react';
import axios from 'axios';
import config from '../../config';
import UserContext from '../../UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const userEmail = sessionStorage.getItem('userEmail');
    const { user, isLoggedIn, setUser ,setIsLoggedIn} = useContext(UserContext); // Now also getting isLoggedIn from context
    console.log(user);
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
          console.log('fetch DB call');
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching cart from DB:', error);
          // Handle error, e.g., by setting some state
        }
      };

      const saveCartToDB = async (userId, cart) => {
        console.log(cart);
        try {
          await axios.put(`${apiUrl}/cart/${userId}`, cart, {
            // headers: { Authorization: `Bearer ${user.token}` },
          });
        } catch (error) {
          console.error('Error saving cart to DB:', error);
          // Handle error, e.g., by setting some state
        }
      };

     
      const totalPrice = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

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
        console.log('add DB');
        saveCartToDB(userData.id, updatedCart);
      } else {
        saveCartToLocal(updatedCart);
        console.log('add local');
        console.log(userEmail,isLoggedIn);
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
        console.log('remove DB');
        saveCartToDB(userData.id, updatedCart);
      } else {
        console.log('remove local');
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
        console.log('uodate DB');
        saveCartToDB(userData.id, updatedCart);
      } else {
        console.log('update local');
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
      console.log(userData);
      console.log(userData.id)
      fetchCartFromDB(userData.id);
      console.log('DB effect');
    } else {
      console.log('local effect');
      const localData = sessionStorage.getItem('cart');
      setCart(localData ? JSON.parse(localData) : []);
    }
  }, [user, isLoggedIn]);
  

  const clearCart =() =>{
    setCart([]);
    const localUserData = sessionStorage.getItem('user');

      // Save updated cart to local storage immediately
      if (localUserData) {
        const userData = JSON.parse(localUserData);
        console.log('uodate DB');
        saveCartToDB(userData.id, []);
      } else {
        console.log('update local');
        saveCartToLocal([]);
      }
      return [];
  }

  const applyCoupon = (couponCode) => {
    // Define coupon application logic here
    console.log(`Applying coupon: ${couponCode}`);
    // For now, it's just a placeholder
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, applyCoupon, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
