// src/components/Topbar.jsx
// Top header bar: search, quick WhatsApp contact, notifications, user menu.

import { useState } from 'react';
import { Search, MessageCircle, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Route to the donor search page with the term as a query param;
      // SearchDonorsPage reads this to pre-fill/apply the filter.
      navigate(`/donors?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donors by blood group, area or BRT station..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>
      </form>

      <div className="flex items-center gap-3">
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

        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
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
            <ChevronDown size={16} className="text-gray-400" />
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
