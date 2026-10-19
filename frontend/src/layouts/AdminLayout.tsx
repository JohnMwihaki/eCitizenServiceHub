import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getPageTitle = (path: string): string => {
    if (path.startsWith('/admin/requests/')) return 'Request Processing Workspace';
    if (path === '/admin/requests') return 'Citizen Requests Inbox';
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/map') return 'Geographic Issues Map';
    if (path === '/admin/categories') return 'Service Categories Management';
    if (path === '/admin/reports') return 'Operational Reports & Export';
    return 'Administrator Portal';
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        {/* Navigation Sidebar */}
        <AdminSidebar
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
          <AdminHeader
            onToggleSidebar={handleToggleSidebar}
            title={getPageTitle(location.pathname)}
            isCollapsed={isCollapsed}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              bgcolor: '#F8FAFC',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};
