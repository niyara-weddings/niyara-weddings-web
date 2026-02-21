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
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Vendors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          color="primary"
        >
          Add Vendor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search vendors by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Budget</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id} hover>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone || 'N/A'}</TableCell>
                <TableCell>KES {Math.round(Number(vendor.quote_price) || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenModal(vendor)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteVendor(vendor.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredVendors.length === 0 && !loading && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            {vendors.length === 0
              ? 'Zero vendors found. While a 100% DIY wedding sounds rustic and charming, do you really want Uncle Bob DJing your reception? Add some pros! 🎧🎂'
              : 'No vendors match your search. They might be ignoring your emails.'}
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
