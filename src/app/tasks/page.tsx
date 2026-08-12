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
  Chip,
  Checkbox,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import AddTaskModal from '@/components/AddTaskModal';
import CustomPagination from '@/components/CustomPagination';
import ProtectedLayout from '@/components/ProtectedLayout';
import { apiGet, apiDelete, apiPatch } from '@/utils/api';
import { Task } from '@/types';

function TaskDetailRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const priorityStyle = (p: string) => {
    switch (p) {
      case 'high': return { bg: 'rgba(198, 40, 40, 0.08)', color: 'rgb(198, 40, 40)' };
      case 'medium': return { bg: 'rgba(21, 101, 192, 0.08)', color: '#1565c0' };
      default: return { bg: 'rgba(0, 150, 136, 0.08)', color: '#009688' };
    }
  };
  const ps = priorityStyle(task.priority);

  return (
    <>
      <TableRow
        hover
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', opacity: task.is_completed ? 0.6 : 1, '& > *': { borderBottom: open ? 'none' : undefined } }}
      >
        <TableCell padding="checkbox">
          <Tooltip title={task.is_completed ? 'Mark as not done' : 'Click to mark as done'} arrow placement="top">
            <Checkbox
              checked={task.is_completed}
              onChange={(e) => { e.stopPropagation(); onToggle(); }}
              onClick={(e) => e.stopPropagation()}
              sx={{ color: '#BA3C50', '&.Mui-checked': { color: '#2e7d32' } }}
            />
          </Tooltip>
        </TableCell>
        <TableCell sx={{ width: 40, pr: 0 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
            {open ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500, textDecoration: task.is_completed ? 'line-through' : 'none' }}>
            {task.title}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip label={task.priority.toUpperCase()} size="small" sx={{ bgcolor: ps.bg, color: ps.color, fontWeight: 'bold', fontSize: '0.75rem', borderRadius: 1 }} />
        </TableCell>
        <TableCell>
          <Chip label={task.assigned_to.toUpperCase()} size="small" sx={{ bgcolor: 'rgba(186, 60, 80, 0.08)', color: '#BA3C50', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: 1 }} />
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
          </Typography>
        </TableCell>
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
        <TableCell colSpan={7} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2.5, px: 3, bgcolor: 'rgba(186, 60, 80, 0.03)', borderRadius: 1, my: 1 }}>
              {task.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>Description</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>{task.description}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>Status</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    {task.is_completed && <CheckCircleIcon sx={{ fontSize: 16, color: '#2e7d32' }} />}
                    <Typography variant="body2" sx={{ fontWeight: 500, color: task.is_completed ? '#2e7d32' : '#ed6c02' }}>
                      {task.is_completed ? 'Done' : 'Pending'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>Created</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>{new Date(task.created_at).toLocaleDateString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>Updated</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>{new Date(task.updated_at).toLocaleDateString()}</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function TasksPageContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const PAGE_SIZE = 15;

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/v1/tasks/list/?page=${page}`;
      if (filterAssignedTo) {
        url += `&assigned_to=${filterAssignedTo}`;
      }
      if (filterStatus) {
        url += `&completed=${filterStatus}`;
      }
      const result = await apiGet(url);

      if (result.success) {
        const taskData = Array.isArray(result.data) ? result.data : (result.data?.results || result.data || []);
        // Sort tasks: completed at bottom
        const sortedTasks = [...taskData].sort((a: Task, b: Task) =>
          Number(a.is_completed) - Number(b.is_completed)
        );
        setTasks(sortedTasks);
        setTotalCount(result.meta?.pagination?.total_items || taskData.length);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, filterAssignedTo, filterStatus]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshKey]);

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      const result = await apiPatch(`/api/v1/tasks/${taskId}/toggle/`, { completed: !completed });

      if (result.success) {
        const taskName = tasks.find(t => t.id === taskId)?.title || 'Task';
        setSnackbar({
          open: true,
          message: !completed
            ? `✅ "${taskName}" marked as done! Moved to the bottom.`
            : `↩️ "${taskName}" marked as not done.`,
        });
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={filterAssignedTo}
              onChange={(e) => { setFilterAssignedTo(e.target.value); setPage(1); }}
              label="Assigned To"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="bride">Bride</MenuItem>
              <MenuItem value="groom">Groom</MenuItem>
              <MenuItem value="couple">Couple</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="false">Pending</MenuItem>
              <MenuItem value="true">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Overall Progress ({Math.round((completedCount / (pageTaskCount || 1)) * 100)}%)
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(completedCount / (pageTaskCount || 1)) * 100}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: 'rgba(46, 125, 50, 0.12)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#2e7d32',
              borderRadius: 5,
              transition: 'transform 0.6s ease',
            }
          }}
        />
      </Box>

      {tasks.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell sx={{ width: 40 }} />
                <TableCell sx={{ fontWeight: 'bold' }}>Task Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TaskDetailRow
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleTask(task.id, task.is_completed)}
                  onEdit={() => handleOpenModal(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tasks.length === 0 && !loading ? (
        <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#BA3C50' }}>
            No tasks yet!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center' }}>
            Start adding tasks to get your wedding planning on track!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 6, p: 3, borderLeft: '4px solid #BA3C50', bgcolor: 'rgba(186, 60, 80, 0.05)', borderRadius: '0 8px 8px 0' }}>
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1, color: 'text.primary' }}>
            Either you&apos;re incredibly organized, or you&apos;re about to experience a wedding-induced panic attack. Let&apos;s get scheduling before the in-laws start asking questions! 📝🏃‍♀️
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#BA3C50', textTransform: 'uppercase' }}>
            Action Plan Kickstart
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: '#2e7d32',
            color: '#fff',
            fontWeight: 500,
            borderRadius: 2,
            fontSize: '0.9rem',
          }
        }}
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
