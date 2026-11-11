// src/components/Topbar.jsx
// Top header bar: menu button (mobile), search, quick WhatsApp contact,
// notifications (live bell dropdown), user menu.

import { useCallback, useEffect, useState } from 'react';
import { Search, MessageCircle, Bell, ChevronDown, Menu, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../api/notificationApi';

const POLL_INTERVAL_MS = 60000; // check for new notifications every minute

const timeAgo = (dateString) => {
  const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} d ago`;
};

export default function Topbar({ onMenuClick = () => {} }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Silent: a failed poll should never disturb the page
    }
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    loadNotifications();
    const timer = setInterval(loadNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [user, loadNotifications]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Route to the donor search page with the term as a query param;
      // SearchDonorsPage reads this to pre-fill/apply the filter.
      navigate(`/donors?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleNotificationClick = async (notification) => {
    setBellOpen(false);
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      try {
        await markNotificationRead(notification._id);
      } catch {
        loadNotifications();
      }
    }
    navigate('/emergency');
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      loadNotifications();
    }
  };

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-gray-100 px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-4 sticky top-0 z-20">
      {/* Hamburger: opens the sidebar drawer below lg */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
      >
        <Menu size={22} />
      </button>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl min-w-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donors..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red sm:hidden"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donors by blood group, area or BRT station..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red hidden sm:block"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={16} className="text-status-available" />
          <div className="text-xs leading-tight">
            <p className="font-medium text-gray-800">Quick Contact</p>
            <p className="text-gray-400">via WhatsApp</p>
          </div>
        </a>

        {/* Notification bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setBellOpen((prev) => !prev);
              setMenuOpen(false);
            }}
            aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs text-brand-red hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-400">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                        n.isRead ? '' : 'bg-red-50/60'
                      }`}
                    >
                      <Droplet
                        size={16}
                        className="text-brand-red shrink-0 mt-0.5"
                        fill="currentColor"
                        fillOpacity={0.2}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setBellOpen(false);
            }}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-1 sm:px-2 py-1 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-brand-maroon text-white flex items-center justify-center font-semibold text-sm">
              {user?.fullName?.charAt(0) || '?'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {user?.fullName || 'Guest'}
              </p>
              <p className="text-xs text-gray-400 leading-tight capitalize">{user?.role || ''}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-4 py-2 text-sm text-brand-red hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
