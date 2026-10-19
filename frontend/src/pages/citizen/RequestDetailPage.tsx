import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Place,
  CalendarToday,
  AttachFile,
  CheckCircle,
  HelpOutline,
  Replay,
  Send,
  ThumbUp,
  Download,
  Navigation,
  ContentCopy,
  Campaign as EndorseIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import api from '../../api/client';
import { ServiceRequest } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { TimelineView } from '../../components/TimelineView';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [endorsed, setEndorsed] = useState(false);
  const [endorseCount, setEndorseCount] = useState(3);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Dialog States
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | null>(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const [actionError, setActionError] = useState<string | null>(null);

  const { data: request, isLoading, error } = useQuery<ServiceRequest>({
    queryKey: ['requestDetail', id],
    queryFn: async () => {
      const res = await api.get(`/requests/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });

  // Submit Additional Info Mutation
  const additionalInfoMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/${id}/additional-info`, { message: infoMessage });
    },
    onSuccess: () => {
      setInfoDialogOpen(false);
      setInfoMessage('');
      queryClient.invalidateQueries({ queryKey: ['requestDetail', id] });
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to submit additional information.');
    },
  });

  //  Submit Feedback Mutation
  const feedbackMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/${id}/feedback`, {
        rating: feedbackRating || 5,
        comments: feedbackComments || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestDetail', id] });
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to submit feedback.');
    },
  });

  //  Dispute / Reopen Mutation
  const reopenMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/requests/${id}/reopen`, { reason: reopenReason });
    },
    onSuccess: () => {
      setReopenDialogOpen(false);
      setReopenReason('');
      queryClient.invalidateQueries({ queryKey: ['requestDetail', id] });
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.error || 'Failed to reopen request.');
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
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Request not found or you are not authorized to view this request.
        </Alert>
        <Button component={Link} to="/requests" startIcon={<ArrowBack />}>
          Back to My Requests
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 5 }}>
      <Container maxWidth="xl">
        {/* Navigation Breadcrumb */}
        <Button
          component={Link}
          to="/requests"
          startIcon={<ArrowBack />}
          sx={{ mb: 3, color: '#64748B', fontWeight: 600 }}
        >
          Back to My Requests
        </Button>

        {actionError && (
          <Alert severity="error" onClose={() => setActionError(null)} sx={{ mb: 3, borderRadius: 2 }}>
            {actionError}
          </Alert>
        )}

        {/* Action Needed Callout if AWAITING_CITIZEN */}
        {request.status === 'AWAITING_CITIZEN' && (
          <Alert
            severity="warning"
            sx={{ mb: 4, borderRadius: 3, border: '1px solid #FDE68A', p: 2 }}
            action={
              <Button
                variant="contained"
                color="warning"
                onClick={() => setInfoDialogOpen(true)}
                sx={{ fontWeight: 700 }}
              >
                Provide Information
              </Button>
            }
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Action Required: County Administrator requested additional information.
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Please review the administrator's request in the timeline below and submit the requested clarification so work can proceed.
            </Typography>
          </Alert>
        )}

        {/* Resolution Banner if RESOLVED */}
        {(request.status === 'RESOLVED' || request.status === 'CLOSED') && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              bgcolor: '#F0FDF4',
              border: '1px solid #BBF7D0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CheckCircle sx={{ color: '#15803D', fontSize: 32, mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#166534' }}>
                    Issue Marked as Resolved by County Administration
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#15803D', mt: 0.5, lineHeight: 1.6 }}>
                    {request.resolutionDetails || 'Work completed successfully.'}
                  </Typography>
                  {request.resolvedAt && (
                    <Typography variant="caption" sx={{ color: '#166534', display: 'block', mt: 0.8 }}>
                      Resolved on: {new Date(request.resolvedAt).toLocaleDateString()} at {new Date(request.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Replay />}
                onClick={() => setReopenDialogOpen(true)}
                sx={{ fontWeight: 700, borderColor: '#F87171', color: '#B91C1C' }}
              >
                Dispute / Reopen Request
              </Button>
            </Box>
          </Paper>
        )}

        {/* Rejection Banner */}
        {request.status === 'REJECTED' && (
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#991B1B' }}>
              Request Not Approved
            </Typography>
            <Typography variant="body2" sx={{ color: '#B91C1C', mt: 0.5 }}>
              Reason: {request.rejectionReason}
            </Typography>
          </Paper>
        )}

        <Grid container spacing={4}>
          {/* Main Column: Request Overview & Timeline */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', mb: 4 }}>
              {/* Reference and Badges */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F8B8D', letterSpacing: '0.02em' }}>
                    {request.referenceNumber}
                  </Typography>
                  <StatusChip status={request.status} size="medium" />
                </Box>
                <Chip label={request.category.name} sx={{ fontWeight: 700 }} />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
                {request.title}
              </Typography>

              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', mb: 3 }}>
                {request.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Attachments */}
              {request.attachments && request.attachments.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', mb: 1.5 }}>
                    Submitted Attachments ({request.attachments.length})
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
                        <Button
                          component="a"
                          href={att.fileUrl}
                          target="_blank"
                          size="small"
                          sx={{ minWidth: 'auto', p: 0.5, ml: 0.5 }}
                        >
                          <Download fontSize="small" />
                        </Button>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Timeline Header */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
                  Activity & Progress Timeline
                </Typography>
                <TimelineView statusHistory={request.statusHistory} updates={request.updates} isAdminView={false} />
              </Box>
            </Paper>

            {/* Citizen Feedback Card  */}
            {(request.status === 'RESOLVED' || request.status === 'CLOSED') && !request.feedback && (
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 1 }}>
                  Citizen Satisfaction Feedback
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                  How satisfied are you with the resolution of this issue by the county?
                </Typography>

                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Rating
                    value={feedbackRating}
                    onChange={(_, val) => setFeedbackRating(val)}
                    size="large"
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F8B8D' }}>
                    {feedbackRating === 5 ? 'Excellent' : feedbackRating === 4 ? 'Good' : feedbackRating === 3 ? 'Average' : 'Needs Improvement'}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share comments regarding response time, quality of work, or service delivery..."
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  onClick={() => feedbackMutation.mutate()}
                  disabled={feedbackMutation.isPending}
                  startIcon={<ThumbUp />}
                  sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
                >
                  {feedbackMutation.isPending ? 'Submitting...' : 'Submit Satisfaction Rating'}
                </Button>
              </Paper>
            )}

            {/* Existing Feedback View */}
            {request.feedback && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', mb: 1 }}>
                  Your Submitted Feedback
                </Typography>
                <Rating value={request.feedback.rating} readOnly size="small" />
                {request.feedback.comments && (
                  <Typography variant="body2" sx={{ color: '#475569', mt: 1, fontStyle: 'italic' }}>
                    "{request.feedback.comments}"
                  </Typography>
                )}
              </Paper>
            )}
          </Grid>

          {/* Right Column: Location & Summary */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Enhanced Location Card with Map Tracing */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
                  Physical Locus & Map
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                  <Place sx={{ color: '#0F8B8D', fontSize: 24, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                      {request.locationName}
                    </Typography>
                    {request.ward && (
                      <Typography variant="body2" color="text.secondary">
                        Ward: {request.ward}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {request.latitude && request.longitude ? (
                  <Box>
                    <Box sx={{ height: 210, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #CBD5E1', mb: 1.5 }}>
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
                      <Tooltip title={copiedCoords ? 'Copied!' : 'Copy Coordinates'}>
                        <Button
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(`${request.latitude}, ${request.longitude}`);
                            setCopiedCoords(true);
                            setTimeout(() => setCopiedCoords(false), 2000);
                          }}
                          sx={{ minWidth: 28, p: 0.3 }}
                        >
                          <ContentCopy fontSize="small" sx={{ color: copiedCoords ? '#238636' : '#64748B' }} />
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
                      Trace Driving Route & Directions
                    </Button>
                  </Box>
                ) : (
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      No GPS coordinates were pinned for this request.
                    </Typography>
                  </Paper>
                )}
              </Paper>

              {/*  Community Impact Endorsement */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#12304A', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ color: '#0F8B8D', fontSize: 20 }} /> Community Impact
                  </Typography>
                  <Chip
                    label={`${endorseCount} Affected`}
                    size="small"
                    sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: '0.72rem' }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 2, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Are you or your neighbors also affected by this specific issue? Endorse this report to help county dispatch teams prioritize collective neighborhood repairs.
                </Typography>
                <Button
                  variant={endorsed ? 'outlined' : 'contained'}
                  fullWidth
                  startIcon={<EndorseIcon />}
                  onClick={() => {
                    if (!endorsed) {
                      setEndorsed(true);
                      setEndorseCount((prev) => prev + 1);
                    }
                  }}
                  disabled={endorsed}
                  sx={{
                    bgcolor: endorsed ? 'transparent' : '#0F8B8D',
                    color: endorsed ? '#238636' : '#FFFFFF',
                    borderColor: endorsed ? '#238636' : 'transparent',
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 1,
                    '&:hover': { bgcolor: endorsed ? 'transparent' : '#0c7375' },
                  }}
                >
                  {endorsed ? '✓ You Endorsed This Issue (+1)' : 'I Am Also Affected (+1 Endorsement)'}
                </Button>
              </Paper>

              {/* Service  Card */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
                  Request Summary
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Submitted On:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Department:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {request.category.name}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Priority:</Typography>
                    <PriorityChip priority={request.priority} size="small" />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Type:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {request.requestType === 'COMMUNITY_ISSUE' ? 'Community Issue' : 'Service Request'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        {/* DIALOG 1: Provide Additional Information */}
        <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#12304A' }}>
            Submit Additional Information
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              Please provide the clarification or details requested by the County Administrator. This will update your request back to IN_PROGRESS.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              required
              label="Clarification / Additional Details"
              placeholder="Provide exact landmarks, answers to questions, or additional context..."
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setInfoDialogOpen(false)} sx={{ color: '#64748B' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={infoMessage.trim().length < 5 || additionalInfoMutation.isPending}
              onClick={() => additionalInfoMutation.mutate()}
              sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700 }}
            >
              {additionalInfoMutation.isPending ? 'Submitting...' : 'Submit to Administrator'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG 2: Dispute / Reopen Request */}
        <Dialog open={reopenDialogOpen} onClose={() => setReopenDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#12304A' }}>
            Request Administrative Reopening
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              If the problem was not fully resolved, or the defect recurred, please explain the issue so the County Administration can review and dispatch corrective action.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              required
              label="Reason for Disputing Resolution / Reopening"
              placeholder="Describe why the resolution was incomplete or what further work is required..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setReopenDialogOpen(false)} sx={{ color: '#64748B' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={reopenReason.trim().length < 5 || reopenMutation.isPending}
              onClick={() => reopenMutation.mutate()}
              sx={{ fontWeight: 700 }}
            >
              {reopenMutation.isPending ? 'Submitting...' : 'Confirm Reopening'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
