'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f7f7f7',
  position: 'relative',
  overflow: 'hidden',
  color: '#333',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: '#ffffff',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
  borderRadius: '24px',
  padding: '48px',
  animation: `${fadeIn} 1s ease-out`,
}));

const RedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#BA3C50',
  color: '#ffffff',
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: '30px',
  '&:hover': {
    backgroundColor: '#9a2e40',
    transform: 'scale(1.02)',
  },
  transition: 'all 0.3s ease',
}));

export default function LandingPage() {
  return (
    <HeroSection>
      <Box sx={{ width: '100%', py: 3, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <img src="/niyara-logo-main.jpg" alt="Niyara Logo" style={{ height: '50px' }} />
      </Box>
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <GlassCard elevation={0}>
              <Typography variant="overline" sx={{ color: '#BA3C50', fontWeight: 800, letterSpacing: 4 }}>
                WEDDING PLANNER EXTENSION
              </Typography>
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 800,
                mt: 2,
                mb: 3,
                lineHeight: 1.1,
                color: '#433B5C'
              }}>
                Plan Your <span style={{ color: '#BA3C50' }}>Perfect Day</span>
              </Typography>
              <Typography variant="h5" sx={{ color: '#666', mb: 5, fontWeight: 400 }}>
                A seamless extension of Niyara Weddings. Manage your guests, tasks, and vendors in one professional dashboard.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                  <RedButton variant="contained">
                    Client Login
                  </RedButton>
                </Link>
                <Link href="/register" passHref style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" sx={{
                    borderColor: '#433B5C',
                    color: '#433B5C',
                    px: 4,
                    borderRadius: '30px',
                    '&:hover': { borderColor: '#BA3C50', backgroundColor: 'rgba(186,60,80,0.05)' }
                  }}>
                    Create Account
                  </Button>
                </Link>
              </Box>
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{
              width: '100%',
              height: '400px',
              borderRadius: '24px',
              background: 'url(/niyara-logo-main.jpg) no-repeat center center',
              backgroundSize: 'contain',
              animation: `${fadeIn} 1.5s ease-out`
            }} />
          </Grid>
        </Grid>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          backgroundColor: '#433B5C',
          color: 'white',
          textAlign: 'center',
          mt: 'auto'
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Niyara Weddings. All rights reserved.
        </Typography>
      </Box>
    </HeroSection>
  );
}
