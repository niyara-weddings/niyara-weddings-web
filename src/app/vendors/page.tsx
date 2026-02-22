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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import AddVendorModal from '@/components/AddVendorModal';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiDelete } from '@/utils/api';
import { Vendor } from '@/types';

function VendorsPageContent() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchVendors();
  }, [refreshKey]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const result = await apiGet('/api/v1/vendors/list/');

      if (result.success) {
        setVendors(result.data);
        setError(null);
      } else {
        setError(result.error || result.message || 'Failed to fetch vendors');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: number) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      const result = await apiDelete(`/api/v1/vendors/${vendorId}/delete/`);

      if (result.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        setError(result.error || result.message || 'Failed to delete vendor');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleOpenModal = (vendor: Vendor | null = null) => {
    setEditingVendor(vendor);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingVendor(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    setRefreshKey((prev) => prev + 1);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && vendors.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Vendors
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
          Add Vendor
        </Button>
      </Box>

      {/* ... error alert / search field ... */}

      {/* ... table ... */}

      {filteredVendors.length === 0 && !loading && (
        <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#BA3C50' }}>
            {vendors.length === 0
              ? 'Zero vendors found.'
              : 'No vendors match your search.'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left', alignSelf: 'flex-start' }}>
            {vendors.length === 0
              ? 'While a 100% DIY wedding sounds rustic and charming, do you really want Uncle Bob DJing your reception? Add some pros! 🎧🎂'
              : 'They might be ignoring your emails. Try searching for something else!'}
          </Typography>
        </Box>
      )}

      <AddVendorModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={handleSaveSuccess}
        vendor={editingVendor}
      />
    </Container>
  );
}

export default function VendorsPage() {
  return (
    <ProtectedLayout>
      <VendorsPageContent />
    </ProtectedLayout>
  );
}
