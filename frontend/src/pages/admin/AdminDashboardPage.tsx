import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Stack,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Assignment,
  HourglassEmpty,
  Build,
  HelpOutline,
  CheckCircle,
  PauseCircle,
  Replay,
  Warning,
  Speed,
  ThumbUp,
  ArrowForward,
  ReportProblem,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { AdminDashboardData } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';

export const AdminDashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery<AdminDashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/admin');
      return res.data.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#0F8B8D' }} />
      </Box>
    );
  }

  const summary = data?.summary || {
    total: 0,
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    awaitingCitizen: 0,
    onHold: 0,
    resolved: 0,
    closed: 0,
    rejected: 0,
    reopened: 0,
    overdue: 0,
  };

  const performance = data?.performance || {
    avgResolutionHours: null,
    resolvedCount: 0,
    averageSatisfaction: null,
    feedbackCount: 0,
  };

  const primaryCards = [
    {
      title: 'Total Requests Logged',
      value: summary.total,
      subtitle: `${summary.submitted} newly submitted`,
      color: '#12304A',
      bgcolor: 'rgba(18, 48, 74, 0.04)',
      icon: <Assignment sx={{ fontSize: 28 }} />,
    },
    {
      title: 'Active Work Queue',
      value: summary.submitted + summary.underReview + summary.inProgress,
      subtitle: `${summary.inProgress} in progress · ${summary.underReview} under review`,
      color: '#0F8B8D',
      bgcolor: 'rgba(15, 139, 141, 0.05)',
      icon: <Build sx={{ fontSize: 28 }} />,
    },
    {
      title: 'Action Required',
      value: summary.awaitingCitizen + summary.reopened + summary.overdue,
      subtitle: `${summary.awaitingCitizen} awaiting citizen · ${summary.overdue} overdue`,
      color: '#D97706',
      bgcolor: 'rgba(217, 119, 6, 0.06)',
      icon: <Warning sx={{ fontSize: 28 }} />,
      highlight: (summary.awaitingCitizen + summary.reopened + summary.overdue) > 0,
    },
    {
      title: 'Resolved & Closed',
      value: summary.resolved + summary.closed,
      subtitle: `${summary.resolved} resolved · ${summary.closed} closed`,
      color: '#15803D',
      bgcolor: 'rgba(21, 128, 61, 0.05)',
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
    },
  ];

  const statusPills = [
    { label: 'New', count: summary.submitted, color: '#0284C7' },
    { label: 'In Review', count: summary.underReview, color: '#6366F1' },
    { label: 'In Progress', count: summary.inProgress, color: '#0F8B8D' },
    { label: 'Awaiting Citizen', count: summary.awaitingCitizen, color: '#D97706' },
    { label: 'On Hold', count: summary.onHold, color: '#64748B' },
    { label: 'Reopened', count: summary.reopened, color: '#DC2626' },
    { label: 'Overdue (>7d)', count: summary.overdue, color: '#B91C1C' },
    { label: 'Rejected', count: summary.rejected, color: '#94A3B8' },
  ];

  return (
    <Box>
      {/* Top Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', letterSpacing: '-0.01em' }}>
            Operations & Service Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Live metrics and workflow queue for Murang'a County digital service requests.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            to="/admin/requests"
            variant="contained"
            sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#0c7375' } }}
          >
            Manage All Requests
          </Button>
          <Button
            component={Link}
            to="/admin/reports"
            variant="outlined"
            sx={{ color: '#12304A', borderColor: '#CBD5E1', fontWeight: 600, borderRadius: 2 }}
          >
            Export Reports
          </Button>
        </Stack>
      </Box>

      {/* Primary KPI Cards Grid  */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {primaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                border: '1px solid',
                borderColor: card.highlight ? '#F87171' : '#E2E8F0',
                boxShadow: card.highlight ? '0 4px 15px rgba(220,38,38,0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.82rem' }}>
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: card.bgcolor,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: card.color, lineHeight: 1.1, mb: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.74rem' }}>
                {card.subtitle}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.2,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', mr: 1, letterSpacing: '0.04em' }}>
          STATUS BREAKDOWN:
        </Typography>
        {statusPills.map((pill) => (
          <Chip
            key={pill.label}
            size="small"
            label={`${pill.label}: ${pill.count}`}
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: pill.count > 0 ? pill.color : '#94A3B8',
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
        ))}
      </Paper>

      {/* Performance & Quality Indicators */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Speed sx={{ color: '#0F8B8D', fontSize: 26 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#12304A' }}>
                Avg Resolution Time
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#12304A', my: 1 }}>
              {performance.avgResolutionHours !== null ? `${performance.avgResolutionHours} hrs` : 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Calculated from {performance.resolvedCount} completed resolutions
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <ThumbUp sx={{ color: '#238636', fontSize: 26 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#12304A' }}>
                Citizen Satisfaction
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#238636', my: 1 }}>
              {performance.averageSatisfaction !== null ? `${performance.averageSatisfaction} / 5.0` : 'No ratings yet'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on {performance.feedbackCount} citizen rating submissions
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <ReportProblem sx={{ color: '#D97706', fontSize: 26 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#12304A' }}>
                Needs Immediate Attention
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#D97706', my: 1 }}>
              {data?.needsAttention?.length ?? 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              New submissions, urgent reports, and disputed resolutions
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Needs Attention Table & Category Breakdown */}
      <Grid container spacing={3}>
        {/* Needs Attention Table */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A' }}>
                Priority Queue & Action Items
              </Typography>
              <Button
                component={Link}
                to="/admin/requests"
                endIcon={<ArrowForward fontSize="small" />}
                sx={{ color: '#0F8B8D', fontWeight: 700, fontSize: '0.82rem' }}
              >
                Go to Inbox
              </Button>
            </Box>

            {(!data?.needsAttention || data.needsAttention.length === 0) ? (
              <Box sx={{ py: 6, textAlign: 'center', color: '#94A3B8' }}>
                <CheckCircle sx={{ fontSize: 44, color: '#238636', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#475569' }}>
                  No urgent requests requiring immediate administrator intervention.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748B', fontSize: '0.75rem' } }}>
                      <TableCell>Ref Number</TableCell>
                      <TableCell>Title & Citizen</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.needsAttention.map((req) => (
                      <TableRow key={req.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#12304A' }}>
                            {req.referenceNumber}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {new Date(req.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }} noWrap>
                            {req.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            By {req.citizen?.fullName} &bull; {req.category.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <PriorityChip priority={req.priority} size="small" />
                        </TableCell>
                        <TableCell>
                          <StatusChip status={req.status} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            to={`/admin/requests/${req.id}`}
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: '#12304A',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              '&:hover': { bgcolor: '#0F8B8D' },
                            }}
                          >
                            Process
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Categories Breakdown */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A', mb: 2 }}>
              Requests by Service Area
            </Typography>

            <Stack spacing={2}>
              {data?.byCategory.map((cat) => {
                const percentage = summary.total > 0 ? Math.round((cat.count / summary.total) * 100) : 0;
                return (
                  <Box key={cat.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                        {cat.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F8B8D' }}>
                        {cat.count} ({percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': { bgcolor: '#0F8B8D', borderRadius: 3 },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
