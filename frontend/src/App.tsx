import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CitizenLayout } from './layouts/CitizenLayout';
import { CitizenPortalLayout } from './layouts/CitizenPortalLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Citizen Public Pages
import { HomePage } from './pages/citizen/HomePage';
import { AboutPage } from './pages/citizen/AboutPage';
import { ServicesPage } from './pages/citizen/ServicesPage';
import { HelpPage } from './pages/citizen/HelpPage';
import { LoginPage } from './pages/citizen/LoginPage';
import { RegisterPage } from './pages/citizen/RegisterPage';
import { TrackRequestPage } from './pages/citizen/TrackRequestPage';

// Citizen Portal Authenticated Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { NewRequestPage } from './pages/citizen/NewRequestPage';
import { CitizenRequestsPage } from './pages/citizen/CitizenRequestsPage';
import { RequestDetailPage } from './pages/citizen/RequestDetailPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminRequestsInboxPage } from './pages/admin/AdminRequestsInboxPage';
import { AdminRequestDetailPage } from './pages/admin/AdminRequestDetailPage';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/*Public Citizen Hub  */}
      <Route element={<CitizenLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/track" element={<TrackRequestPage />} />
        <Route path="/track/:reference" element={<TrackRequestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/*  Authenticated Citizen Portal  */}
      <Route element={<CitizenPortalLayout />}>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/requests/new" element={<NewRequestPage />} />
        <Route path="/requests" element={<CitizenRequestsPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/portal/services" element={<ServicesPage />} />
        <Route path="/portal/help" element={<HelpPage />} />
        <Route path="/portal/track" element={<TrackRequestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Administrator Portal */}
      
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Workspace  */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="requests" element={<AdminRequestsInboxPage />} />
        <Route path="requests/:id" element={<AdminRequestDetailPage />} />
        <Route path="map" element={<AdminMapPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
