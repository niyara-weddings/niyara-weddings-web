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
  Chip,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AddTaskModal from '@/components/AddTaskModal';
import CustomPagination from '@/components/CustomPagination';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiPost, apiDelete, apiPatch } from '@/utils/api';
import { Task } from '@/types';

function TasksPageContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchTasks();
  }, [refreshKey, page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await apiGet(`/api/v1/tasks/list/?page=${page}`);

      if (result.success) {
        if (result.data && result.data.results) {
          setTasks(result.data.results);
          setTotalCount(result.data.count);
        } else {
          setTasks(result.data);
          setTotalCount(result.data.length);
        }
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      const result = await apiPatch(`/api/v1/tasks/${taskId}/toggle/`, { completed: !completed });

      if (result.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        setError(result.message || 'Failed to toggle task');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const result = await apiDelete(`/api/v1/tasks/${taskId}/delete/`);

      if (result.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        setError(result.message || 'Failed to delete task');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingTask(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    setRefreshKey((prev) => prev + 1);
  };

  if (loading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const completedCount = tasks.filter((t) => t.is_completed).length;
  // Local page count for progress bar on current page
  const pageTaskCount = tasks.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Action Plan
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {completedCount} of {pageTaskCount} tasks in this page completed (Total: {totalCount})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{
            backgroundColor: '#BA3C50',
            '&:hover': { backgroundColor: '#9a2e40' }
          }}
        >
          Add Task
        </Button>
      </Box>

      {/* ... error alert / progress bar ... */}

      {/* ... table ... */}

      {tasks.length === 0 && !loading && (
        <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#BA3C50' }}>
            No tasks yet!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'left', alignSelf: 'flex-start' }}>
            Either you&apos;re incredibly organized, or you&apos;re about to experience a wedding-induced panic attack. Let&apos;s get scheduling before the in-laws start asking questions! 📝🏃‍♀️
          </Typography>
        </Box>
      )}

      <CustomPagination
        totalItems={totalCount}
        pageSize={PAGE_SIZE}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <AddTaskModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={handleSaveSuccess}
        task={editingTask}
      />
    </Container>
  );
}

export default function TasksPage() {
  return (
    <ProtectedLayout>
      <TasksPageContent />
    </ProtectedLayout>
  );
}
