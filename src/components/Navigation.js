'use client';

import React, { useState } from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Task as TaskIcon,
  LogoutRounded,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DRAWER_WIDTH = 250;

const Navigation = () => {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Guest', email: 'guest@example.com' });

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Guests', icon: <PeopleIcon />, href: '/guests' },
    { label: 'Vendors', icon: <BusinessIcon />, href: '/vendors' },
    { label: 'Tasks', icon: <TaskIcon />, href: '/tasks' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            💒 Wedding Planner
          </Typography>
          <Avatar sx={{ cursor: 'pointer' }} alt={user.name}>
            {user.name.charAt(0)}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            marginTop: '64px',
            backgroundColor: '#fafafa',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Welcome!
          </Typography>
        </Box>

        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={item.href}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                backgroundColor: '#ffebee',
              },
            }}
          >
            <ListItemIcon>
              <LogoutRounded />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;
