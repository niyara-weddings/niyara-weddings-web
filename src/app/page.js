"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Task as TaskIcon,
} from "@mui/icons-material";
import { apiGet } from "@/utils/api";

const StatCard = ({ title, count, icon, color }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", color }}>
            {count !== null ? count : <CircularProgress size={24} />}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.3, fontSize: 40 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalGuests: null,
    guestRSVPd: null,
    totalVendors: null,
    remainingTasks: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [guestsResponse, vendorsResponse, tasksResponse] = await Promise.all([
        apiGet("/api/v1/guests/list/"),
        apiGet("/api/v1/vendors/list/"),
        apiGet("/api/v1/tasks/list/"),
      ]);

      if (!guestsResponse?.ok || !vendorsResponse?.ok || !tasksResponse?.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const guests = await guestsResponse.json();
      const vendors = await vendorsResponse.json();
      const tasks = await tasksResponse.json();

      const rsvpd = guests.filter((g) => g.rsvp_status === "accepted").length;
      const remaining = tasks.filter((t) => !t.completed).length;

      setStats({
        totalGuests: guests.length,
        guestRSVPd: rsvpd,
        totalVendors: vendors.length,
        remainingTasks: remaining,
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Wedding Planning Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}. Make sure your backend API is running and you're logged in.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Guests"
                count={stats.totalGuests}
                icon={<PeopleIcon />}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="RSVPs Accepted"
                count={stats.guestRSVPd}
                icon={<PeopleIcon />}
                color="#388e3c"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Vendors"
                count={stats.totalVendors}
                icon={<BusinessIcon />}
                color="#d32f2f"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Remaining Tasks"
                count={stats.remainingTasks}
                icon={<TaskIcon />}
                color="#f57c00"
              />
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4, p: 3, backgroundColor: "#e3f2fd", borderRadius: 1 }}>
          <Typography variant="body1">
            ℹ️ Dashboard is loading data from your backend API. Click on
            "Guests," "Vendors," or "Tasks" in the sidebar to view and manage
            data.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
