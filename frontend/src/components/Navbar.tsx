import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Popover,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  AddCircleOutline,
  Dashboard as DashboardIcon,
  Assignment as RequestsIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Campaign as AnnouncementIcon,
  HelpOutline as HelpIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  CheckCircleOutline as CheckIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import { NotificationItem } from '../types';
import logoImg from '../asssets/logo.png';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAdmin, isCitizen, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

  // Fetch notifications if citizen or admin
  const { data: notifData } = useQuery<{
    notifications: NotificationItem[];
    unreadCount: number;
  }>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=8');
      return res.data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const markReadAllMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markSingleReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(event.currentTarget);
  };
  const handleCloseNotif = () => {
    setAnchorElNotif(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Track Request', path: '/track' },
    { label: 'About Us', path: '/about' },
    { label: 'Help & FAQ', path: '/help' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: 'var(--color-deep-navy)',
        borderRadius: 0,
        borderBottom: '1px solid var(--color-soft-white-overlay)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Mobile hamburger */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo & County Title */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4,
            }}
          >
            <Box
              component="img"
              src={logoImg}
              alt="eCitizen Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                objectFit: 'contain',
                mr: 1.5,
                boxShadow: '0 2px 8px rgba(0,150,136,0.3)',
              }}
            />
            <Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  color: 'var(--color-light-mint)',
                }}
              >
                eCitizen<span style={{ color: 'var(--color-aqua-soft)' }}>Hub</span>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.7rem',
                  display: 'block',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                MURANG'A COUNTY GOVERNMENT
              </Typography>
            </Box>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: active ? '#FFFFFF' : '#CBD5E1',
                    bgcolor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 500,
                    px: 1.8,
                    py: 0.8,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          {/* Right Action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* If user is admin, show Admin Portal button */}
            {isAdmin && (
              <Button
                component={Link}
                to="/admin/dashboard"
                variant="contained"
                size="small"
                startIcon={<AdminIcon />}
                sx={{
                  bgcolor: 'var(--color-teal-medium)',
                  color: 'var(--color-white)',
                  fontWeight: 700,
                  fontFamily: 'var(--primary-font)',
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { bgcolor: 'var(--color-teal-dark)' },
                }}
              >
                Admin Workspace
              </Button>
            )}

            {/* If user is citizen, show quick report button */}
            {isCitizen && (
              <Button
                component={Link}
                to="/requests/new"
                variant="contained"
                size="small"
                startIcon={<AddCircleOutline />}
                sx={{
                  bgcolor: 'var(--color-teal-medium)',
                  color: 'var(--color-white)',
                  fontWeight: 700,
                  fontFamily: 'var(--primary-font)',
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { bgcolor: 'var(--color-teal-dark)' },
                }}
              >
                Report / Request
              </Button>
            )}

            {/* Notifications Bell */}
            {isAuthenticated && (
              <IconButton
                color="inherit"
                onClick={handleOpenNotif}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.06)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                }}
              >
                <Badge badgeContent={notifData?.unreadCount || 0} color="error">
                  <NotificationsIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            )}

            {/* Notification Popover */}
            <Popover
              open={Boolean(anchorElNotif)}
              anchorEl={anchorElNotif}
              onClose={handleCloseNotif}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: { width: 360, maxHeight: 480, p: 0, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
              }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Notifications
                </Typography>
                {(notifData?.unreadCount ?? 0) > 0 && (
                  <Button
                    size="small"
                    startIcon={<CheckIcon fontSize="small" />}
                    onClick={() => markReadAllMutation.mutate()}
                    sx={{ fontSize: '0.75rem', p: 0.5 }}
                  >
                    Mark all read
                  </Button>
                )}
              </Box>
              <List sx={{ p: 0 }}>
                {(!notifData?.notifications || notifData.notifications.length === 0) ? (
                  <Box sx={{ p: 3, textAlign: 'center', color: '#94A3B8' }}>
                    <Typography variant="body2">No notifications yet</Typography>
                  </Box>
                ) : (
                  notifData.notifications.map((n) => (
                    <ListItem
                      key={n.id}
                      disablePadding
                      sx={{
                        borderBottom: '1px solid #F1F5F9',
                        bgcolor: n.isRead ? 'transparent' : 'rgba(15,139,141,0.05)',
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          if (!n.isRead) markSingleReadMutation.mutate(n.id);
                          handleCloseNotif();
                          if (n.relatedRequestId) {
                            navigate(isAdmin ? `/admin/requests/${n.relatedRequestId}` : `/requests/${n.relatedRequestId}`);
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: n.isRead ? 500 : 700 }}>
                              {n.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.4 }}>
                                {n.message}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                                {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
            </Popover>

            {/* User Profile Menu or Login/Register buttons */}
            {isAuthenticated ? (
              <>
                <Box
                  onClick={handleOpenUserMenu}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    p: 0.5,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: isAdmin ? '#D97706' : 'var(--color-teal-medium)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      fontFamily: 'var(--primary-font)',
                    }}
                  >
                    {user?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'left' }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'var(--color-white)', lineHeight: 1.2, fontFamily: 'var(--primary-font)' }}
                    >
                      {user?.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--color-lavender-gray)', fontSize: '0.7rem' }}>
                      {user?.role}
                    </Typography>
                  </Box>
                </Box>

                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { width: 220, mt: 1, borderRadius: 2 } }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={user?.role} size="small" color={isAdmin ? 'warning' : 'primary'} sx={{ fontSize: '0.68rem', height: 20 }} />
                    </Box>
                  </Box>
                  <Divider />
                  {isCitizen && [
                    <MenuItem key="dash" onClick={() => { handleCloseUserMenu(); navigate('/dashboard'); }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </MenuItem>,
                    <MenuItem key="my-req" onClick={() => { handleCloseUserMenu(); navigate('/requests'); }}>
                      <ListItemIcon><RequestsIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="My Requests" />
                    </MenuItem>,
                  ]}
                  {isAdmin && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/dashboard'); }}>
                      <ListItemIcon><AdminIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Admin Portal" />
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Profile & Password" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText primary="Log Out" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Dedicated Administrator Portal Access Button */}
                <Button
                  component={Link}
                  to="/admin/login"
                  variant="outlined"
                  size="small"
                  startIcon={<AdminIcon sx={{ fontSize: '1rem !important', color: 'var(--color-aqua-soft)' }} />}
                  sx={{
                    color: 'var(--color-aqua-soft)',
                    borderColor: 'rgba(77, 182, 172, 0.45)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.6,
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': {
                      borderColor: 'var(--color-aqua-soft)',
                      bgcolor: 'rgba(77, 182, 172, 0.12)',
                    },
                  }}
                >
                  Admin Portal
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    color: 'var(--color-white)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    fontFamily: 'var(--primary-font)',
                    '&:hover': { bgcolor: 'var(--color-soft-white-overlay)' },
                  }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: 'var(--color-button)',
                    color: 'var(--color-white)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    fontFamily: 'var(--primary-font)',
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgb(145, 12, 5)' },
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src={logoImg}
              alt="eCitizen Logo"
              sx={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                objectFit: 'contain',
                mr: 1.5,
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: 'var(--color-deep-navy)', fontFamily: 'var(--primary-font)' }}
            >
              eCitizenHub
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  selected={location.pathname === link.path}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          {isCitizen && (
            <Button
              component={Link}
              to="/requests/new"
              fullWidth
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => setMobileOpen(false)}
              sx={{
                bgcolor: 'var(--color-teal-medium)',
                color: 'var(--color-white)',
                mb: 2,
                fontFamily: 'var(--primary-font)',
                '&:hover': { bgcolor: 'var(--color-teal-dark)' },
              }}
            >
              Report / Request
            </Button>
          )}
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                component={Link}
                to="/admin/login"
                fullWidth
                variant="outlined"
                startIcon={<AdminIcon />}
                onClick={() => setMobileOpen(false)}
                sx={{
                  color: 'var(--color-teal-dark)',
                  borderColor: 'var(--color-teal-dark)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textTransform: 'none',
                }}
              >
                Administrator Portal
              </Button>
              <Button component={Link} to="/login" fullWidth variant="outlined" onClick={() => setMobileOpen(false)}>
                Citizen Log In
              </Button>
              <Button component={Link} to="/register" fullWidth variant="contained" sx={{ bgcolor: 'var(--color-button)', '&:hover': { bgcolor: 'rgb(145,12,5)' } }} onClick={() => setMobileOpen(false)}>
                Citizen Register
              </Button>
            </Box>
          ) : (
            <Button fullWidth color="error" variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Log Out
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};
