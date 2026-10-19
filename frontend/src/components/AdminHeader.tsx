import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  InputBase,
  Paper,
  Tooltip,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
  isCollapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title,
  isCollapsed = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/requests?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
        {/* Left Section Hamburger & Page Title */}
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
              County Government Operations
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Search, Citizen Link, Notifications & Admin Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Global Admin Search */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              p: '2px 10px',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              width: { md: 240, lg: 320 },
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 2,
              boxShadow: 'none',
              '&:focus-within': { borderColor: '#0F8B8D', bgcolor: '#FFFFFF' },
            }}
          >
            <SearchIcon sx={{ color: '#94A3B8', fontSize: 20, mr: 1 }} />
            <InputBase
              placeholder="Search reference, citizen, ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ fontSize: '0.85rem', flex: 1 }}
            />
          </Paper>

          {/* Quick link to citizen portal */}
          <Button
            component={Link}
            to="/"
            target="_blank"
            size="small"
            startIcon={<PublicIcon fontSize="small" />}
            sx={{
              display: { xs: 'none', lg: 'inline-flex' },
              color: '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              '&:hover': { bgcolor: '#F1F5F9' },
            }}
          >
            Citizen Portal
          </Button>

          {/* Notifications Button */}
          <Tooltip title="View Request Inbox">
            <IconButton
              onClick={() => navigate('/admin/requests')}
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

          {/* Admin User Chip */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: 1,
              borderLeft: '1px solid #E2E8F0',
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: '#12304A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user?.fullName?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#12304A', lineHeight: 1.1 }}>
                {user?.fullName || 'Administrator'}
              </Typography>
              <Chip
                label="ADMIN"
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  bgcolor: '#D97706',
                  color: '#FFFFFF',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
