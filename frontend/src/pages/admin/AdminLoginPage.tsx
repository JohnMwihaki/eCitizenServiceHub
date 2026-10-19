import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AdminPanelSettings,
  ArrowForward,
  Security,
  AccountBalance,
  Person,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import logoImg from '../../asssets/logo.png';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/admin/login', { email, password });
      if (res.data?.success && res.data?.data) {
        const { user, token } = res.data.data;
        login(user, token);
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        'Administrator authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#0F1E17',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* LEFT COLUMN: Admin Operations Branding with System */}
        <Box
          sx={{
            width: { xs: '100%', md: '44%' },
            background: 'linear-gradient(145deg, var(--color-deep-navy) 0%, var(--color-teal-dark) 100%)',
            color: '#FFFFFF',
            p: { xs: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Background Circles */}
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -70,
              right: -70,
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              pointerEvents: 'none',
            }}
          />

          
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              p: 1.2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src={logoImg}
              alt="eCitizen Logo"
              sx={{ width: 68, height: 68, borderRadius: '12px', objectFit: 'contain' }}
            />
          </Box>

          {/* Brand Heading */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '1.35rem', md: '1.5rem' },
              lineHeight: 1.25,
              mb: 1,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Murang'a County <br /> Administration Portal
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              color: 'rgba(255, 255, 255, 0.85)',
              fontStyle: 'italic',
              fontSize: '0.92rem',
              mb: 4,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Authorized Personnel & Dispatch Only
          </Typography>

          {/* Bottom Indicator Dots */}
          <Stack direction="row" spacing={1} sx={{ mt: 'auto', position: 'relative', zIndex: 1 }}>
            <Box sx={{ width: 22, height: 6, borderRadius: 3, bgcolor: '#FFFFFF' }} />
            <Box sx={{ width: 6, height: 6, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.4)' }} />
            <Box sx={{ width: 6, height: 6, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.4)' }} />
          </Stack>
        </Box>

        {/* 
            RIGHT COLUMN: Form Side */}
        <Box
          sx={{
            width: { xs: '100%', md: '56%' },
            bgcolor: '#FFFFFF',
            p: { xs: 4, sm: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Form Header */}
          <Box sx={{ mb: 3.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'var(--primary-font)',
                fontWeight: 800,
                color: 'var(--color-deep-navy)',
                fontSize: { xs: '1.6rem', md: '1.85rem' },
                lineHeight: 1.2,
                mb: 0.8,
              }}
            >
              Administrator Login
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'var(--primary-font)',
                color: 'var(--color-soft-cool-gray)',
                fontSize: '0.92rem',
              }}
            >
              Sign in with your verified county administrative credentials
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                  Admin Email Address
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@muranga.go.ke"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F0F5FA',
                      borderRadius: 2.5,
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#CBD5E1' },
                      '&.Mui-focused fieldset': { borderColor: '#165330' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#165330' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.8, display: 'block' }}>
                  Master Password
                </Typography>
                <TextField
                  fullWidth
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F0F5FA',
                      borderRadius: 2.5,
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#CBD5E1' },
                      '&.Mui-focused fieldset': { borderColor: '#165330' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#165330' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={<ArrowForward />}
                sx={{
                  bgcolor: 'var(--color-button)',
                  color: '#FFFFFF',
                  py: 1.5,
                  borderRadius: 2.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 14px rgba(172, 15, 7, 0.35)',
                  mt: 1,
                  '&:hover': { bgcolor: 'rgb(145, 12, 5)' },
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In as Administrator'}
              </Button>
            </Stack>

          </Box>

          <Divider sx={{ my: 3.5 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              component={Link}
              to="/"
              variant="text"
              sx={{
                color: '#64748B',
                fontWeight: 600,
                fontSize: '0.86rem',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                p: 0,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              ← Back to Citizen Hub
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                color: 'var(--color-teal-dark)',
                fontWeight: 700,
                fontSize: '0.86rem',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                p: 0,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Citizen Login →
            </Button>
          </Box>

          <Box sx={{ mt: 5, textAlign: 'center', pt: 2, borderTop: '1px solid #F1F5F9' }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.74rem' }}>
              &copy; {new Date().getFullYear()}  Administrative Access Node
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLoginPage;
