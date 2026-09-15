// src/context/AuthContext.jsx
// Global auth state: current user, login/register/logout actions.
// Persists to localStorage so refreshing the page doesn't log the user out.

import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sbds_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first mount, restore the session from localStorage if it exists.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // If stored data is corrupted for any reason, clear it rather than crash
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Register a new donor/recipient. Throws on failure so the calling
  // component can display the error message (see RegisterPage).
  const register = async (formData) => {
    const { data } = await axiosInstance.post('/auth/register', formData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Log in an existing user.
  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // Used after actions like toggling availability, so the rest of the app
  // (e.g. Navbar showing status) reflects the change immediately.
  const updateUser = (partialUpdate) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialUpdate };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components do `const { user } = useAuth()` instead of
// importing useContext + AuthContext everywhere.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
