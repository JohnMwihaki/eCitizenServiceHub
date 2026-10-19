import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { CitizenSidebar } from '../components/CitizenSidebar';
import { CitizenPortalHeader } from '../components/CitizenPortalHeader';
import { AIAssistantWidget } from '../components/AIAssistantWidget';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const CitizenPortalLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getPageTitle = (path: string): string => {
    if (path.startsWith('/requests/new')) return 'Report Community Issue';
    if (path.startsWith('/requests/')) return 'Request Details & Timeline';
    if (path === '/requests') return 'My Submitted Requests';
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/portal/services') return 'County Services Directory';
    if (path === '/portal/help') return 'Citizen Help & FQAs';
    if (path === '/portal/track') return 'Track Request by Reference';
    if (path === '/profile') return 'My Citizen Profile';
    return 'Citizen Portal';
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F8FA' }}>
        {/* Navigation Sidebar */}
        <CitizenSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            transition: 'all 0.25s ease-in-out',
          }}
        >
          <CitizenPortalHeader
            onToggleSidebar={handleToggleSidebar}
            title={getPageTitle(location.pathname)}
            isCollapsed={isCollapsed}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              bgcolor: '#F5F8FA',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Outlet />
          </Box>
        </Box>

        {/* AI Assistant Chatbot widget accessible inside citizen portal */}
        <Box style={{ position: 'fixed', bottom: 16, right: 0, zIndex: 1300 }}>
          <AIAssistantWidget  />
        </Box>
      </Box>
    </ProtectedRoute>
  );
};
