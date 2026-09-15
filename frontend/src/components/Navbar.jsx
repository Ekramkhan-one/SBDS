// src/components/Navbar.jsx
// Top navigation bar - adapts links based on whether a user is logged in.

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-tight">
        SBDS <span className="text-brand-red">Peshawar</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <Link to="/donors" className="hover:text-brand-red transition-colors">
          Find Donors
        </Link>
        <Link to="/emergency" className="hover:text-brand-red transition-colors">
          Emergency Board
        </Link>

        {user ? (
          <>
            <span className="text-gray-300">
              Hi, {user.fullName.split(' ')[0]}
              {user.isVerified && (
                <span className="ml-1 text-green-400" title="CNIC Verified">
                  ✓
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="bg-brand-red hover:bg-brand-red-dark px-4 py-1.5 rounded-md transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-brand-red transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-brand-red hover:bg-brand-red-dark px-4 py-1.5 rounded-md transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
