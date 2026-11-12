// src/pages/ForgotPasswordPage.jsx
// UI placeholder for password reset - not yet wired to a real email-based
// reset flow (that requires a backend email service and reset tokens).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthBackdrop from '../components/AuthBackdrop';
import AuthHeader from '../components/AuthHeader';
import PublicNavbar from '../components/PublicNavbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend email flow yet - this is a UI placeholder for now.
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <PublicNavbar />
      <div className="relative flex-1 flex items-center justify-center py-12 px-4">
        <AuthBackdrop />

        <div className="w-full max-w-md animate-fade-up">
          <AuthHeader />

          <div className="bg-white rounded-2xl shadow-xl p-7">
          <h2 className="text-xl font-bold text-brand-dark text-center">Reset Password</h2>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Enter your email and we'll send you a reset link
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-status-available text-sm px-4 py-3 rounded-lg text-center">
              Password reset isn't available yet — this is a preview of the flow. Please contact
              support for help accessing your account.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-brand-red mt-5"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
