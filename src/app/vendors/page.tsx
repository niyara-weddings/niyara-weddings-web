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
  TextField,
  InputAdornment,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import AddVendorModal from '@/components/AddVendorModal';
import CustomPagination from '@/components/CustomPagination';
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
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 15;

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiGet(`/api/v1/vendors/list/?page=${page}`);

      if (result.success) {
        const vendorData = Array.isArray(result.data) ? result.data : (result.data?.results || result.data || []);
        setVendors(vendorData);
        setTotalCount(result.meta?.pagination?.total_items || vendorData.length);
        setError(null);
      } else {
        setError(result.error || result.message || 'Failed to fetch vendors');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors, refreshKey]);

  const handleDeleteVendor = async (vendorId: number) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      const result = await apiDelete(`/api/v1/vendors/${vendorId}/delete/`);

      if (result.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        setError(result.message || 'Failed to delete vendor');
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search vendors by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {filteredVendors.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Vendor Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quote (KES)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{vendor.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.category.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(186, 60, 80, 0.08)',
                        color: '#BA3C50',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        borderRadius: 1, // Rectangular
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.contact_person}</Typography>
                    <Typography variant="caption" color="textSecondary">{vendor.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vendor.quote_price ? Math.round(Number(vendor.quote_price)).toLocaleString() : '0'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(vendor)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteVendor(vendor.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredVendors.length === 0 && !loading ? (
        <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#BA3C50' }}>
            {vendors.length === 0
              ? 'Vendor List is empty.'
              : 'No vendors match your search.'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center' }}>
            {vendors.length === 0
              ? 'Start adding professional vendors to make your wedding day perfect!'
              : 'Try searching for something else!'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 6, p: 3, borderLeft: '4px solid #BA3C50', bgcolor: 'rgba(186, 60, 80, 0.05)', borderRadius: '0 8px 8px 0' }}>
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1, color: 'text.primary' }}>
            While a 100% DIY wedding sounds charming, do you really want Uncle Bob DJing your reception? Add some pros! 🎧🎂
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#BA3C50', textTransform: 'uppercase' }}>
            Supplier Strategy
          </Typography>
        </Box>
      )}

      <CustomPagination
        totalItems={totalCount}
        pageSize={PAGE_SIZE}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />

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
