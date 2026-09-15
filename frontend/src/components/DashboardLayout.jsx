// src/components/DashboardLayout.jsx
// Shell layout for all logged-in dashboard pages: Sidebar + Topbar + content area.
// Used by wrapping page components, e.g.:
//   <DashboardLayout><DashboardPage /></DashboardLayout>

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, notificationCount }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar notificationCount={notificationCount} />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
