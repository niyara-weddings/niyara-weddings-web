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
import CustomPagination from '@/components/CustomPagination';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiDelete } from '@/utils/api';
import { Guest } from '@/types';

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchGuests();
  }, [refreshKey, page]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const result = await apiGet(`/api/v1/guests/list/?page=${page}`);

      if (result.success) {
        // Handle both paginated and non-paginated responses for safety
        if (result.data && result.data.results) {
          setGuests(result.data.results);
          setTotalCount(result.data.count);
        } else {
          setGuests(result.data);
          setTotalCount(result.data.length);
        }
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch guests');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: number) => {
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
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleOpenModal = (guest: Guest | null = null) => {
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Guest Manager
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              backgroundColor: '#BA3C50',
              '&:hover': { backgroundColor: '#9a2e40' }
            }}
          >
            Add Guest
          </Button>
        </Box>

        {/* ... error alert ... */}

        {/* ... loading / table ... */}

        {guests.length === 0 && !loading && (
          <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#BA3C50' }}>
              Your Guest Manager is currently totally empty.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left', alignSelf: 'flex-start' }}>
              Unless you&apos;re planning a secret elopement (highly recommended for the budget), you should probably invite at least your mom! 💌🤐
            </Typography>
          </Box>
        )}

        <CustomPagination
          totalItems={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />

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
