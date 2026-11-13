// src/components/DashboardLayout.jsx
// Shell layout for all logged-in dashboard pages: Sidebar + Topbar + content area.
// Used by wrapping page components, e.g.:
//   <DashboardLayout><DashboardPage /></DashboardLayout>
//
// On large screens (lg+) the sidebar is always visible. On smaller screens it
// becomes a slide-in drawer opened from the hamburger button in the Topbar.

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, notificationCount }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close the drawer with the Escape key
  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Dark backdrop behind the drawer (mobile/tablet only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar
          notificationCount={notificationCount}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
