// src/components/Sidebar.jsx
// Left sidebar navigation, matching the dashboard mockup:
// logo header, nav links with icons, active-state highlighting,
// and a bottom "In Emergency?" CTA box.
//
// Responsive behaviour:
//   - lg and up: always-visible, sticky sidebar.
//   - below lg:  off-canvas drawer controlled by the isOpen / onClose props
//     (DashboardLayout owns the state, the Topbar hamburger opens it).

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Search,
  Bell,
  MessageCircle,
  Mail,
  User,
  ShieldCheck,
  BarChart3,
  Settings,
  HelpCircle,
  Droplet,
  X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/donor-management', label: 'Donor Management', icon: Users, adminOnly: true },
  { to: '/donors', label: 'Search Donors', icon: Search },
  { to: '/emergency', label: 'Emergency Requests', icon: Bell },
  { to: '/communication', label: 'Communication', icon: MessageCircle, badge: 'New' },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/admin', label: 'Admin Panel', icon: ShieldCheck, adminOnly: true },
  { to: '/messages', label: 'Contact Messages', icon: Mail, adminOnly: true },
  { to: '/reports', label: 'Reports & Analytics', icon: BarChart3, adminOnly: true },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help & Support', icon: HelpCircle }
];

export default function Sidebar({ user, isOpen = false, onClose = () => {} }) {
  return (
    <aside
      className={`w-64 h-screen fixed top-0 shrink-0 bg-gradient-to-b from-brand-maroon to-brand-maroon-dark text-white flex flex-col
        fixed inset-y-0 left-0 z-40 transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-30`}
    >
      {/* Logo header */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="bg-white/10 p-2 rounded-lg">
          <Droplet size={22} className="text-white" fill="white" fillOpacity={0.9} />
        </div>
        <div className="leading-tight flex-1">
          <p className="font-bold text-sm">SMART BLOOD</p>
          <p className="font-bold text-sm">DONATION SYSTEM</p>
          <p className="text-[10px] text-white/60 tracking-wide">FOR PESHAWAR</p>
        </div>
        {/* Close button - only shown while it works as a drawer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-3 space-y-1">
        {navItems
          .filter((item) => !item.adminOnly || user?.isAdmin)
          .map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-brand-maroon font-semibold shadow-soft'
                    : 'text-white/85 hover:bg-white/10'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </span>
              {badge && (
                <span className="bg-status-available text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
      </nav>

      {/* Emergency CTA box */}
      <div className="m-3 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-2xl p-4 shadow-glow">
        <p className="font-semibold text-sm">In Emergency?</p>
        <p className="text-xs text-white/80 mt-0.5">Every Second Counts</p>
        <NavLink
          to="/emergency"
          onClick={onClose}
          className="block text-center bg-white text-brand-red font-semibold text-sm mt-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Request Blood Now
        </NavLink>
      </div>
    </aside>
  );
}
