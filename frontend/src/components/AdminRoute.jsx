// src/components/AdminRoute.jsx
// Wraps routes that require an admin account, not just any logged-in user.
// Non-admins are redirected to /dashboard (their own view) rather than /login,
// since they ARE logged in - they just lack the required role.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
