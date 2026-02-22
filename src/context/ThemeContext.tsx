'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleColorMode: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<PaletteMode>('light');

    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') as PaletteMode;
        if (savedMode) {
            setMode(savedMode);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Optional: auto-detect system preference if no manual setting
            // setMode('dark');
        }
    }, []);

    const themeMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#BA3C50', // Niyara Red
                        contrastText: '#ffffff',
                    },
                    secondary: {
                        main: mode === 'light' ? '#433B5C' : '#BA3C50', // Brighter pink in dark mode
                    },
                    background: {
                        default: mode === 'light' ? '#fdfbfb' : '#1a1625', // Dark plum/purple background
                        paper: mode === 'light' ? '#ffffff' : '#241e30', // Slightly lighter plum for cards
                    },
                    text: {
                        primary: mode === 'light' ? '#433B5C' : '#f5f5f7',
                        secondary: mode === 'light' ? 'rgba(67, 59, 92, 0.7)' : 'rgba(245, 245, 247, 0.85)',
                    },
                },
                typography: {
                    fontFamily: '"Overpass", "Roboto", "Helvetica", "Arial", sans-serif',
                    button: { textTransform: 'none' },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                backgroundColor: mode === 'light' ? '#fdfbfb' : '#1a1625',
                                transition: 'background-color 0.3s ease',
                                minHeight: '100vh',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.3s ease-in-out', // Keep existing transition
                            },
                            containedPrimary: {
                                '&:hover': {
                                    backgroundColor: '#9a2e40', // Brighter pinkish-red hover
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(186, 60, 80, 0.3)',
                                },
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                                color: mode === 'light' ? '#433B5C' : '#ffffff',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={themeMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
