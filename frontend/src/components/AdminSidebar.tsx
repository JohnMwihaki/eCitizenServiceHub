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
  Inbox as InboxIcon,
  Map as MapIcon,
  Category as CategoryIcon,
  Campaign as AnnouncementIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Public as PublicIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import logoImg from '../asssets/logo.png';

export const DRAWER_WIDTH = 260;

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Request Inbox', icon: <InboxIcon />, path: '/admin/requests' },
    { text: 'Geographic Map', icon: <MapIcon />, path: '/admin/map' },
    { text: 'Service Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Reports & Export', icon: <ReportsIcon />, path: '/admin/reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        width: DRAWER_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#12304A',
        color: '#F8FAFC',
      }}
    >
      {/*  Header */}
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              eCitizen<span style={{ color: '#0F8B8D' }}>Admin</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              OPERATIONS PORTAL
            </Typography>
          </Box>
        </Box>

        {/* Desktop Collapse Arrow */}
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
          const active = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
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
          target="_blank"
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
          View Citizen Portal
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
        width: { md: collapsed ? 0 : DRAWER_WIDTH },
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
            width: DRAWER_WIDTH,
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
            width: DRAWER_WIDTH,
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
