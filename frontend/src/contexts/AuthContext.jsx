import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Create the hook separately
function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed properties
  const isAuthenticated = !!user;
  const isEmployer = user?.role === 'employer';
  const isJobseeker = user?.role === 'jobseeker';

  useEffect(() => {
    // Check if user is logged in on page load
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (err) {
          // If token is invalid or expired, remove it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Registration failed'
      );
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      
      // send username/password to the server
      const response = await authAPI.login(credentials);
      
      // make sure we actually got a token back
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid response from server');
      }
      
      // save the token so we stay logged in
      localStorage.setItem('token', response.data.access_token);
      
      // now grab the user info
      try {
        const userResponse = await authAPI.getCurrentUser();
        setUser(userResponse.data);
        return userResponse.data;
      } catch (userErr) {
        throw userErr;
      }
    } catch (err) {
      // show something helpful to the user
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Login failed'
      );
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Continue with logout process regardless of error
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isEmployer,
    isJobseeker,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, useAuth }; 