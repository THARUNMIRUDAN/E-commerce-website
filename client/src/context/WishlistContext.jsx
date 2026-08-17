import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistService.get();
      setWishlist(data || []);
    } catch (error) {
      console.error('[WishlistContext] Failed to load wishlist:', error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => (item._id || item) === productId);
    },
    [wishlist]
  );

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showToast('Please sign in to save items to your wishlist', 'info');
      return false;
    }

    const productId = product._id || product;
    const exists = isInWishlist(productId);

    try {
      if (exists) {
        const updated = await wishlistService.remove(productId);
        setWishlist(updated);
        showToast('Removed from wishlist', 'info');
      } else {
        const updated = await wishlistService.add(productId);
        setWishlist(updated);
        showToast('Added to your wishlist!', 'success');
      }
      return true;
    } catch (error) {
      showToast(error.message || 'Failed to update wishlist', 'error');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const updated = await wishlistService.remove(productId);
      setWishlist(updated);
      showToast('Removed from wishlist', 'info');
    } catch (error) {
      showToast(error.message || 'Failed to remove from wishlist', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
