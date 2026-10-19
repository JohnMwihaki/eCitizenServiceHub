import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Category,
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceCategory } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: categories = [], isLoading, refetch } = useQuery<ServiceCategory[]>({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const res = await api.get('/categories/admin');
      return res.data.data;
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setCode('');
    setDescription('');
    setIsActive(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setCode(cat.code);
    setDescription(cat.description);
    setIsActive(cat.isActive);
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingCategory) {
        await api.put(`/categories/admin/${editingCategory.id}`, {
          name,
          description,
          isActive,
        });
      } else {
        await api.post('/categories/admin', {
          name,
          code,
          description,
          isActive,
        });
      }
    },
    onSuccess: () => {
      setDialogOpen(false);
      setBannerMsg({
        type: 'success',
        text: editingCategory ? 'Category updated successfully.' : 'New category created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      setBannerMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save category.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/categories/admin/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setBannerMsg({
        type: 'success',
        text: data.message || 'Category processed.',
      });
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      setBannerMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete category.',
      });
    },
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A' }}>
            Service Categories
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Configure and maintain county departmental portfolios, service areas, and request categories.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            sx={{ borderColor: '#CBD5E1', color: '#12304A' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
            sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
          >
            Add New Category
          </Button>
        </Stack>
      </Box>

      {bannerMsg && (
        <Alert
          severity={bannerMsg.type}
          onClose={() => setBannerMsg(null)}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {bannerMsg.text}
        </Alert>
      )}

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#0F8B8D' }} />
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' } }}>
                  <TableCell>Category Name</TableCell>
                  <TableCell>System Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Total Requests</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#12304A' }}>
                        {cat.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={cat.code} size="small" sx={{ fontWeight: 700, fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.4 }}>
                        {cat.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F8B8D' }}>
                        {cat._count?.requests ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={cat.isActive ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                        label={cat.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={cat.isActive ? 'success' : 'default'}
                        sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Category">
                        <IconButton size="small" onClick={() => handleOpenEdit(cat)} sx={{ color: '#0284C7' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={cat._count?.requests ? 'Has requests: Deactivates to protect history' : 'Delete Category'}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove or deactivate "${cat.name}"?`)) {
                              deleteMutation.mutate(cat.id);
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add / Edit Category Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#12304A' }}>
          {editingCategory ? 'Edit Service Category' : 'Create New Service Category'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Category Name"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Roads & Transport"
            />

            <TextField
              label="Category Code (Uppercase)"
              required
              fullWidth
              disabled={Boolean(editingCategory)}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ROADS"
              helperText={editingCategory ? 'Code cannot be changed once created' : 'Unique identifier code'}
            />

            <TextField
              label="Detailed Scope Description"
              required
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what problems or services fall into this category..."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Active (Visible to citizens when creating requests)
                </Typography>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!name.trim() || !description.trim() || (!editingCategory && !code.trim()) || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700 }}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
