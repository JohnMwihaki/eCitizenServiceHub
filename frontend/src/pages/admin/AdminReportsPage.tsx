import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  CircularProgress,
  Stack,
  Rating,
} from '@mui/material';
import {
  FileDownload,
  FilterList,
  Assessment,
  Speed,
  ThumbUp,
  CheckCircle,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceRequest, ServiceCategory, RequestStatus } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';

export const AdminReportsPage: React.FC = () => {
  const [status, setStatus] = useState<string>('ALL');
  const [categoryId, setCategoryId] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Categories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  // Query Reports
  const { data, isLoading } = useQuery<{
    total: number;
    requests: ServiceRequest[];
  }>({
    queryKey: ['adminReports', status, categoryId, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status !== 'ALL') params.append('status', status);
      if (categoryId !== 'ALL') params.append('categoryId', categoryId);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const res = await api.get(`/dashboard/reports?${params.toString()}`);
      return res.data.data;
    },
  });

  const requests = data?.requests || [];
  const resolvedCount = requests.filter((r) => r.status === 'RESOLVED' || r.status === 'CLOSED').length;
  const resolutionRate = requests.length > 0 ? Math.round((resolvedCount / requests.length) * 100) : 0;

  // Real average rating
  const ratings = requests.filter((r) => r.feedback?.rating).map((r) => r.feedback!.rating);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  // Real average resolution hours
  const resolvedWithTimes = requests.filter((r) => r.resolvedAt);
  const avgHours =
    resolvedWithTimes.length > 0
      ? (
          resolvedWithTimes.reduce((acc, curr) => {
            const diffMs = new Date(curr.resolvedAt!).getTime() - new Date(curr.createdAt).getTime();
            return acc + diffMs / (1000 * 60 * 60);
          }, 0) / resolvedWithTimes.length
        ).toFixed(1)
      : null;

  const handleDownloadCsv = () => {
    const token = localStorage.getItem('ecitizen_token');
    const params = new URLSearchParams();
    params.append('format', 'csv');
    if (status !== 'ALL') params.append('status', status);
    if (categoryId !== 'ALL') params.append('categoryId', categoryId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    window.open(`/api/dashboard/reports?${params.toString()}`, '_blank');
  };

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
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A' }}>
            Operational Reports & Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Accountability metrics, resolution times, citizen feedback aggregates, and CSV export.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FileDownload />}
          onClick={handleDownloadCsv}
          sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
        >
          Export CSV Report
        </Button>
      </Box>

      {/* Filter Ribbon */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 2.5, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="ALL">All Statuses</MenuItem>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={categoryId} label="Category" onChange={(e) => setCategoryId(e.target.value)}>
                <MenuItem value="ALL">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="From Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="To Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Top Summary KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
              Total Requests Filtered
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#12304A', my: 0.5 }}>
              {requests.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Matching active criteria
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#15803D' }}>
              Resolution Rate
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#15803D', my: 0.5 }}>
              {resolutionRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {resolvedCount} resolved out of {requests.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F8B8D' }}>
              Avg Resolution Time
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F8B8D', my: 0.5 }}>
              {avgHours !== null ? `${avgHours}h` : 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              From submission to resolution
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#D97706' }}>
              Satisfaction Score
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#D97706', my: 0.5 }}>
              {avgRating !== null ? `${avgRating} / 5` : 'No ratings'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ratings.length} citizen feedback ratings
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#0F8B8D' }} />
          </Box>
        ) : requests.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#64748B' }}>
            <Assessment sx={{ fontSize: 44, color: '#CBD5E1', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No service records found for the selected filter range.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' } }}>
                  <TableCell>Ref Number</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Citizen</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Resolved</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#12304A' }}>
                        {r.referenceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{r.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>{r.locationName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={r.category.name} size="small" sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={r.status} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{r.citizen?.fullName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#475569' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: r.resolvedAt ? '#15803D' : '#94A3B8', fontWeight: r.resolvedAt ? 700 : 400 }}>
                        {r.resolvedAt ? new Date(r.resolvedAt).toLocaleDateString() : 'Pending'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {r.feedback ? (
                        <Rating value={r.feedback.rating} readOnly size="small" />
                      ) : (
                        <Typography variant="caption" color="text.secondary">None</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};
