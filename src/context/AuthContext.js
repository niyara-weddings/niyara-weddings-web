"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLogoutCallback } from '@/utils/api'; // ADDED THIS LINE

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Strictly use Environment Variables. Fail fast if not configured.
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);




  /**
   * Helper to handle response logic within the context.
   */
  const handleAuthResponse = async (response) => {
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      // Backend standardizes error messages into 'message'
      throw new Error(result.message || 'Authentication operation failed');
    }

    // Success! Extract data from standardized envelope
    const accessToken = result.data.tokens.access;
    const userData = result.data.user;
    
    setToken(accessToken);
    setUser(userData);
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true };
  };

  /**
   * Login using username/password.
   */
  const login = async (username, password) => {
    if (!API_URL) return { success: false, error: "Frontend Error: API URL not set in .env.local" };

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      return await handleAuthResponse(response);
    } catch (error) {
      console.error("Login Context Error:", error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Register a new user.
   */
  const register = async (userData) => {
    if (!API_URL) return { success: false, error: "Frontend Error: API URL not set in .env.local" };

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await handleAuthResponse(response);
    } catch (error) {
      console.error("Registration Context Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    setLogoutCallback(logout); // ADDED THIS LINE (MOVED HERE)
  }, [logout]);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!(user && token),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
