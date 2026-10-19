import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { Search, Assignment, ArrowForward, Lock } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/client';
import { ServiceRequest } from '../../types';
import { StatusChip } from '../../components/StatusChip';

export const TrackRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [refInput, setRefInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    if (!isAuthenticated) {
      setError('You must sign in to your citizen account to track and access request records.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Find request in user's requests matching the reference
      const res = await api.get(`/requests/my?search=${encodeURIComponent(refInput.trim())}`);
      const matches: ServiceRequest[] = res.data?.data?.requests || [];

      const exact = matches.find(
        (m) => m.referenceNumber.toLowerCase() === refInput.trim().toLowerCase()
      );

      if (exact) {
        setResult(exact);
      } else if (matches.length > 0) {
        setResult(matches[0]);
      } else {
        setError(`No request found matching reference number "${refInput.trim()}". Please verify the reference on your receipt or dashboard.`);
      }
    } catch (err: any) {
      setError('An error occurred while tracking the request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 8 }}>
      <Container maxWidth="md">
        <Paper
          elevation={1}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              bgcolor: '#E0F2FE',
              color: '#0284C7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Search sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', mb: 1 }}>
            Track Your Service Request
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 520, mx: 'auto', mb: 4 }}>
            Enter your official Murang'a County reference number (e.g. <strong>CSR-2026-0001</strong>) to view live status updates and resolution progress.
          </Typography>

          {!isAuthenticated && (
            <Alert
              severity="info"
              icon={<Lock />}
              sx={{ mb: 4, textAlign: 'left', borderRadius: 2 }}
            >
              To protect citizen privacy, request details can only be viewed by the authenticated citizen who submitted them.{' '}
              <Link to="/login" style={{ color: '#0F8B8D', fontWeight: 700 }}>
                Sign in to your account
              </Link>{' '}
              or{' '}
              <Link to="/register" style={{ color: '#0F8B8D', fontWeight: 700 }}>
                register
              </Link>{' '}
              to track your requests.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSearch} sx={{ maxWidth: 540, mx: 'auto', mb: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                fullWidth
                placeholder="CSR-2026-XXXX"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                sx={{ bgcolor: '#F8FAFC' }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !refInput.trim()}
                sx={{
                  bgcolor: '#0F8B8D',
                  color: '#fff',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#0c7375' },
                }}
              >
                {loading ? 'Searching...' : 'Track'}
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ maxWidth: 540, mx: 'auto', textAlign: 'left', borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Result Card */}
          {result && (
            <Card
              elevation={0}
              sx={{
                maxWidth: 580,
                mx: 'auto',
                p: 2,
                borderRadius: 3,
                border: '1px solid #0F8B8D',
                bgcolor: '#F0FDFA',
                textAlign: 'left',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#12304A' }}>
                    {result.referenceNumber}
                  </Typography>
                  <StatusChip status={result.status} size="small" />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                  {result.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                  Category: <strong>{result.category.name}</strong> &bull; Location: <strong>{result.locationName}</strong>
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Logged on {new Date(result.createdAt).toLocaleDateString()}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/requests/${result.id}`}
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward />}
                    sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700 }}
                  >
                    View Full Timeline
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
