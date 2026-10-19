import React, { useState } from 'react';
import {
  Box,
  Container,
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
  Card,
  CardContent,
} from '@mui/material';
import {
  AddCircleOutline,
  Search,
  FilterList,
  Assignment,
  ArrowForward,
} from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceRequest, ServiceCategory, RequestStatus } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';

export const CitizenRequestsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'ALL');

  // Categories for filter
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  // Query Requests
  const { data, isLoading } = useQuery<{
    requests: ServiceRequest[];
    pagination: { total: number; page: number; pageSize: number; totalPages: number };
  }>({
    queryKey: ['myRequests', page, status, category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (status !== 'ALL') params.append('status', status);
      if (category !== 'ALL') params.append('category', category);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/requests/my?${params.toString()}`);
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

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 5 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A' }}>
              My Requests & Reports
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Monitor and view status histories for all services and issues you submitted.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/requests/new"
            variant="contained"
            startIcon={<AddCircleOutline />}
            sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
          >
            New Request
          </Button>
        </Box>

        {/* Filters Bar */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search reference (e.g. CSR-2026) or title..."
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

            <Grid item xs={6} sm={4} md={3.5}>
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
                  {statuses.map((st) => (
                    <MenuItem key={st} value={st}>
                      {st.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4} md={3.5}>
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
          </Grid>
        </Paper>

        {/* List */}
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#0F8B8D' }} />
            </Box>
          ) : (!data?.requests || data.requests.length === 0) ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 52, color: '#CBD5E1', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#475569', fontWeight: 700 }}>
                No requests found matching your filter criteria.
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                Try adjusting your search terms or submit a new service report.
              </Typography>
              <Button
                component={Link}
                to="/requests/new"
                variant="contained"
                sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700 }}
              >
                Create Request
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 750 }}>
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' } }}>
                      <TableCell>Reference Number</TableCell>
                      <TableCell>Title & Location</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Date Logged</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.requests.map((r) => (
                      <TableRow key={r.id} hover sx={{ '& td': { py: 2 } }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#12304A' }}>
                            {r.referenceNumber}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {r.requestType === 'COMMUNITY_ISSUE' ? 'Community Issue' : 'Service Request'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }} noWrap>
                            {r.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {r.locationName} {r.ward ? `(${r.ward})` : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={r.category.name} size="small" sx={{ fontSize: '0.72rem', height: 22 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={r.status} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            to={`/requests/${r.id}`}
                            variant="outlined"
                            size="small"
                            endIcon={<ArrowForward fontSize="small" />}
                            sx={{
                              color: '#12304A',
                              borderColor: '#CBD5E1',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              '&:hover': { borderColor: '#0F8B8D', color: '#0F8B8D' },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
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
      </Container>
    </Box>
  );
};
