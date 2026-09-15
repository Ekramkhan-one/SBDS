// src/pages/SettingsPage.jsx
// Account settings: change password (functional), plus account info summary.

import { useState } from 'react';
import { Lock, Eye, EyeOff, LogOut } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { changeMyPassword } from '../api/authApi';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (newPassword !== confirmNewPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSaving(true);
    try {
      await changeMyPassword(currentPassword, newPassword);
      setStatusMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-bold text-brand-dark">Settings</h1>
        <p className="text-sm text-gray-500 mb-5">Manage your account security and session.</p>

        {/* Change Password */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <h2 className="font-semibold text-brand-dark mb-1">Change Password</h2>
          <p className="text-xs text-gray-400 mb-4">
            Use a password you don't use elsewhere, at least 6 characters long.
          </p>

          {statusMsg.text && (
            <div
              className={`text-sm px-4 py-2.5 rounded-lg mb-4 ${
                statusMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-status-available'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              show={showPasswords}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showPasswords}
                required
                minLength={6}
              />
              <PasswordField
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                show={showPasswords}
                required
                minLength={6}
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <h2 className="font-semibold text-brand-dark mb-3">Account</h2>
          <div className="text-sm text-gray-600 space-y-1.5">
            <p>
              <span className="text-gray-400">Email:</span> {user?.email}
            </p>
            <p>
              <span className="text-gray-400">Role:</span>{' '}
              <span className="capitalize">{user?.role}</span>
              {user?.isAdmin && ' (Admin)'}
            </p>
          </div>
        </div>

        {/* Session */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-3">Session</h2>
          <button
            onClick={logout}
            className="flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PasswordField({ label, show, ...props }) {
  const [localShow, setLocalShow] = useState(false);
  const isVisible = show || localShow;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          {...props}
          type={isVisible ? 'text' : 'password'}
          className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
        {!show && (
          <button
            type="button"
            onClick={() => setLocalShow((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {localShow ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
