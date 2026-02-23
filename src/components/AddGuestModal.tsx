'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { apiPost, apiPut } from '@/utils/api';

import { Guest } from '@/types';

interface AddGuestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  guest: Guest | null;
}

const AddGuestModal = ({ open, onClose, onSuccess, guest }: AddGuestModalProps) => {
  const [formData, setFormData] = useState<Partial<Guest>>({
    name: '',
    email: '',
    phone: '',
    rsvp_status: 'invited',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || '',
        email: guest.email || '',
        phone: guest.phone || '',
        rsvp_status: guest.rsvp_status || 'invited',
      });
    } else {
      setFormData({ name: '', email: '', phone: '', rsvp_status: 'invited' });
    }
  }, [guest, open]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name) {
        throw new Error('Guest name is required');
      }

      let result;
      if (guest) {
        result = await apiPut(`/api/v1/guests/${guest.id}/update/`, formData);
      } else {
        result = await apiPost('/api/v1/guests/', formData);
      }

      if (!result.success) {
        throw new Error(result.message || (guest ? 'Failed to update guest' : 'Failed to add guest'));
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      disableRestoreFocus
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {guest ? 'Edit Guest' : 'Add New Guest'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email (Optional)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>RSVP Status</InputLabel>
            <Select
              name="rsvp_status"
              value={formData.rsvp_status}
              onChange={handleChange}
              label="RSVP Status"
            >
              <MenuItem value="invited">Invited</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="maybe">Maybe</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#BA3C50',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#9a2e40' }
              }}
            >
              {loading ? 'Saving...' : guest ? 'Update Guest' : 'Add Guest'}
            </Button>
            <Button variant="outlined" fullWidth onClick={onClose} sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddGuestModal;
