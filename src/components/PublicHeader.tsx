"use client";

import React from 'react';
import { Box, Button, IconButton, Avatar, Menu, MenuItem, ListItemIcon } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { getMediaUrl } from '@/utils/api';

import { useThemeMode } from '@/context/ThemeContext';
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';

export default function PublicHeader({
    isFixed = false,
    onToggleMobile,
}: {
    onToggleMobile?: () => void;
    onToggleDesktop?: () => void;
    isFixed?: boolean;
    desktopOpen?: boolean;
    drawerWidth?: number;
}) {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { mode, toggleColorMode } = useThemeMode();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => { handleClose(); logout(); router.push('/login'); };

    const menuItems = [
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Guest Manager', path: '/guests' },
        { text: 'Vendors', path: '/vendors' },
        { text: 'Action Plan', path: '/tasks' },
        { text: 'Wedding Canvas', path: '/profile' },
    ];

    return (
        <Box sx={{
            width: '100%',
            py: 1.5,
            px: { xs: 2, md: 4 },
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: isFixed ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            zIndex: (theme) => theme.zIndex.drawer + 2
        }}>
            {/* Logo area - Simplified */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, md: 4 } }}>
                <Link href="/" passHref style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img
                        src={mode === 'light' ? "/niyara-logo-main.jpg" : "/niyara-logo-white.png"}
                        alt="Niyara Weddings"
                        style={{ height: '35px', objectFit: 'contain' }}
                    />
                </Link>
            </Box>

            {isAuthenticated ? (
                <>
                    {/* Navigation - Only visible for authenticated users */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {menuItems.map((item) => (
                            <Button key={item.text} onClick={() => router.push(item.path)} sx={{
                                color: pathname === item.path ? 'primary.main' : 'text.primary',
                                fontWeight: pathname === item.path ? 700 : 500,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                px: 2,
                                '&:hover': {
                                    backgroundColor: mode === 'light' ? 'rgba(186, 60, 80, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                                    color: 'primary.main'
                                }
                            }}>
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 'auto', md: 0 } }}>
                        <IconButton onClick={toggleColorMode} color="inherit" sx={{ color: 'text.primary' }}>
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleLogout}
                            className="premium-button-hover"
                            sx={{
                                color: 'primary.main',
                                borderColor: 'primary.main',
                                borderRadius: '20px',
                                fontWeight: 700,
                                px: 3,
                                py: 0.5,
                                textTransform: 'none',
                                display: { xs: 'none', sm: 'flex' },
                                '&:hover': {
                                    backgroundColor: 'rgba(186, 60, 80, 0.05)',
                                    borderColor: 'primary.dark',
                                }
                            }}
                        >
                            Logout
                        </Button>

                        {/* Mobile Menu Icon — opens sidebar drawer */}
                        <IconButton
                            color="inherit"
                            aria-label="open navigation menu"
                            edge="start"
                            onClick={() => onToggleMobile?.()}
                            sx={{ display: { md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Avatar for desktop */}
                        <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                            <Avatar
                                src={user?.profile_image ? getMediaUrl(user.profile_image) : undefined}
                                onClick={() => router.push('/profile')}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer',
                                    bgcolor: user?.profile_image ? 'transparent' : 'primary.main',
                                    border: '2px solid',
                                    borderColor: 'primary.main'
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        </Box>
                    </Box>
                </>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                    <IconButton onClick={toggleColorMode} color="inherit" sx={{ color: 'text.primary' }}>
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                    {/* Login: hidden on mobile — already available on the landing hero card */}
                    <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outlined"
                            sx={{
                                display: { xs: 'none', sm: 'inline-flex' },
                                color: 'primary.main',
                                borderColor: 'primary.main',
                                borderRadius: '30px',
                                px: { xs: 2, md: 3 },
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'rgba(186, 60, 80, 0.04)',
                                    borderColor: '#9a2e40'
                                }
                            }}
                        >
                            Login
                        </Button>
                    </Link>
                    <Link href="/register" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'primary.main',
                                color: '#fff',
                                borderRadius: '30px',
                                px: { xs: 2, md: 3 },
                                textTransform: 'none',
                                fontWeight: 700,
                                boxShadow: 'none',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    backgroundColor: '#9a2e40',
                                    boxShadow: '0 4px 12px rgba(186,60,80,0.3)'
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </Link>
                </Box>
            )}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>Logout</MenuItem>
            </Menu>
        </Box>
    );
}
