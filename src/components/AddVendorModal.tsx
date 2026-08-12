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

import { Vendor } from '@/types';

interface AddVendorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendor: Vendor | null;
}

const AddVendorModal = ({ open, onClose, onSuccess, vendor }: AddVendorModalProps) => {
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    category: '',
    contact_person: '',
    email: '',
    phone: '',
    quote_price: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: 'Venue', value: 'venue' },
    { label: 'Catering', value: 'catering' },
    { label: 'Photography', value: 'photography' },
    { label: 'Videography', value: 'videography' },
    { label: 'Music/DJ', value: 'music_dj' },
    { label: 'Decorations', value: 'decorations' },
    { label: 'Flowers', value: 'flowers' },
    { label: 'Attire', value: 'attire' },
    { label: 'Cake', value: 'cake' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        category: vendor.category || '',
        contact_person: vendor.contact_person || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        quote_price: vendor.quote_price ? String(Math.round(Number(vendor.quote_price))) : '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        contact_person: '',
        email: '',
        phone: '',
        quote_price: '',
      });
    }
  }, [vendor, open]);

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
      if (!formData.name || !formData.category || !formData.email || !formData.contact_person || !formData.phone) {
        throw new Error('Name, Category, Contact Person, Email, and Phone are required');
      }

      let result;
      if (vendor) {
        result = await apiPut(`/api/v1/vendors/${vendor.id}/update/`, formData);
      } else {
        result = await apiPost('/api/v1/vendors/', formData);
      }

      if (!result.success) {
        throw new Error(result.message || (vendor ? 'Failed to update vendor' : 'Failed to add vendor'));
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
          {vendor ? 'Edit Vendor' : 'Add New Vendor'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Vendor Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Contact Person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Quote (KES)"
            name="quote_price"
            type="number"
            value={formData.quote_price || ''}
            placeholder="Enter amount"
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#BA3C50',
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#9a2e40' }
              }}
            >
              {loading ? 'Saving...' : vendor ? 'Update Vendor' : 'Add Vendor'}
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

export default AddVendorModal;
