"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLogoutCallback } from '@/utils/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const handleAuthResponse = async (response: Response) => {
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Authentication operation failed');
    }

    const accessToken = result.data.tokens.access;
    const refreshToken = result.data.tokens.refresh;
    const userData = result.data.user;

    setToken(accessToken);
    setUser(userData);

    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return { success: true };
  };

  const login = async (username: string, password: string) => {
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
    } catch (error: any) {
      console.error("Login Context Error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData: any) => {
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
    } catch (error: any) {
      console.error("Registration Context Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

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
