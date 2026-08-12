'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Grid,
} from '@mui/material';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function RegisterPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
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

    if (!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      router.push('/dashboard'); // Redirect to dashboard on success
    } else {
      setError(result.error || 'Registration failed');
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
              <Image
                src={theme.palette.mode === 'light' ? "/niyara-logo-main.jpg" : "/niyara-logo-white.png"}
                alt="Niyara Weddings"
                width={160}
                height={57}
                style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Start planning your perfect wedding story
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="password_confirm"
                  label="Confirm Password"
                  type="password"
                  id="password_confirm"
                  autoComplete="new-password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="premium-button-hover"
              sx={{
                py: 1.8,
                fontSize: '1rem',
                mt: 3,
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={Link} href="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Login
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
