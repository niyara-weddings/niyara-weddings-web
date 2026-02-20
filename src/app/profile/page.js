'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button
} from '@mui/material';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiPut, apiPost } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

function ProfilePageContent() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await apiGet('/api/v1/profiles/me/');
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        // If no profile exists, create a default structure
        setProfile({
            groom_name: '',
            bride_name: '',
            wedding_date: '',
            venue: '',
            budget: 0,
        });
        setIsEditing(true); // Go directly into edit mode if no profile exists
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
        // The data to be sent to the backend.
        const profileData = {
            groom_name: profile.groom_name,
            bride_name: profile.bride_name,
            wedding_date: profile.wedding_date,
            venue: profile.venue,
            budget: profile.budget,
        };

        const endpoint = profile.id ? `/api/v1/profiles/me/update/` : `/api/v1/profiles/`;
        const method = profile.id ? apiPut : apiPost;
        const result = await method(endpoint, profileData);

        if (result.success) {
            setIsEditing(false);
            fetchProfile();
        } else {
            setError(result.error || 'Failed to save profile');
        }
    } catch (err) {
        setError(err.message || 'An unexpected error occurred');
    }
  };

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Wedding Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Groom's Name"
                  name="groom_name"
                  value={profile.groom_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bride's Name"
                  name="bride_name"
                  value={profile.bride_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Wedding Date"
                  name="wedding_date"
                  type="date"
                  value={profile.wedding_date ? profile.wedding_date.split('T')[0] : ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Venue"
                  name="venue"
                  value={profile.venue}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget"
                  name="budget"
                  type="number"
                  value={profile.budget}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              {isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <ProfilePageContent />
    </ProtectedLayout>
  );
}
