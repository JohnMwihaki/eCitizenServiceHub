import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Place, ArrowForward, FilterList, Refresh } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ServiceRequest, ServiceCategory, RequestStatus, Priority } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';

export const AdminMapPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const defaultCenter: [number, number] = [-0.7210, 37.1520];

  // Fetch Categories
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  // Fetch all requests for map
  const { data: requestsData, isLoading, refetch } = useQuery<{
    requests: ServiceRequest[];
  }>({
    queryKey: ['adminMapRequests'],
    queryFn: async () => {
      const res = await api.get('/requests/admin/all?limit=100');
      return res.data.data;
    },
  });

  const allRequests = requestsData?.requests || [];
  const validMapRequests = allRequests.filter(
    (r) => r.latitude !== null && r.longitude !== null
  );

  const filteredRequests = validMapRequests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && r.categoryId !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    return true;
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
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A' }}>
            Geographic Request Map
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Spatial distribution and hotspot overview of reported community issues across Murang'a County.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => refetch()}
          sx={{ borderColor: '#CBD5E1', color: '#12304A' }}
        >
          Refresh Map Data
        </Button>
      </Box>

      {/* Filters Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2.5, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="ALL">All Statuses</MenuItem>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Category</InputLabel>
              <Select value={categoryFilter} label="Filter by Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                <MenuItem value="ALL">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Priority</InputLabel>
              <Select value={priorityFilter} label="Filter by Priority" onChange={(e) => setPriorityFilter(e.target.value)}>
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Map and Detail Split */}
      <Grid container spacing={3}>
        {/* Main Leaflet Map Surface */}
        <Grid item xs={12} lg={selectedRequest ? 8 : 12}>
          <Box
            sx={{
              height: 600,
              width: '100%',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #CBD5E1',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: '#F8FAFC' }}>
                <CircularProgress sx={{ color: '#0F8B8D' }} />
              </Box>
            ) : (
              <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredRequests.map((r) => {
                  if (!r.latitude || !r.longitude) return null;
                  return (
                    <Marker
                      key={r.id}
                      position={[r.latitude, r.longitude]}
                      eventHandlers={{
                        click: () => setSelectedRequest(r),
                      }}
                    >
                      <Popup>
                        <Box sx={{ p: 0.5, minWidth: 220 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <StatusChip status={r.status} size="small" />
                            <PriorityChip priority={r.priority} size="small" />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#12304A', mb: 0.5 }}>
                            {r.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
                            <Place fontSize="inherit" /> {r.locationName} {r.ward ? `(${r.ward})` : ''}
                          </Typography>
                          <Button
                            component={Link}
                            to={`/admin/requests/${r.id}`}
                            variant="contained"
                            size="small"
                            fullWidth
                            sx={{ bgcolor: '#0F8B8D', color: '#fff', fontSize: '0.72rem', py: 0.5 }}
                          >
                            Open Processing Workspace
                          </Button>
                        </Box>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1 }}>
            Showing {filteredRequests.length} plotted request markers out of {validMapRequests.length} requests with GPS data.
          </Typography>
        </Grid>

        {/* Selected Request Preview Panel */}
        {selectedRequest && (
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #0F8B8D', bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A' }}>
                  {selectedRequest.referenceNumber}
                </Typography>
                <Button size="small" onClick={() => setSelectedRequest(null)} sx={{ color: '#64748B' }}>
                  Close Preview
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StatusChip status={selectedRequest.status} size="small" />
                <PriorityChip priority={selectedRequest.priority} size="small" />
                <Chip label={selectedRequest.category.name} size="small" />
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                {selectedRequest.title}
              </Typography>

              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 2.5 }}>
                {selectedRequest.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Reported By:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {selectedRequest.citizen?.fullName || 'Citizen'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Contact Phone:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {selectedRequest.citizen?.phone || 'Not available'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Location Landmark:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {selectedRequest.locationName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Coordinates:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {selectedRequest.latitude?.toFixed(6)}, {selectedRequest.longitude?.toFixed(6)}
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                to={`/admin/requests/${selectedRequest.id}`}
                variant="contained"
                fullWidth
                endIcon={<ArrowForward />}
                sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
              >
                Go to Request Workspace
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
