import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Rating,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Place,
  Person,
  Phone,
  Email,
  CalendarToday,
  CheckCircle,
  HighlightOff,
  HelpOutline,
  Build,
  Send,
  Lock,
  Public,
  Replay,
  AttachFile,
  Download,
  PauseCircle,
  Navigation,
  ContentCopy,
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import api from '../../api/client';
import { ServiceRequest, ServiceCategory, RequestStatus, Priority } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { TimelineView } from '../../components/TimelineView';

export const AdminRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tab State for Update Composer 
  const [updateTab, setUpdateTab] = useState(0);
  const [updateMessage, setUpdateMessage] = useState('');

  // Modals State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<RequestStatus>('IN_PROGRESS');
  const [statusReason, setStatusReason] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState('');

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [requestInfoModalOpen, setRequestInfoModalOpen] = useState(false);
  const [infoQuestion, setInfoQuestion] = useState('');

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch Request
  const { data: request, isLoading, error } = useQuery<ServiceRequest>({
    queryKey: ['adminRequestDetail', id],
    queryFn: async () => {
      const res = await api.get(`/requests/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });

  // Fetch Categories for re-categorization
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  // Helper: Invalidate and refresh
  const handleSuccess = (msg: string) => {
    setActionSuccess(msg);
    setActionError(null);
    queryClient.invalidateQueries({ queryKey: ['adminRequestDetail', id] });
    queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
  };

  // Category & Priority Mutation
  const updateCategoryPriorityMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/requests/admin/${id}/category-priority`, {
        categoryId: newCategoryId || undefined,
        priority: newPriority,
      });
    },
    onSuccess: () => {
      setCategoryModalOpen(false);
      handleSuccess('Category and priority updated successfully.');
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to update category or priority.');
    },
  });

  //  Status Transition Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/requests/admin/${id}/status`, {
        status: selectedNextStatus,
        reason: statusReason || undefined,
        notes: statusNotes || undefined,
      });
    },
    onSuccess: () => {
      setStatusModalOpen(false);
      setStatusReason('');
      setStatusNotes('');
      handleSuccess(`Status successfully moved to ${selectedNextStatus}.`);
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to transition status.');
    },
  });

  // Add Update or Internal Note Mutation
  const addUpdateMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/admin/${id}/updates`, {
        message: updateMessage,
        isInternal: updateTab === 1,
      });
    },
    onSuccess: () => {
      setUpdateMessage('');
      handleSuccess(updateTab === 1 ? 'Private internal note recorded.' : 'Public update published to citizen.');
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to record update.');
    },
  });

  //  Request Info Mutation
  const requestInfoMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/admin/${id}/request-info`, {
        question: infoQuestion,
      });
    },
    onSuccess: () => {
      setRequestInfoModalOpen(false);
      setInfoQuestion('');
      handleSuccess('Additional information requested from citizen.');
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to send information request.');
    },
  });

  //  Resolve Request Mutation
  const resolveMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/admin/${id}/resolve`, {
        resolutionDetails,
      });
    },
    onSuccess: () => {
      setResolveModalOpen(false);
      setResolutionDetails('');
      handleSuccess('Request marked as RESOLVED. Citizen notified.');
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to resolve request.');
    },
  });

  //  Reject Request Mutation
  const rejectMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/admin/${id}/reject`, {
        reason: rejectionReason,
      });
    },
    onSuccess: () => {
      setRejectModalOpen(false);
      setRejectionReason('');
      handleSuccess('Request rejected with explanation.');
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to reject request.');
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#0F8B8D' }} />
      </Box>
    );
  }

  if (error || !request) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Request not found.</Alert>
        <Button component={Link} to="/admin/requests" sx={{ mt: 2 }} startIcon={<ArrowBack />}>
          Back to Inbox
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Breadcrumb & Actions Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Button
          component={Link}
          to="/admin/requests"
          startIcon={<ArrowBack />}
          sx={{ color: '#64748B', fontWeight: 600 }}
        >
          Back to Request Inbox
        </Button>

        {/* Action Buttons Toolbar */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button
            variant="outlined"
            onClick={() => {
              setNewCategoryId(request.categoryId);
              setNewPriority(request.priority);
              setCategoryModalOpen(true);
            }}
            sx={{ borderColor: '#CBD5E1', color: '#12304A', fontWeight: 700 }}
          >
            Adjust Category / Priority
          </Button>

          {request.status !== 'RESOLVED' && request.status !== 'CLOSED' && request.status !== 'REJECTED' && (
            <>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<HelpOutline />}
                onClick={() => setRequestInfoModalOpen(true)}
                sx={{ fontWeight: 700 }}
              >
                Request Citizen Info
              </Button>

              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={() => setResolveModalOpen(true)}
                sx={{ bgcolor: '#238636', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#1a6328' } }}
              >
                Resolve Request
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<HighlightOff />}
                onClick={() => setRejectModalOpen(true)}
                sx={{ fontWeight: 700 }}
              >
                Reject Request
              </Button>
            </>
          )}

          <Button
            variant="contained"
            onClick={() => setStatusModalOpen(true)}
            sx={{ bgcolor: '#12304A', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0F8B8D' } }}
          >
            Change Status
          </Button>
        </Stack>
      </Box>

      {actionSuccess && (
        <Alert severity="success" onClose={() => setActionSuccess(null)} sx={{ mb: 3, borderRadius: 2 }}>
          {actionSuccess}
        </Alert>
      )}
      {actionError && (
        <Alert severity="error" onClose={() => setActionError(null)} sx={{ mb: 3, borderRadius: 2 }}>
          {actionError}
        </Alert>
      )}

      {/* Main Workspace Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Request Details, Updates Composer & Timeline */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', mb: 3 }}>
            {/* Header Strip */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F8B8D' }}>
                  {request.referenceNumber}
                </Typography>
                <StatusChip status={request.status} size="medium" />
                <PriorityChip priority={request.priority} size="medium" />
              </Box>
              <Chip label={request.category.name} sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
              {request.title}
            </Typography>

            <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', mb: 3 }}>
              {request.description}
            </Typography>

            {/* Resolution Display if Resolved */}
            {request.resolutionDetails && (
              <Box sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534', mb: 0.5 }}>
                  Recorded Resolution Actions
                </Typography>
                <Typography variant="body2" sx={{ color: '#15803D' }}>
                  {request.resolutionDetails}
                </Typography>
                {request.resolvedAt && (
                  <Typography variant="caption" sx={{ color: '#166534', display: 'block', mt: 0.5 }}>
                    Resolved at: {new Date(request.resolvedAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}

            {/* Rejection Display if Rejected */}
            {request.rejectionReason && (
              <Box sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991B1B', mb: 0.5 }}>
                  Rejection Explanation
                </Typography>
                <Typography variant="body2" sx={{ color: '#B91C1C' }}>
                  {request.rejectionReason}
                </Typography>
              </Box>
            )}

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', mb: 1.5 }}>
                  Attachments ({request.attachments.length})
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                  {request.attachments.map((att) => (
                    <Paper
                      key={att.id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <AttachFile fontSize="small" sx={{ color: '#0F8B8D' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', maxWidth: 160 }} noWrap>
                          {att.originalName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          {Math.round(att.fileSize / 1024)} KB
                        </Typography>
                      </Box>
                      <Button component="a" href={att.fileUrl} target="_blank" size="small">
                        <Download fontSize="small" />
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Update*/}
            <Box sx={{ mb: 4, p: 3, borderRadius: 2.5, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#12304A', mb: 1.5 }}>
                Record Work Progress or Private Note
              </Typography>

              <Tabs
                value={updateTab}
                onChange={(_, val) => setUpdateTab(val)}
                sx={{ mb: 2, '& .MuiTab-root': { fontWeight: 700, fontSize: '0.85rem' } }}
              >
                <Tab icon={<Public fontSize="small" />} iconPosition="start" label="Citizen-Visible Public Update" />
                <Tab icon={<Lock fontSize="small" />} iconPosition="start" label="Private Internal Admin Note" />
              </Tabs>

              {updateTab === 0 ? (
                <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem', py: 0.5 }}>
                  Public updates are immediately visible to the citizen and will trigger an in-app notification.
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2, fontSize: '0.8rem', py: 0.5, bgcolor: '#FEF3C7', color: '#92400E' }}>
                  Internal notes are STRICTLY CONFIDENTIAL and are NEVER disclosed to the citizen portal or public APIs.
                </Alert>
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={
                  updateTab === 0
                    ? 'Enter update visible to citizen (e.g. Field inspection completed, contractor dispatched)...'
                    : 'Enter private internal note (e.g. Material cost estimate, internal inter-departmental note)...'
                }
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                sx={{ mb: 2, bgcolor: '#FFFFFF' }}
              />

              <Button
                variant="contained"
                disabled={updateMessage.trim().length < 3 || addUpdateMutation.isPending}
                onClick={() => addUpdateMutation.mutate()}
                startIcon={<Send />}
                sx={{
                  bgcolor: updateTab === 1 ? '#D97706' : '#0F8B8D',
                  color: '#fff',
                  fontWeight: 700,
                  '&:hover': { bgcolor: updateTab === 1 ? '#b45309' : '#0c7375' },
                }}
              >
                {addUpdateMutation.isPending ? 'Saving...' : updateTab === 1 ? 'Save Private Note' : 'Publish Public Update'}
              </Button>
            </Box>

            {/* Chronological Timeline */}
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
              Full Operational Timeline & Audit History
            </Typography>
            <TimelineView statusHistory={request.statusHistory} updates={request.updates} isAdminView={true} />
          </Paper>
        </Grid>

        {/* Right Column: Citizen Contact, Map & Feedback */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Citizen Contact Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
                Citizen Information
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Person sx={{ color: '#0F8B8D' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{request.citizen?.fullName}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Email sx={{ color: '#0F8B8D' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2">{request.citizen?.email}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Phone sx={{ color: '#0F8B8D' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2">{request.citizen?.phone || 'Not provided'}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {/* Location & Map Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
                Reported Location
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                <Place sx={{ color: '#0F8B8D', mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{request.locationName}</Typography>
                  {request.ward && (
                    <Typography variant="caption" color="text.secondary">Ward: {request.ward}</Typography>
                  )}
                </Box>
              </Box>

              {request.latitude && request.longitude ? (
                <Box>
                  <Box sx={{ height: 220, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #CBD5E1', mb: 1.5 }}>
                    <MapContainer
                      center={[request.latitude, request.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[request.latitude, request.longitude]} />
                      <Circle
                        center={[request.latitude, request.longitude]}
                        radius={90}
                        pathOptions={{ color: '#0F8B8D', fillColor: '#0F8B8D', fillOpacity: 0.15 }}
                      />
                    </MapContainer>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.2,
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                      GPS: {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
                    </Typography>
                    <Tooltip title="Copy Coordinates">
                      <Button
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(`${request.latitude}, ${request.longitude}`);
                        }}
                        sx={{ minWidth: 28, p: 0.3 }}
                      >
                        <ContentCopy fontSize="small" sx={{ color: '#64748B' }} />
                      </Button>
                    </Tooltip>
                  </Paper>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Navigation />}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${request.latitude},${request.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: '#0F8B8D',
                      borderColor: '#0F8B8D',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      '&:hover': { bgcolor: 'rgba(15,139,141,0.06)', borderColor: '#0c7375' },
                    }}
                  >
                    Dispatch Navigation / Trace Route
                  </Button>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary">No GPS coordinates recorded.</Typography>
              )}
            </Paper>

            {/* Citizen Feedback Card */}
            {request.feedback && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#166534', mb: 1 }}>
                  Citizen Feedback
                </Typography>
                <Rating value={request.feedback.rating} readOnly size="small" />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#166534', mt: 0.5 }}>
                  Rating: {request.feedback.rating} / 5 Stars
                </Typography>
                {request.feedback.comments && (
                  <Typography variant="body2" sx={{ color: '#15803D', mt: 1, fontStyle: 'italic' }}>
                    "{request.feedback.comments}"
                  </Typography>
                )}
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* DIALOG 1: Category & Priority */}
      <Dialog open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#12304A' }}>Adjust Category & Priority</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={newCategoryId} label="Category" onChange={(e) => setNewCategoryId(e.target.value)}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={newPriority} label="Priority" onChange={(e) => setNewPriority(e.target.value as Priority)}>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => updateCategoryPriorityMutation.mutate()} sx={{ bgcolor: '#0F8B8D' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG 2: Status Transition */}
      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#12304A' }}>Update Request Status</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current Status: <strong>{request.status}</strong>
          </Typography>
          <Stack spacing={2.5}>
            <FormControl fullWidth>
              <InputLabel>Target Status</InputLabel>
              <Select
                value={selectedNextStatus}
                label="Target Status"
                onChange={(e) => setSelectedNextStatus(e.target.value as RequestStatus)}
              >
                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="AWAITING_CITIZEN">Awaiting Citizen Info</MenuItem>
                <MenuItem value="ON_HOLD">On Hold</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="REOPENED">Reopened</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Transition Reason / Explanation"
              placeholder="e.g. Field crew dispatched, on hold pending rain stop..."
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              helperText={
                selectedNextStatus === 'REJECTED' || selectedNextStatus === 'ON_HOLD'
                  ? 'Explanation is mandatory for Rejected and On Hold statuses.'
                  : 'Optional brief reason.'
              }
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Administrative Notes (Internal)"
              placeholder="Internal operational notes for records..."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => updateStatusMutation.mutate()} sx={{ bgcolor: '#12304A' }}>
            Confirm Status Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG 3: Resolve Request */}
      <Dialog open={resolveModalOpen} onClose={() => setResolveModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#166534' }}>Record Resolution Actions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
            Please record the specific physical or administrative work executed to resolve this request. This will be visible to the citizen and will invite their satisfaction rating.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            required
            label="Resolution Details & Actions Taken"
            placeholder="e.g. Cleared 25 meters of stormwater trench, installed new drainage culvert, restored water pressure to 3.5 bar..."
            value={resolutionDetails}
            onChange={(e) => setResolutionDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResolveModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            disabled={resolutionDetails.trim().length < 10 || resolveMutation.isPending}
            onClick={() => resolveMutation.mutate()}
            sx={{ fontWeight: 700 }}
          >
            {resolveMutation.isPending ? 'Resolving...' : 'Confirm & Mark Resolved'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG 4: Reject Request */}
      <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#B91C1C' }}>Reject Service Request</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
            A clear explanation is required to inform the citizen why this request is out-of-scope, duplicated, or cannot be fulfilled.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            required
            label="Rejection Reason & Explanation"
            placeholder="Explain why this request is out-of-scope or invalid..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={rejectionReason.trim().length < 10 || rejectMutation.isPending}
            onClick={() => rejectMutation.mutate()}
            sx={{ fontWeight: 700 }}
          >
            {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG 5: Request Information from Citizen */}
      <Dialog open={requestInfoModalOpen} onClose={() => setRequestInfoModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#D97706' }}>Request Additional Information from Citizen</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
            This will transition the request to <strong>AWAITING_CITIZEN</strong> and notify the citizen to submit the required details.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            required
            label="Specific Information / Questions for Citizen"
            placeholder="e.g. Please clarify exact gate number, or upload a photo showing the meter leak..."
            value={infoQuestion}
            onChange={(e) => setInfoQuestion(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRequestInfoModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            disabled={infoQuestion.trim().length < 5 || requestInfoMutation.isPending}
            onClick={() => requestInfoMutation.mutate()}
            sx={{ fontWeight: 700 }}
          >
            {requestInfoMutation.isPending ? 'Sending...' : 'Send Request to Citizen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
