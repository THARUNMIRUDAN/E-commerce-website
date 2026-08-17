import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext();

const initialCartState = {
  items: [],
  totalItems: 0,
  originalSubtotal: 0,
  subtotal: 0,
  discount: 0,
  deliveryCharge: 0,
  grandTotal: 0,
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(initialCartState);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(initialCartState);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.get();
      setCart(data || initialCartState);
    } catch (error) {
      console.error('[CartContext] Error fetching cart:', error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart', 'info');
      return false;
    }
    try {
      const updatedCart = await cartService.add(productId, quantity);
      setCart(updatedCart);
      showToast('Item added to cart!', 'success');
      return true;
    } catch (error) {
      showToast(error.message || 'Failed to add item to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const updatedCart = await cartService.update(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      showToast(error.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const updatedCart = await cartService.remove(productId);
      setCart(updatedCart);
      showToast('Item removed from cart', 'info');
    } catch (error) {
      showToast(error.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      const updatedCart = await cartService.clear();
      setCart(updatedCart);
    } catch (error) {
      showToast(error.message || 'Failed to clear cart', 'error');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.totalItems || 0,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
