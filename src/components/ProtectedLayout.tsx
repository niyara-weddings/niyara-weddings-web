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

const drawerWidth = 260;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Guests', icon: <PeopleIcon />, path: '/guests' },
    { text: 'Vendors', icon: <StoreIcon />, path: '/vendors' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2
      }}>
        <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
          <Typography variant="h6" component="div" sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>
            Wedding Planner
          </Typography>
        </Link>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} passHref key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={mobileOpen ? handleDrawerToggle : undefined} // Conditional onClick
                selected={pathname === item.path}
                sx={{
                  py: 1.5,
                  pl: 3,
                  '&.Mui-selected': {
                    borderRight: '4px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(212, 165, 116, 0.08)',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(212, 165, 116, 0.12)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{
                  color: pathname === item.path ? 'primary.main' : 'inherit',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                fontWeight: 500,
                textTransform: 'none',
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  bgcolor: 'rgba(0,0,0,0.04)'
                },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Logout
            </Button>
            <IconButton
              size="large"
              aria-label="view profile"
              onClick={() => router.push('/profile')}
              color="inherit"
              sx={{ p: 0 }}
            >
              <Avatar
                src={user?.profile_image ? getMediaUrl(user.profile_image) : undefined}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: user?.profile_image ? 'transparent' : 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}
              >
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <div>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar /> {/* This empty Toolbar provides spacing below AppBar */}
        {children}
      </Box>
    </Box>
  );
}
