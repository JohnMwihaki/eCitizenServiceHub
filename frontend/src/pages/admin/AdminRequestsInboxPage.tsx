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
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  FilterList,
  ArrowForward,
  Assignment,
  Refresh,
} from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceRequest, ServiceCategory, RequestStatus, Priority } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';

export const AdminRequestsInboxPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'ALL');
  const [priority, setPriority] = useState<string>(searchParams.get('priority') || 'ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  // Categories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  // Query All Requests
  const { data, isLoading, refetch } = useQuery<{
    requests: ServiceRequest[];
    pagination: { total: number; page: number; pageSize: number; totalPages: number };
  }>({
    queryKey: ['adminRequests', page, status, category, priority, search, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '15');
      if (status !== 'ALL') params.append('status', status);
      if (category !== 'ALL') params.append('category', category);
      if (priority !== 'ALL') params.append('priority', priority);
      if (search.trim()) params.append('search', search.trim());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/requests/admin/all?${params.toString()}`);
      return res.data.data;
    },
  });

  const statuses: RequestStatus[] = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'IN_PROGRESS',
    'AWAITING_CITIZEN',
    'ON_HOLD',
    'RESOLVED',
    'CLOSED',
    'REJECTED',
    'REOPENED',
  ];

  const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A' }}>
            Request Inbox
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Review, categorize, prioritize, process, and resolve submitted citizen requests.
          </Typography>
        </Box>
        <Tooltip title="Refresh Inbox">
          <IconButton onClick={() => refetch()} sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search reference, title, description, citizen name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: <Search sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={4} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#0F8B8D' }} />
          </Box>
        ) : (!data?.requests || data.requests.length === 0) ? (
          <Box sx={{ p: 8, textAlign: 'center', color: '#64748B' }}>
            <Assignment sx={{ fontSize: 48, color: '#CBD5E1', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No requests found matching your filter criteria.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 850 }}>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' } }}>
                    <TableCell>Reference</TableCell>
                    <TableCell>Title & Citizen</TableCell>
                    <TableCell>Category & Area</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.requests.map((r) => (
                    <TableRow key={r.id} hover sx={{ '& td': { py: 1.8 } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#12304A' }}>
                          {r.referenceNumber}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          {r.requestType === 'COMMUNITY_ISSUE' ? 'Issue' : 'Service'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }} noWrap>
                          {r.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Citizen: <strong>{r.citizen?.fullName}</strong> ({r.citizen?.phone || r.citizen?.email})
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={r.category.name} size="small" sx={{ fontSize: '0.7rem', height: 20, mb: 0.4 }} />
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                          {r.locationName} {r.ward ? `(${r.ward})` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <PriorityChip priority={r.priority} size="small" />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={r.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          to={`/admin/requests/${r.id}`}
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: '#12304A',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            '&:hover': { bgcolor: '#0F8B8D' },
                          }}
                        >
                          Workspace
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {data.pagination.totalPages > 1 && (
              <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'center', borderTop: '1px solid #E2E8F0' }}>
                <Pagination
                  count={data.pagination.totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};
