'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button, Container, Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { useAuth } from '@/context/AuthContext';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
    : 'linear-gradient(135deg, #1a1625 0%, #121019 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.75)'
    : 'rgba(36, 30, 48, 0.85)',
  backdropFilter: 'blur(20px)',
  boxShadow: theme.palette.mode === 'light'
    ? '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
    : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  borderRadius: '32px',
  // padding intentionally omitted — controlled via sx prop for responsiveness
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(255, 255, 255, 0.4)'
    : '1px solid rgba(255, 255, 255, 0.05)',
  animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
}));

const RedButton = styled(Button)(({ theme }) => ({
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: '30px',
  textTransform: 'none',
}));

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  // Avoid flashing the public landing page to a logged-in user
  if (loading || isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <HeroSection>
      <PublicHeader />
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: { xs: 8, md: 0 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Text Content */}
          <Grid size={{ xs: 12, md: 5 }}>
            <GlassCard elevation={0} sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="overline" sx={{ color: '#BA3C50', fontWeight: 800, letterSpacing: 5 }}>
                NIYARA WEDDING CANVAS
              </Typography>
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 900,
                mt: 1,
                mb: 2,
                lineHeight: 1.1,
                color: 'text.primary',
                letterSpacing: '-2px'
              }}>
                Plan Your <span style={{ color: '#BA3C50' }}>Perfect Story</span>
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', opacity: 0.8, mb: 5, fontWeight: 400, maxWidth: '90%' }}>
                A seamless extension of Niyara Weddings. Organize your Guest Manager, Action Plan, and Vendors in one premium dashboard.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                  <RedButton
                    variant="contained"
                    className="premium-button-hover"
                    sx={{
                      backgroundColor: '#BA3C50',
                      color: '#ffffff',
                    }}
                  >
                    Login
                  </RedButton>
                </Link>
                <Link href="/register" passHref style={{ textDecoration: 'none' }}>
                  <RedButton
                    variant="outlined"
                    className="premium-button-hover"
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#BA3C50',
                      border: '2px solid #BA3C50',
                      '&:hover': {
                        backgroundColor: 'rgba(186, 60, 80, 0.05)',
                        borderColor: '#9a2e40'
                      }
                    }}
                  >
                    Sign Up
                  </RedButton>
                </Link>
              </Box>
            </GlassCard>
          </Grid>

          {/* Landscape Hero Image */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{
              width: '100%',
              aspectRatio: { xs: '4/3', md: '16/10' },
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: theme => theme.palette.mode === 'light'
                ? '0 30px 60px rgba(0,0,0,0.12)'
                : '0 30px 60px rgba(0,0,0,0.5)',
              border: theme => `1px solid ${theme.palette.divider}`,
              animation: 'fadeInUp 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              position: 'relative'
            }}>
              <img
                src="/hero-wedding-image.jpg"
                alt="Wedding Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              {/* Subtle Overlay to blend with brand */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme => theme.palette.mode === 'dark'
                  ? 'linear-gradient(to right, rgba(26, 22, 37, 0.3), transparent)'
                  : 'transparent',
                pointerEvents: 'none'
              }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <PublicFooter />
    </HeroSection >
  );
}
