import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Stack,
  InputAdornment,
  IconButton,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Badge,
  ArrowForward,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import logoImg from '../../asssets/logo.png';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        phone,
        nationalId,
        password,
      });

      if (res.data?.success && res.data?.data) {
        const { user, token } = res.data.data;
        login(user, token);
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed. Please check your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#EAEFF4',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 980,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid #CBD5E1',
          boxShadow: '0 25px 60px rgba(18, 48, 74, 0.12)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* 
            LEFT COLUMN
         */}
        <Box
          sx={{
            width: { xs: '100%', md: '42%' },
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
          {/* Subtle Decorative Background Circles */}
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
            Murang'a County <br /> eCitizen Hub
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
            Citizen Service, for Prosperity
          </Typography>

          {/* Bottom Indicator Dots */}
          <Stack direction="row" spacing={1} sx={{ mt: 'auto', position: 'relative', zIndex: 1 }}>
            <Box sx={{ width: 22, height: 6, borderRadius: 3, bgcolor: '#FFFFFF' }} />
            <Box sx={{ width: 6, height: 6, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.4)' }} />
            <Box sx={{ width: 6, height: 6, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.4)' }} />
          </Stack>
        </Box>

        {/* 
            RIGHT COLUMN: 
         */}
        <Box
          sx={{
            width: { xs: '100%', md: '58%' },
            bgcolor: '#FFFFFF',
            p: { xs: 4, sm: 5, md: 5.5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'var(--primary-font)',
                fontWeight: 800,
                color: 'var(--color-deep-navy)',
                fontSize: { xs: '1.55rem', md: '1.75rem' },
                lineHeight: 1.2,
                mb: 0.6,
              }}
            >
              Create Resident Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'var(--primary-font)',
                color: 'var(--color-soft-cool-gray)',
                fontSize: '0.88rem',
              }}
            >
              Register to report neighborhood issues and track public services
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                  Full Legal Name
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Wanjiku Muthoni"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F0F5FA',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&.Mui-focused fieldset': { borderColor: '#1E5E3A' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#1E5E3A', fontSize: 19 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F0F5FA',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&.Mui-focused fieldset': { borderColor: '#1E5E3A' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#1E5E3A', fontSize: 19 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F0F5FA',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&.Mui-focused fieldset': { borderColor: '#1E5E3A' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#1E5E3A', fontSize: 19 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box>
                <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                  National ID / Alien Card Number
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="e.g. 29847123"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F0F5FA',
                      borderRadius: 2,
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&.Mui-focused fieldset': { borderColor: '#1E5E3A' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#1E5E3A', fontSize: 19 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    Password (min. 8 chars)
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F0F5FA',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&.Mui-focused fieldset': { borderColor: '#1E5E3A' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#1E5E3A', fontSize: 19 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#334155', mb: 0.5, display: 'block' }}>
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F0F5FA',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&.Mui-focused fieldset': { borderColor: '#1E5E3A' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#1E5E3A', fontSize: 19 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

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
                  py: 1.4,
                  borderRadius: 2.5,
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 14px rgba(172, 15, 7, 0.35)',
                  mt: 1,
                  '&:hover': { bgcolor: 'rgb(145, 12, 5)' },
                }}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3, color: '#94A3B8', fontSize: '0.85rem' }}>or</Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.88rem' }}>
              Already registered with Murang'a County?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: 'var(--color-teal-dark)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign In 
              </MuiLink>
            </Typography>

            <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', mt: 1.5 }}>
              County Administrator? .{' '}
              <MuiLink
                component={Link}
                to="/admin/login"
                sx={{
                  color: 'var(--color-teal-dark)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Access Admin Portal →
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
