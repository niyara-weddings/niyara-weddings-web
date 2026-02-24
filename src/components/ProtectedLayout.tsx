// src/components/ProtectedLayout.js
"use client";

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Assignment as TaskIcon,
  AccountCircle as ProfileIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMediaUrl } from '@/utils/api';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const drawerWidth = 260;

const StreamIcon = (props: any) => (
  <svg width="24" height="24" viewBox="0 0 512 512" fill="currentColor" {...props}>
    <path d="M16 128h416c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H16C7.16 32 0 39.16 0 48v64c0 8.84 7.16 16 16 16zm480 80H80c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm-64 176H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16z" />
  </svg>
);

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDesktopDrawerToggle = () => setDesktopOpen(!desktopOpen);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Guest Manager', icon: <PeopleIcon />, path: '/guests' },
    { text: 'Vendors', icon: <StoreIcon />, path: '/vendors' },
    { text: 'Action Plan', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Wedding Canvas', icon: <ProfileIcon />, path: '/profile' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: desktopOpen ? 'flex-end' : 'center',
        p: 2,
        minHeight: 64
      }}>
        <IconButton onClick={handleDesktopDrawerToggle} sx={{ color: 'primary.main' }}>
          <StreamIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Link href={item.path} passHref key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: desktopOpen ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(186, 60, 80, 0.08)',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 600 }
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: desktopOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: pathname === item.path ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: desktopOpen ? 1 : 0,
                    display: desktopOpen ? 'block' : 'none',
                    '& .MuiListItemText-primary': { fontSize: '0.9rem', fontWeight: pathname === item.path ? 600 : 500 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Box sx={{ p: 2, display: desktopOpen ? 'block' : 'none' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            justifyContent: 'center',
            backgroundColor: '#BA3C50',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#9a2e40',
              boxShadow: '0 4px 12px rgba(186, 60, 80, 0.3)'
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* 1. Desktop Sidebar - Full Height */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: desktopOpen ? drawerWidth : 72,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: desktopOpen ? drawerWidth : 72,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            position: 'relative',
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            boxShadow: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* 2. Main content Column [Header, Main] */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <PublicHeader onToggleMobile={handleDrawerToggle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 }, flexGrow: 1, width: '100%' }} className="fade-in-up">
            {children}
          </Box>
          <PublicFooter />
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
