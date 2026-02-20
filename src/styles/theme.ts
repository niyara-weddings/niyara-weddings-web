'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ba3a50', // Original reddish-pink
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9e9e9e',  // Original neutral gray
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f8f8',  // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 500 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#a33346', // Original darker pink hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#f3f2f2',
          borderRadius: 8,
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
          '&.Mui-focused': {
            backgroundColor: '#f3f2f2',
          },
          '&::before, &::after': {
            display: 'none', // Removes the underline
          },
        },
        input: {
            color: '#333333' // The actual text color inside the input
        }
      },
    },
  },
});

export default theme;
