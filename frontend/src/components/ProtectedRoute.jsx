// src/components/ProtectedRoute.jsx
// Wraps routes that require a logged-in user. Redirects to /login otherwise.
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until we've checked localStorage before deciding to redirect -
  // otherwise a logged-in user gets bounced to /login on every page refresh
  // for a split second before context finishes loading.
  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
