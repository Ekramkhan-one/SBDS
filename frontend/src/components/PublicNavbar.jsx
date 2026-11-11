// src/components/PublicNavbar.jsx
// Top navigation bar for public marketing pages (Home, About, Contact, etc.).
// Always shows Login and Sign Up, regardless of auth state — these are pure
// marketing pages, not part of the logged-in app shell, so no "Dashboard"
// link is shown here even when a user happens to be logged in.
//
// Responsive behaviour:
//   - md and up: inline links + Login / Sign Up buttons in the header.
//   - below md:  a hamburger button toggles a dropdown panel holding the
//     same links and buttons.

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export default function PublicNavbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-maroon flex items-center justify-center shadow-glow shrink-0">
            <Droplet size={20} className="text-white" fill="currentColor" />
          </span>
          <div className="leading-tight min-w-0">
            <p className="font-display font-extrabold text-[13px] sm:text-sm text-brand-dark tracking-tight">
              SMART BLOOD <span className="font-semibold text-gray-500">DONATION SYSTEM</span>
            </p>
            <p className="text-[10px] text-brand-red tracking-[0.2em] font-bold">FOR PESHAWAR</p>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg ${
                  active
                    ? 'text-brand-red bg-brand-blush'
                    : 'text-gray-600 hover:text-brand-red hover:bg-brand-blush/70'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-700 hover:text-brand-red px-4 py-2 rounded-lg"
          >
            Login
          </Link>
          <Link to="/register" className="btn-primary !py-2.5">
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-brand-blush hover:text-brand-red"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-3 shadow-soft animate-fade-up">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-3 py-3 rounded-xl text-sm font-medium ${
                  pathname === link.to
                    ? 'text-brand-red bg-brand-blush'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3 mt-4">
            <Link to="/login" className="btn-outline flex-1">
              Login
            </Link>
            <Link to="/register" className="btn-primary flex-1">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
