'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function LoginPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    // ... (rest of the file remains same, I'm just ensuring initialization is there)
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: theme => theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
        : 'linear-gradient(135deg, #1a1625 0%, #121019 100%)'
    }}>
      <PublicHeader />
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Paper
          className="fade-in"
          elevation={0}
          sx={{
            p: 6,
            width: '100%',
            borderRadius: 4,
            background: theme => theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(36, 30, 48, 0.95)',
            backdropFilter: 'blur(12px)',
            border: theme => theme.palette.mode === 'light'
              ? '1px solid rgba(255, 255, 255, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: theme => theme.palette.mode === 'light'
              ? '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
              : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <img
                src={theme.palette.mode === 'light' ? "/niyara-logo-main.jpg" : "/niyara-logo-white.png"}
                alt="Niyara Weddings"
                style={{ height: '50px', objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back to your wedding storyboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="premium-button-hover"
              sx={{
                py: 1.8,
                fontSize: '1rem',
                mb: 2,
                backgroundColor: '#BA3C50',
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                color: '#fff',
                boxShadow: '0 4px 14px 0 rgba(186, 60, 80, 0.39)',
                '&:hover': {
                  backgroundColor: '#9a2e40',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <MuiLink component={Link} href="/register" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      <PublicFooter />
    </Box >
  );
}
