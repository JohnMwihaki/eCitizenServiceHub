import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AddCircleOutline as AddIcon,
  FolderOpen as RequestsIcon,
  Search as TrackIcon,
  Category as ServicesIcon,
  Campaign as AnnouncementsIcon,
  Info as AboutIcon,
  HelpOutline as HelpIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import logoImg from '../asssets/logo.png';

export const CITIZEN_DRAWER_WIDTH = 260;

interface CitizenSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CitizenSidebar: React.FC<CitizenSidebarProps> = ({
  mobileOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { text: 'My Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Report an Issue', icon: <AddIcon />, path: '/requests/new' },
    { text: 'My Requests', icon: <RequestsIcon />, path: '/requests' },
    { text: 'County Services', icon: <ServicesIcon />, path: '/portal/services' },
    { text: 'Track by Reference', icon: <TrackIcon />, path: '/portal/track' },
    { text: 'Help & FAQs', icon: <HelpIcon />, path: '/portal/help' },
    { text: 'My Profile', icon: <ProfileIcon />, path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        width: CITIZEN_DRAWER_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#12304A',
        color: '#F8FAFC',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          minHeight: 68,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
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
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#fff' }}>
              eCitizen<span style={{ color: '#0F8B8D' }}>Hub</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              CITIZEN PORTAL
            </Typography>
          </Box>
        </Box>

        {onToggleCollapse && (
          <Tooltip title="Collapse sidebar">
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              sx={{
                color: '#94A3B8',
                display: { xs: 'none', md: 'flex' },
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 1.5, flexGrow: 1, py: 0 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== '/dashboard' && item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  bgcolor: active ? '#0F8B8D' : 'transparent',
                  color: active ? '#FFFFFF' : '#CBD5E1',
                  '&:hover': {
                    bgcolor: active ? '#0c7375' : 'rgba(255,255,255,0.06)',
                    color: '#FFFFFF',
                  },
                }}
              >
                <ListItemIcon sx={{ color: active ? '#FFFFFF' : '#94A3B8', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.86rem',
                    fontWeight: active ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Bottom Actions */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          size="small"
          startIcon={<PublicIcon fontSize="small" />}
          sx={{
            color: '#94A3B8',
            borderColor: 'rgba(255,255,255,0.15)',
            fontSize: '0.78rem',
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { borderColor: '#fff', color: '#fff' },
          }}
        >
        County Homepage
        </Button>
        <Button
          onClick={handleLogout}
          color="error"
          variant="text"
          size="small"
          startIcon={<LogoutIcon fontSize="small" />}
          sx={{ fontSize: '0.8rem', justifyContent: 'flex-start', color: '#EF4444', textTransform: 'none' }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: collapsed ? 0 : CITIZEN_DRAWER_WIDTH },
        flexShrink: { md: 0 },
        transition: 'width 0.25s ease-in-out',
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: CITIZEN_DRAWER_WIDTH,
            borderRight: 'none',
            bgcolor: '#12304A',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="persistent"
        open={!collapsed}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: CITIZEN_DRAWER_WIDTH,
            borderRight: 'none',
            bgcolor: '#12304A',
            transition: 'transform 0.25s ease-in-out',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};
