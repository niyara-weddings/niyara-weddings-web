"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLogoutCallback, apiGet } from '@/utils/api';
import { User, ApiResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const res = await apiGet<User>('/api/v1/auth/profile/');
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // Not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await apiGet<User>('/api/v1/auth/profile/');
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };

  const handleAuthResponse = async (response: Response) => {
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Authentication operation failed');
    }

    const userData = result.data.user;
    setUser(userData);

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
        credentials: 'include'
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
        credentials: 'include'
      });

      return await handleAuthResponse(response);
    } catch (error: any) {
      console.error("Registration Context Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    if (API_URL) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout/`, {
          method: 'POST',
          credentials: 'include'
        });
      } catch (e) {
        console.error("Server logout failed", e);
      }
    }
    setUser(null);
  };

  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
