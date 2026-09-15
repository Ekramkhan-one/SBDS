// src/pages/DashboardPage.jsx
// Role-based dashboard entry point: same URL (/dashboard) renders different
// content depending on whether the logged-in user is an admin or a regular
// donor/recipient. Keeps navigation simple (one "Dashboard" link that adapts)
// while keeping the two experiences' code fully separate and easy to extend.

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import UserDashboardView from './UserDashboardView';
import AdminDashboardView from './AdminDashboardView';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {user?.isAdmin ? <AdminDashboardView /> : <UserDashboardView />}
    </DashboardLayout>
  );
}
