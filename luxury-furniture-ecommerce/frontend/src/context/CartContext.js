import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 } });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      setCart(response.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/cart/items`, { productId, quantity });
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await axios.put(`${API_URL}/cart/items/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/items/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart`);
      setCart({ items: [], totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 } });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      fetchCart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      cartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
