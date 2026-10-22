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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <Droplet
            size={26}
            className="text-brand-red shrink-0"
            fill="currentColor"
            fillOpacity={0.15}
          />
          <div className="leading-tight min-w-0">
            <p className="font-extrabold text-xs sm:text-sm text-brand-dark">
              SMART BLOOD <span className="font-normal">DONATION SYSTEM</span>
            </p>
            <p className="text-[10px] text-brand-red tracking-wide font-semibold">FOR PESHAWAR</p>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`pb-1 border-b-2 transition-colors ${
                pathname === link.to
                  ? 'text-brand-red border-brand-red'
                  : 'text-gray-600 border-transparent hover:text-brand-red'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-brand-red text-sm font-medium px-4 py-2 rounded-lg border border-brand-red hover:bg-red-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 shadow-md">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`py-3 text-sm font-medium border-b border-gray-100 ${
                  pathname === link.to ? 'text-brand-red' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3 mt-4">
            <Link
              to="/login"
              className="flex-1 text-center text-brand-red text-sm font-medium px-4 py-2.5 rounded-lg border border-brand-red hover:bg-red-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
