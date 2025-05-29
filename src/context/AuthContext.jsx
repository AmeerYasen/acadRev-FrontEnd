// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login } from '../api/authApi';
import { STORAGE_KEYS, ROLES } from '../constants';

// Create the Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user data if logged in, null otherwise
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check
  const [error, setError] = useState(null); // Holds login errors

  // Check auth status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function using authApi
  const loginUser = async (credentials) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await login(credentials);
      if (response.success) {
        setUser(response.user);
        console.log('User logged in:', response.user);
        setError(null);
        return { success: true, user: response.user };
      } else {
        setError(response.error);
        setUser(null);
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message || 'Network error or server issue');
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setError(null);
    console.log('User logged out');
  };

  // Update document title based on auth state
  useEffect(() => {
    if (isLoading) {
      document.title = 'Loading...';
    } else if (user) {
      document.title = `${user.role || 'User'} Portal`;
    } else {
      document.title = 'Login';
    }
  }, [user, isLoading]);

  // Context value
  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    error,
    login: loginUser,
    logout,
    roles: ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};