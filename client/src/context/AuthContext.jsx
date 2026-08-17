import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('revibe_token');
      const savedUser = localStorage.getItem('revibe_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with server profile
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('revibe_user', JSON.stringify(profile));
        } catch (error) {
          console.error('[AuthContext] Session expired or invalid:', error.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      localStorage.setItem('revibe_token', data.token);
      localStorage.setItem('revibe_user', JSON.stringify(data));
      showToast(`Welcome back, ${data.name}!`, 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const data = await authService.register({ name, email, password, confirmPassword });
      setUser(data);
      localStorage.setItem('revibe_token', data.token);
      localStorage.setItem('revibe_user', JSON.stringify(data));
      showToast(`Account created! Welcome to Royal Shopping, ${data.name}!`, 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = (notify = true) => {
    setUser(null);
    localStorage.removeItem('revibe_token');
    localStorage.removeItem('revibe_user');
    if (notify) {
      showToast('You have been logged out', 'info');
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('revibe_user', JSON.stringify(merged));
      return merged;
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
