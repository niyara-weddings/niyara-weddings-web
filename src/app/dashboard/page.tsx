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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as BudgetIcon,
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
  const [stats, setStats] = useState<{
    totalGuests: number | null;
    guestRSVPd: number | null;
    totalVendors: number | null;
    remainingTasks: number | null;
    completedTasks: number | null;
  }>({
    totalGuests: null,
    guestRSVPd: null,
    totalVendors: null,
    remainingTasks: null,
    completedTasks: null,
  });
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [guestsRes, vendorsRes, tasksRes, progressRes] = await Promise.all([
        apiGet('/api/v1/guests/list/'),
        apiGet('/api/v1/vendors/list/'),
        apiGet('/api/v1/tasks/list/'),
        apiGet('/api/v1/profiles/progress/')
      ]);

      if (!guestsRes.success || !vendorsRes.success || !tasksRes.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      const guests = guestsRes.data;
      const vendors = vendorsRes.data;
      const tasks = tasksRes.data;

      const rsvpd = guests.filter((g: { rsvp_status: string }) => g.rsvp_status === 'confirmed').length;
      const completed = tasks.filter((t: { is_completed: boolean }) => t.is_completed).length;
      const remaining = tasks.length - completed;

      setStats({
        totalGuests: guests.length,
        guestRSVPd: rsvpd,
        totalVendors: vendors.length,
        remainingTasks: remaining,
        completedTasks: completed,
      });

      if (progressRes.success) {
        setProgress(progressRes.data);
      }

      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          The Planning Storyboard
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
          <>
            {/* Top Row: Quick Stats (Full Width) */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard
                  title="Total Guests"
                  count={stats.totalGuests}
                  icon={<PeopleIcon />}
                  color="primary.main"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard
                  title="RSVPs Accepted"
                  count={stats.guestRSVPd}
                  icon={<PeopleIcon />}
                  color="info.main"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard
                  title="Total Vendors"
                  count={stats.totalVendors}
                  icon={<BusinessIcon />}
                  color="error.main"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard
                  title="Remaining Tasks"
                  count={stats.remainingTasks}
                  icon={<TaskIcon />}
                  color="warning.main"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <StatCard
                  title="Tasks Completed"
                  count={stats.completedTasks}
                  icon={<TaskIcon />}
                  color="success.main"
                />
              </Grid>
            </Grid>

            {/* Bottom Row: Intelligence Cards (Equal Height) */}
            <Grid container spacing={3} alignItems="stretch">
              {/* Left Column: Dynamic Milestones */}
              <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex' }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Action Plan Milestones
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {progress?.next_milestones?.length > 0 ? (
                      <List>
                        {progress.next_milestones.map((milestone: string, index: number) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary={milestone}
                              primaryTypographyProps={{ fontWeight: 500 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                          No immediate milestones.
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
                          Relax and have some chai! You've officially earned a break. ☕️
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Column: Readiness Score */}
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <CardContent sx={{ textAlign: 'center', width: '100%', flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Wedding Readiness
                    </Typography>

                    {/* USP Badge: Planning Phase */}
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        label={progress?.overall_progress > 70 ? "Final Stretch" : progress?.overall_progress > 30 ? "Selection Phase" : "Research Phase"}
                        color="secondary"
                        size="small"
                        sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}
                      />
                    </Box>

                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={160}
                        thickness={4}
                        sx={{ color: 'grey.200' }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={progress?.overall_progress || 0}
                        size={160}
                        thickness={4}
                        sx={{
                          color: 'primary.main',
                          position: 'absolute',
                          left: 0,
                          transition: 'all 0.5s ease'
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h3" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
                          {`${progress?.overall_progress || 0}%`}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 4, px: 2 }}>
                      Weighted score: {progress?.overall_progress > 50 ? "You're on top of things!" : "Time to dive in."}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ px: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">Budget Pulse</Typography>
                        <Typography variant="body2">
                          KES {Math.round(progress?.budget_used || 0).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8, mb: 2 }}>
                        <Box
                          sx={{
                            width: `${progress?.total_budget ? (progress.budget_used / progress.total_budget) * 100 : 0}%`,
                            bgcolor: 'secondary.main',
                            height: '100%',
                            borderRadius: 1
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Countdown</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          {progress?.days_remaining || 0} Days to go
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Restored Humor/Quotes Section */}
            <Box sx={{ mt: 6, p: 3, borderLeft: '4px solid #BA3C50', bgcolor: 'rgba(186, 60, 80, 0.05)', borderRadius: '0 8px 8px 0' }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1, color: 'text.primary' }}>
                &quot;Your dashboard is ready! Now let&apos;s start clicking around the sidebar before your partner realizes you haven&apos;t planned a single thing. 💍😅&quot;
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#BA3C50', textTransform: 'uppercase' }}>
                Plan wisely, party harder.
              </Typography>
            </Box>
          </>
        )}

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
