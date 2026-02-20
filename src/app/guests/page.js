// src/app/guests/page.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AddGuestModal from '@/components/AddGuestModal';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiDelete } from '@/utils/api';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchGuests();
  }, [refreshKey]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const result = await apiGet('/api/v1/guests/list/');
      
      if (result.success) {
        setGuests(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch guests');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) {
      return;
    }

    try {
      const result = await apiDelete(`/api/v1/guests/${guestId}/delete/`);
      
      if (result.success) {
        setRefreshKey((prev) => prev + 1); // Trigger re-fetch
      } else {
        setError(result.error || 'Failed to delete guest');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleOpenModal = (guest = null) => {
    setEditingGuest(guest);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingGuest(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    setRefreshKey((prev) => prev + 1); // Trigger re-fetch
  };

  return (
    <ProtectedLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Guest List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            color="primary"
          >
            Add Guest
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && guests.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>RSVP Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id} hover>
                    <TableCell>{guest.name}</TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>{guest.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            guest.rsvp_status === 'accepted'
                              ? '#c8e6c9'
                              : guest.rsvp_status === 'declined'
                                ? '#ffcdd2'
                                : '#fff9c4',
                          color:
                            guest.rsvp_status === 'accepted'
                              ? '#2e7d32'
                              : guest.rsvp_status === 'declined'
                                ? '#c62828'
                                : '#f57f17',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {guest.rsvp_status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenModal(guest)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteGuest(guest.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {guests.length === 0 && !loading && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
            Your guest list is currently totally empty. Unless you&apos;re planning a secret elopement (highly recommended for the budget), you should probably invite at least your mom! 💌🤐
            </Typography>
          </Box>
        )}

        <AddGuestModal
          open={openModal}
          onClose={handleCloseModal}
          onSuccess={handleSaveSuccess}
          guest={editingGuest}
        />
      </Container>
    </ProtectedLayout>
  );
}
