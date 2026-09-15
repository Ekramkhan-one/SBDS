// src/components/PublicNavbar.jsx
// Top navigation bar for public marketing pages (Home, About, Contact, etc.).
// Always shows Login and Sign Up, regardless of auth state — these are pure
// marketing pages, not part of the logged-in app shell, so no "Dashboard"
// link is shown here even when a user happens to be logged in.

import { Link, useLocation } from 'react-router-dom';
import { Droplet } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export default function PublicNavbar() {
  const { pathname } = useLocation();

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      <Link to="/" className="flex items-center gap-2">
        <Droplet size={26} className="text-brand-red" fill="currentColor" fillOpacity={0.15} />
        <div className="leading-tight">
          <p className="font-extrabold text-sm text-brand-dark">
            SMART BLOOD <span className="font-normal">DONATION SYSTEM</span>
          </p>
          <p className="text-[10px] text-brand-red tracking-wide font-semibold">FOR PESHAWAR</p>
        </div>
      </Link>

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

      <div className="flex items-center gap-3">
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
    </header>
  );
}
