import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import {
  AddCircleOutline,
  Assignment,
  HourglassEmpty,
  Build,
  CheckCircle,
  HelpOutline,
  HighlightOff,
  ArrowForward,
  NotificationsActive,
  Star,
  Place,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { CitizenDashboardStats } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_PROGRESS' | 'AWAITING_CITIZEN' | 'RESOLVED' | 'REJECTED'>('ALL');

  const { data, isLoading, error } = useQuery<CitizenDashboardStats>({
    queryKey: ['citizenDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/citizen');
      return res.data.data;
    },
  });

  const statCards = [
    {
      title: 'Total Requests',
      value: data?.stats?.total ?? 0,
      icon: <Assignment sx={{ fontSize: 26, color: '#12304A' }} />,
      bg: '#F1F5F9',
      border: '#CBD5E1',
      filterKey: 'ALL' as const,
    },
    {
      title: 'Under Review',
      value: data?.stats?.awaitingReview ?? 0,
      icon: <HourglassEmpty sx={{ fontSize: 26, color: '#0284C7' }} />,
      bg: '#E0F2FE',
      border: '#BAE6FD',
      filterKey: 'ALL' as const,
    },
    {
      title: 'In Progress',
      value: data?.stats?.inProgress ?? 0,
      icon: <Build sx={{ fontSize: 26, color: '#009688' }} />,
      bg: '#E6FFFA',
      border: '#99F6E4',
      filterKey: 'IN_PROGRESS' as const,
    },
    {
      title: 'Resolved & Fixed',
      value: data?.stats?.resolved ?? 0,
      icon: <CheckCircle sx={{ fontSize: 26, color: '#15803D' }} />,
      bg: '#DCFCE7',
      border: '#BBF7D0',
      filterKey: 'RESOLVED' as const,
    },
    {
      title: 'Action Needed',
      value: data?.stats?.awaitingCitizen ?? 0,
      icon: <HelpOutline sx={{ fontSize: 26, color: '#D97706' }} />,
      bg: '#FEF3C7',
      border: '#FDE68A',
      highlight: (data?.stats?.awaitingCitizen ?? 0) > 0,
      filterKey: 'AWAITING_CITIZEN' as const,
    },
    {
      title: 'Rejected',
      value: data?.stats?.rejected ?? 0,
      icon: <HighlightOff sx={{ fontSize: 26, color: '#DC2626' }} />,
      bg: '#FEE2E2',
      border: '#FECACA',
      filterKey: 'REJECTED' as const,
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#009688' }} />
      </Box>
    );
  }

  const allRecent = data?.recentRequests || [];
  const filteredRequests = allRecent.filter((r) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'IN_PROGRESS') return r.status === 'IN_PROGRESS' || r.status === 'UNDER_REVIEW';
    if (activeTab === 'AWAITING_CITIZEN') return r.status === 'AWAITING_CITIZEN';
    if (activeTab === 'RESOLVED') return r.status === 'RESOLVED' || r.status === 'CLOSED';
    if (activeTab === 'REJECTED') return r.status === 'REJECTED';
    return true;
  });

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 4 }}>
      <Container maxWidth="xl">
        {/* Welcome Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
              Welcome, {user?.fullName}!
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#64748B' }}>
              Track the live progress of your Murang'a County service requests and community issues.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/requests/new"
            variant="contained"
            size="large"
            startIcon={<AddCircleOutline />}
            sx={{
              bgcolor: '#009688',
              color: '#FFFFFF',
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              borderRadius: 2.5,
              boxShadow: '0 4px 14px rgba(0, 150, 136, 0.35)',
              '&:hover': { bgcolor: '#00695c' },
            }}
          >
            New Request or Issue
          </Button>
        </Box>

        {/* Action Required Banner if Awaiting Citizen */}
        {(data?.stats?.awaitingCitizen ?? 0) > 0 && (
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              borderRadius: 3,
              border: '1px solid #FDE68A',
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                You have {data?.stats.awaitingCitizen} request(s) awaiting additional information requested by the County Administrator.
              </Typography>
              <Button
                component={Link}
                to="/requests?status=AWAITING_CITIZEN"
                size="small"
                variant="contained"
                color="warning"
                sx={{ fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }}
              >
                Provide Details Now
              </Button>
            </Box>
          </Alert>
        )}

        {/* Metric Cards Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {statCards.map((c) => (
            <Grid item xs={6} sm={4} md={2} key={c.title}>
              <Card
                onClick={() => setActiveTab(c.filterKey)}
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid',
                  borderColor: activeTab === c.filterKey ? '#009688' : c.border,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === c.filterKey ? '0 6px 16px rgba(0, 150, 136, 0.15)' : 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: '#009688',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.78rem' }} noWrap>
                      {c.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '8px',
                        bgcolor: c.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {c.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
                    {c.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Content Columns: Recent Requests & Recent Notifications */}
        <Grid container spacing={4}>
          {/* Recent Requests Table */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
                    My Requests & Issues
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Filter by status to inspect admin responses, resolution details, and actions taken
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/requests"
                  endIcon={<ArrowForward fontSize="small" />}
                  sx={{ color: '#009688', fontWeight: 700, fontSize: '0.82rem', fontFamily: "'Poppins', sans-serif" }}
                >
                  View All ({data?.stats?.total ?? 0})
                </Button>
              </Box>

              {/* Status Filter Chips */}
              <Stack direction="row" spacing={1} sx={{ mb: 2.5, overflowX: 'auto', pb: 0.5 }}>
                {[
                  { key: 'ALL' as const, label: 'All Requests' },
                  { key: 'IN_PROGRESS' as const, label: 'In Progress' },
                  { key: 'AWAITING_CITIZEN' as const, label: 'Action Needed' },
                  { key: 'RESOLVED' as const, label: 'Resolved & Fixed' },
                  { key: 'REJECTED' as const, label: 'Rejected' },
                ].map((tab) => (
                  <Chip
                    key={tab.key}
                    label={tab.label}
                    clickable
                    size="small"
                    onClick={() => setActiveTab(tab.key)}
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif",
                      bgcolor: activeTab === tab.key ? '#009688' : '#F1F5F9',
                      color: activeTab === tab.key ? '#FFFFFF' : '#475569',
                      '&:hover': {
                        bgcolor: activeTab === tab.key ? '#00695c' : '#E2E8F0',
                      },
                    }}
                  />
                ))}
              </Stack>

              {filteredRequests.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Assignment sx={{ fontSize: 44, color: '#CBD5E1', mb: 1.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#64748B' }}>
                    No requests found for this filter.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                    Have a community issue with roads, water, or lighting in Murang'a County?
                  </Typography>
                  <Button
                    component={Link}
                    to="/requests/new"
                    variant="contained"
                    startIcon={<AddCircleOutline />}
                    sx={{ bgcolor: '#009688', color: '#fff', fontWeight: 700, borderRadius: 2 }}
                  >
                    Report an Issue
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table sx={{ minWidth: 620 }}>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' } }}>
                        <TableCell>Reference</TableCell>
                        <TableCell>Title & Department</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Status & Action</TableCell>
                        <TableCell align="right">Workspace</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests.map((req) => (
                        <TableRow key={req.id} hover sx={{ '& td': { py: 2 } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#12304A' }}>
                              {req.referenceNumber}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                              {new Date(req.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 220 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }} noWrap>
                              {req.title}
                            </Typography>
                            <Chip label={req.category.name} size="small" sx={{ fontSize: '0.68rem', height: 20, mt: 0.4 }} />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 160 }}>
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }} noWrap>
                              <Place fontSize="inherit" sx={{ color: '#009688' }} /> {req.locationName}
                            </Typography>
                            {req.ward && (
                              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
                                Ward: {req.ward}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                              <StatusChip status={req.status} size="small" />

                              {/* Solved / Resolved Callout */}
                              {(req.status === 'RESOLVED' || req.status === 'CLOSED') && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 700, fontSize: '0.72rem' }}>
                                    ✓ Issue Fixed
                                  </Typography>
                                  {!req.feedback && (
                                    <Chip
                                      icon={<Star sx={{ fontSize: 13, color: '#D97706 !important' }} />}
                                      label="Rate Service"
                                      size="small"
                                      component={Link}
                                      to={`/requests/${req.id}`}
                                      clickable
                                      sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }}
                                    />
                                  )}
                                </Box>
                              )}

                              {/* Rejected Callout */}
                              {req.status === 'REJECTED' && (
                                <Typography variant="caption" sx={{ color: '#B91C1C', fontWeight: 600, fontSize: '0.72rem' }}>
                                  Explanation on file
                                </Typography>
                              )}

                              {/* Awaiting Citizen Callout */}
                              {req.status === 'AWAITING_CITIZEN' && (
                                <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700, fontSize: '0.72rem' }}>
                                  Information needed
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              component={Link}
                              to={`/requests/${req.id}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                color: '#12304A',
                                borderColor: '#CBD5E1',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                borderRadius: 2,
                                fontFamily: "'Poppins', sans-serif",
                                '&:hover': { borderColor: '#009688', color: '#009688' },
                              }}
                            >
                              Track & View
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

          {/* Recent Notifications Sidecard */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <NotificationsActive sx={{ color: '#009688' }} />
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12304A' }}>
                  Live Status Alerts
                </Typography>
              </Box>

              {(!data?.recentNotifications || data.recentNotifications.length === 0) ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    No alerts yet. When the county updates your requests, notices will appear here.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {data.recentNotifications.map((notif) => (
                    <Box
                      key={notif.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: notif.isRead ? '#F8FAFC' : '#F0FDFA',
                        border: '1px solid',
                        borderColor: notif.isRead ? '#E2E8F0' : '#CCFBF1',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#12304A', fontSize: '0.85rem' }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.78rem', mt: 0.3, lineHeight: 1.5 }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.8, fontSize: '0.7rem' }}>
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CitizenDashboard;
