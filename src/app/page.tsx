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
  alignItems: 'center',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  position: 'relative',
  overflow: 'hidden',
  color: '#fff',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: '48px',
  animation: `${fadeIn} 1s ease-out`,
}));

const GoldButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d4af37',
  color: '#1a1a1a',
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#b8962e',
    transform: 'scale(1.02)',
  },
  transition: 'all 0.3s ease',
}));

export default function LandingPage() {
  return (
    <HeroSection>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <GlassCard elevation={0}>
              <Typography variant="overline" sx={{ color: '#d4af37', fontWeight: 800, letterSpacing: 4 }}>
                NIYARA LUXURY PLANNING
              </Typography>
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 800,
                mt: 2,
                mb: 3,
                lineHeight: 1.1
              }}>
                Modern Elegance for your <span style={{ color: '#d4af37' }}>Perfect Day</span>
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, fontWeight: 400 }}>
                The first comprehensive digital wedding planning platform built explicitly for Kenyan and West African wedding traditions.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="/login" passHref style={{ textDecoration: 'none' }}>
                  <GoldButton variant="contained">
                    Get Started
                  </GoldButton>
                </Link>
                <Link href="/register" passHref style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    px: 4,
                    borderRadius: '12px',
                    '&:hover': { borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,0.05)' }
                  }}>
                    Create Account
                  </Button>
                </Link>
              </Box>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            {/* Visual element placeholder or logo could go here */}
            <Box sx={{
              width: '100%',
              height: '400px',
              borderRadius: '24px',
              background: 'url(/niyara_logo_gold_charcoal.png) no-repeat center center',
              backgroundSize: 'contain',
              animation: `${fadeIn} 1.5s ease-out`
            }} />
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
}
