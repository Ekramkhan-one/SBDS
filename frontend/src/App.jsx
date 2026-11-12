// src/App.jsx
// Top-level route definitions.
// Public marketing pages (Home, About, Contact) use PublicNavbar.
// Auth pages (Login, Register, Forgot Password) render full-page with their
// own branded backdrop - no navbar, matching the dedicated auth design.
// Authenticated app pages (dashboard, donors, emergency) use the
// sidebar-based DashboardLayout and are wrapped in ProtectedRoute, so a
// logged-out visitor is always redirected to /login before reaching them.
// Admin-only pages are additionally wrapped in AdminRoute.

import { Routes, Route } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchDonorsPage from './pages/SearchDonorsPage';
import EmergencyRequestsPage from './pages/EmergencyRequestsPage';
import ProfilePage from './pages/ProfilePage';
import DonorManagementPage from './pages/DonorManagementPage';
import ContactMessagesPage from './pages/ContactMessagesPage';
import CommunicationPage from './pages/CommunicationPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <PageTransition>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Everything below requires login - ProtectedRoute redirects to /login otherwise */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donors"
        element={
          <ProtectedRoute>
            <SearchDonorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <EmergencyRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute>
            <CommunicationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpSupportPage />
          </ProtectedRoute>
        }
      />

      {/* Admin-only pages */}
      <Route
        path="/donor-management"
        element={
          <AdminRoute>
            <DonorManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <AdminRoute>
            <ReportsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <AdminRoute>
            <ContactMessagesPage />
          </AdminRoute>
        }
      />

      {/* Remaining footer placeholder pages */}
      <Route path="/privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
      <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
      <Route path="/how-it-works" element={<PlaceholderPage title="How It Works" />} />
      </Routes>
    </PageTransition>
  );
}

export default App;
