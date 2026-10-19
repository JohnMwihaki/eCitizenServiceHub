import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Stack,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Person, Lock, Save, CheckCircle } from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/client';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [nationalId, setNationalId] = useState(user?.nationalId || '');

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileError(null);
    setProfileLoading(true);

    try {
      const res = await api.put('/auth/profile', {
        fullName,
        phone,
        nationalId,
      });

      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        setProfileSuccess(true);
      }
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(false);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: 'calc(100vh - 72px)', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#12304A', mb: 0.5 }}>
            My Account & Profile
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Manage your personal contact details and account security.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Personal Details */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Person sx={{ color: '#0F8B8D', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#12304A' }}>
                  Personal Information
                </Typography>
              </Box>

              {profileSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Profile updated successfully.
                </Alert>
              )}
              {profileError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {profileError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleUpdateProfile}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    helperText="Email cannot be changed as it identifies your account"
                  />

                  <TextField
                    label="Full Name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <TextField
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 700 000 000"
                  />

                  <TextField
                    label="National ID Number"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">Role:</Typography>
                      <Chip label={user?.role} size="small" color={user?.role === 'ADMIN' ? 'warning' : 'primary'} sx={{ fontWeight: 700 }} />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={profileLoading}
                      startIcon={<Save />}
                      sx={{ bgcolor: '#0F8B8D', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#0c7375' } }}
                    >
                      {profileLoading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Change Password */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Lock sx={{ color: '#0F8B8D', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#12304A' }}>
                  Change Password
                </Typography>
              </Box>

              {passwordSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Password updated successfully.
                </Alert>
              )}
              {passwordError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {passwordError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleChangePassword}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Current Password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  <TextField
                    label="New Password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    helperText="At least 8 characters"
                  />

                  <TextField
                    label="Confirm New Password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={passwordLoading}
                    sx={{ color: '#12304A', borderColor: '#CBD5E1', fontWeight: 700 }}
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
