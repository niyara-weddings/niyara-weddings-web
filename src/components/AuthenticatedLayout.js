"use client";

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function AuthenticatedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not logged in and not on login page, redirect to login
  if (!user && pathname !== '/login') {
    router.push('/login');
    return null;
  }

  // If logged in and on login page, redirect to dashboard
  if (user && pathname === '/login') {
    router.push('/');
    return null;
  }

  // Show login page without navigation
  if (!user) {
    return children;
  }

  // Show authenticated layout with navigation
  const DRAWER_WIDTH = 250;
  const APP_BAR_HEIGHT = 64;

  return (
    <>
      <Navigation />
      <Box
        component="main"
        sx={{
          marginLeft: DRAWER_WIDTH,
          marginTop: APP_BAR_HEIGHT,
          backgroundColor: "#f5f5f5",
          minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
        }}
      >
        {children}
      </Box>
    </>
  );
}
