import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Tooltip,
  Avatar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface CitizenPortalHeaderProps {
  onToggleSidebar: () => void;
  title: string;
  isCollapsed?: boolean;
}

export const CitizenPortalHeader: React.FC<CitizenPortalHeaderProps> = ({
  onToggleSidebar,
  title,
  isCollapsed = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        color: '#1E293B',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 68 }, px: { xs: 1.5, sm: 3 } }}>
        {/* Left Section: Hamburger & Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Tooltip title={isCollapsed ? 'Expand Sidebar' : 'Collapse to Full Screen'}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onToggleSidebar}
              sx={{
                bgcolor: '#F1F5F9',
                color: '#12304A',
                '&:hover': { bgcolor: '#E2E8F0' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: '#12304A',
                fontSize: { xs: '1rem', sm: '1.2rem' },
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748B',
                display: { xs: 'none', sm: 'block' },
                fontSize: '0.72rem',
                fontWeight: 500,
              }}
            >
              County Citizen Service Hub
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Actions & User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Quick Report Button */}
          <Button
            component={Link}
            to="/requests/new"
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              bgcolor: '#0F8B8D',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#0c7375' },
            }}
          >
            Report Issue
          </Button>

          {/* Notifications Button */}
          <Tooltip title="View Notifications">
            <IconButton
              onClick={() => navigate('/dashboard')}
              sx={{
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                '&:hover': { bgcolor: '#F1F5F9' },
              }}
            >
              <Badge color="error" variant="dot">
                <NotificationsIcon sx={{ color: '#64748B', fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Citizen User Profile Chip */}
          <Box
            component={Link}
            to="/profile"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: 1,
              borderLeft: '1px solid #E2E8F0',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: '#0F8B8D',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user?.fullName?.charAt(0) || 'C'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#12304A', lineHeight: 1.1 }}>
                {user?.fullName || 'Resident'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                View Profile
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
