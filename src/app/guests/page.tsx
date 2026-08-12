// src/app/guests/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
} from '@mui/icons-material';
import AddGuestModal from '@/components/AddGuestModal';
import CustomPagination from '@/components/CustomPagination';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiDelete } from '@/utils/api';
import { Guest } from '@/types';

function GuestDetailRow({ guest, onEdit, onDelete }: { guest: Guest; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'rgba(46, 125, 50, 0.12)', color: '#2e7d32' };
      case 'invited': return { bg: 'rgba(0, 150, 136, 0.12)', color: '#009688' };
      case 'declined': return { bg: 'rgba(211, 47, 47, 0.12)', color: '#d32f2f' };
      case 'maybe': return { bg: 'rgba(237, 108, 2, 0.12)', color: '#ed6c02' };
      default: return { bg: 'rgba(0, 0, 0, 0.08)', color: 'rgba(0, 0, 0, 0.6)' };
    }
  };

  const sc = statusColor(guest.rsvp_status);

  return (
    <>
      <TableRow
        hover
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', '& > *': { borderBottom: open ? 'none' : undefined } }}
      >
        <TableCell sx={{ width: 40, pr: 0 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
            {open ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{guest.name}</TableCell>
        <TableCell>
          <Chip
            label={guest.rsvp_status.toUpperCase()}
            size="small"
            sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 'bold', fontSize: '0.75rem', borderRadius: 1 }}
          />
        </TableCell>
        <TableCell>{guest.plus_one ? 'Yes' : 'No'}</TableCell>
        <TableCell>{guest.email || '-'}</TableCell>
        <TableCell align="right">
          <IconButton onClick={(e) => { e.stopPropagation(); onEdit(); }} color="primary" size="small" sx={{ mr: 1 }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); onDelete(); }} color="error" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{guest.phone || 'Not provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Dietary Restrictions</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{guest.dietary_restrictions || 'None'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Added</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{new Date(guest.created_at).toLocaleDateString()}</Typography>
              </Box>
              {guest.notes && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Notes</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{guest.notes}</Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterRsvp, setFilterRsvp] = useState<string>('');
  const PAGE_SIZE = 15;

  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/v1/guests/list/?page=${page}`;
      if (filterRsvp) {
        url += `&rsvp_status=${filterRsvp}`;
      }
      const result = await apiGet(url);

      if (result.success) {
        const guestData = Array.isArray(result.data) ? result.data : (result.data?.results || result.data || []);
        setGuests(guestData);
        setTotalCount(result.meta?.pagination?.total_items || guestData.length);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch guests');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, filterRsvp]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests, refreshKey]);

  const handleDeleteGuest = async (guestId: number) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) {
      return;
    }

    try {
      const result = await apiDelete(`/api/v1/guests/${guestId}/delete/`);

      if (result.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        setError(result.message || 'Failed to delete guest');
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
    setRefreshKey((prev) => prev + 1);
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="rsvp-filter-label">RSVP Status</InputLabel>
            <Select
              labelId="rsvp-filter-label"
              value={filterRsvp}
              onChange={(e) => { setFilterRsvp(e.target.value); setPage(1); }}
              label="RSVP Status"
            >
              <MenuItem value="">All Guests</MenuItem>
              <MenuItem value="invited">Invited</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="maybe">Maybe</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'center' }}>
            {totalCount} guest{totalCount !== 1 ? 's' : ''} {filterRsvp ? `(${filterRsvp})` : 'total'}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          guests.length > 0 && (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ width: 40 }} />
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Plus One</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {guests.map((guest) => (
                    <GuestDetailRow
                      key={guest.id}
                      guest={guest}
                      onEdit={() => handleOpenModal(guest)}
                      onDelete={() => handleDeleteGuest(guest.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {guests.length === 0 && !loading ? (
          <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#BA3C50' }}>
              {filterRsvp ? `No ${filterRsvp} guests found.` : 'Guest List is empty.'}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center' }}>
              {filterRsvp ? 'Try a different filter or add more guests!' : 'Start adding your loved ones to the celebration!'}
            </Typography>
          </Box>
        ) : totalCount < 10 && (
          <Box sx={{ mt: 6, p: 3, borderLeft: '4px solid #BA3C50', bgcolor: 'rgba(186, 60, 80, 0.05)', borderRadius: '0 8px 8px 0' }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1, color: 'text.primary' }}>
              Unless you&apos;re planning a secret elopement, you should probably invite at least your mom! 💌🤐
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#BA3C50', textTransform: 'uppercase' }}>
              Guest List Wisdom
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
