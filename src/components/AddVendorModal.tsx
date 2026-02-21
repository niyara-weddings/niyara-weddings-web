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
    email: '',
    phone: '',
    quote_price: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: 'Catering', value: 'catering' },
    { label: 'Photography', value: 'photography' },
    { label: 'Videography', value: 'videography' },
    { label: 'Venue', value: 'venue' },
    { label: 'Decorations', value: 'decorations' },
    { label: 'Music/DJ', value: 'music_dj' },
    { label: 'Flowers', value: 'flowers' },
    { label: 'Cake', value: 'cake' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    if (vendor) {
      setFormData(vendor);
    } else {
      setFormData({
        name: '',
        category: '',
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!formData.name || !formData.category || !formData.email) {
        throw new Error('Name, Category, and Email are required');
      }

      let response;
      if (vendor) {
        response = await fetch(`${apiUrl}/api/v1/vendors/${vendor.id}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        });
      } else {
        response = await fetch(`${apiUrl}/api/v1/vendors/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        });
      }

      if (!response.ok) {
        throw new Error(vendor ? 'Failed to update vendor' : 'Failed to add vendor');
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
          backgroundColor: 'white',
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
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Quote Price"
            name="quote_price"
            type="number"
            value={formData.quote_price}
            onChange={handleChange}
            margin="normal"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: '#d4af37', color: '#1a1a1a', '&:hover': { backgroundColor: '#b8962e' } }}
            >
              {loading ? 'Saving...' : vendor ? 'Update Vendor' : 'Add Vendor'}
            </Button>
            <Button variant="outlined" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddVendorModal;
