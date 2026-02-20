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
import { apiGet, apiPut, apiPost } from '@/utils/api';
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Wedding Profile
        </Typography>

        {profile && (
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProfileImageUpload
              currentImage={profile.profile_image}
              onUploadSuccess={(newUrl) => {
                setProfile((prev: any) => ({ ...prev, profile_image: newUrl }));
                refreshUser(); // Update global user state for header avatar
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
          <Card>
            <CardContent>
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
                    label="Budget"
                    name="budget"
                    type="number"
                    value={profile.budget || 0}
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
