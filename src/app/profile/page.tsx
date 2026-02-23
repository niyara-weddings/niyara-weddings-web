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
import ProfileImageUpload from '@/components/ProfileImageUpload';
import { apiGet, apiPut, apiPost, apiPatch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

function ProfilePageContent() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setProfile({
          groom_name: '',
          bride_name: '',
          wedding_date: '',
          venue: '',
          budget: '',
        });
        setIsEditing(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      // Only send fields that have values to avoid triggering validators on empty fields
      const profileData: Record<string, any> = {};
      if (profile.groom_name) profileData.groom_name = profile.groom_name;
      if (profile.bride_name) profileData.bride_name = profile.bride_name;
      if (profile.wedding_date) profileData.wedding_date = profile.wedding_date;
      if (profile.venue) profileData.venue = profile.venue;
      if (profile.budget && Number(profile.budget) > 0) {
        profileData.budget = Math.round(Number(profile.budget));
      }

      let result;
      if (profile.id) {
        // Use PATCH so only provided fields are validated
        result = await apiPatch(`/api/v1/profiles/me/update/`, profileData);
      } else {
        result = await apiPost(`/api/v1/profiles/`, profileData);
      }

      if (result.success) {
        setIsEditing(false);
        fetchProfile();
      } else {
        setError(result.message || 'Failed to save profile');
      }
    } catch (err: any) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
          Wedding Canvas
        </Typography>

        {profile && (
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProfileImageUpload
              currentImage={profile.profile_image}
              onUploadSuccess={(newUrl) => {
                setProfile((prev: any) => ({ ...prev, profile_image: newUrl }));
                refreshUser();
              }}
              onError={(msg) => setError(msg)}
            />
            {!isEditing && (profile.bride_name || profile.groom_name) && (
              <Typography variant="h6" sx={{ mt: 1 }}>
                {profile.bride_name}{profile.bride_name && profile.groom_name ? ' & ' : ''}{profile.groom_name}
              </Typography>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {error}
          </Alert>
        )}

        {profile && (
          <Card sx={{
            borderRadius: '24px',
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.05)',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
            backgroundImage: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))'
              : 'none'
          }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Groom's Name"
                    name="groom_name"
                    value={profile.groom_name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Bride's Name"
                    name="bride_name"
                    value={profile.bride_name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Venue"
                    name="venue"
                    value={profile.venue || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Budget (KES)"
                    name="budget"
                    type="number"
                    value={profile.budget ? Math.round(Number(profile.budget)) : ''}
                    placeholder="Min 50,000 KES"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                {isEditing ? (
                  <>
                    <Button onClick={() => setIsEditing(false)} sx={{ mr: 1, color: '#433B5C' }}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#BA3C50', '&:hover': { backgroundColor: '#9a2e40' } }}>
                      Save Settings
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ backgroundColor: '#BA3C50', '&:hover': { backgroundColor: '#9a2e40' } }}>
                    Edit Canvas
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
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
