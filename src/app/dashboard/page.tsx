'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet } from '@/utils/api';

const StatCard = ({ title, count, icon, color }: { title: string; count: number | null; icon: React.ReactNode; color: string }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
            {count !== null ? count : <CircularProgress size={24} />}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.3, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalGuests: null,
    guestRSVPd: null,
    totalVendors: null,
    remainingTasks: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const guestsResponse = await apiGet('/api/v1/guests/list/');
      const vendorsResponse = await apiGet('/api/v1/vendors/list/');
      const tasksResponse = await apiGet('/api/v1/tasks/list/');

      if (!guestsResponse.success || !vendorsResponse.success || !tasksResponse.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      const guests = guestsResponse.data;
      const vendors = vendorsResponse.data;
      const tasks = tasksResponse.data;

      const rsvpd = guests.filter((g: { rsvp_status: string }) => g.rsvp_status === 'confirmed').length;
      const remaining = tasks.filter((t: { is_completed: boolean }) => !t.is_completed).length;

      setStats({
        totalGuests: guests.length,
        guestRSVPd: rsvpd,
        totalVendors: vendors.length,
        remainingTasks: remaining,
      });
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Wedding Planning Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}. Make sure your backend API is running at {process.env.NEXT_PUBLIC_API_URL}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Guests"
                count={stats.totalGuests}
                icon={<PeopleIcon />}
                color="primary.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="RSVPs Accepted"
                count={stats.guestRSVPd}
                icon={<PeopleIcon />}
                color="success.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Vendors"
                count={stats.totalVendors}
                icon={<BusinessIcon />}
                color="error.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Remaining Tasks"
                count={stats.remainingTasks}
                icon={<TaskIcon />}
                color="warning.main"
              />
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4, p: 3, backgroundColor: 'primary.light', borderRadius: 1 }}>
          <Typography variant="body1" color="primary.contrastText">
            ℹ️ Dashboard is loading data from your backend API. Click on Guests, Vendors, or Tasks in the sidebar to view and manage data.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <Dashboard />
    </ProtectedLayout>
  )
}
