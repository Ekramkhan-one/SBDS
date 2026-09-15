// src/pages/RegisterPage.jsx
// Registration form for both donors and recipients, styled to match the
// two-column icon-input mockup with password confirmation and a terms checkbox.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, CreditCard, Mail, Phone, Droplet, MapPin, Bus, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS, PESHAWAR_AREAS, BRT_STATIONS } from '../data/peshawarData';
import AuthBackdrop from '../components/AuthBackdrop';
import AuthHeader from '../components/AuthHeader';

const initialFormState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  cnicNumber: '',
  role: 'donor',
  bloodGroup: '',
  area: '',
  preferredBrtStation: ''
};

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      // confirmPassword is only for client-side validation - strip it before
      // sending to the API, which only expects the actual password field.
      const { confirmPassword, ...payload } = formData;
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      <AuthBackdrop />

      <div className="w-full max-w-2xl">
        <AuthHeader />

        <div className="bg-white rounded-2xl shadow-xl p-7">
          <h2 className="text-xl font-bold text-brand-dark text-center">Create Account</h2>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Join us and help save more lives
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <IconInput
                icon={User}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                minLength={3}
              />
              <IconInput
                icon={CreditCard}
                name="cnicNumber"
                value={formData.cnicNumber}
                onChange={handleChange}
                placeholder="CNIC Number"
                required
                pattern="\d{13}"
                title="13 digits, no dashes"
              />
            </div>

            <IconInput
              icon={Mail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <IconInput
                icon={Phone}
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                pattern="03\d{9}"
                title="Format: 03XXXXXXXXX"
              />
              <IconSelect icon={Droplet} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                <option value="" disabled>
                  Blood Group
                </option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </IconSelect>
            </div>

            <IconSelect icon={MapPin} name="area" value={formData.area} onChange={handleChange} required>
              <option value="" disabled>
                Select Area in Peshawar
              </option>
              {PESHAWAR_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </IconSelect>

            <IconSelect
              icon={Bus}
              name="preferredBrtStation"
              value={formData.preferredBrtStation}
              onChange={handleChange}
            >
              <option value="">Select BRT Station (Preferred)</option>
              {BRT_STATIONS.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </IconSelect>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">I am a</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                >
                  <option value="donor">Donor</option>
                  <option value="recipient">Recipient</option>
                </select>
              </div>
              <div />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                show={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                required
                minLength={6}
              />
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
                required
                minLength={6}
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-600 pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-brand-red font-medium hover:underline">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-brand-red font-medium hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              <UserPlus size={16} /> {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-5 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-red font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
      />
    </div>
  );
}

function IconSelect({ icon: Icon, children, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <select
        {...props}
        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red appearance-none bg-white"
      >
        {children}
      </select>
    </div>
  );
}

function PasswordInput({ show, onToggle, ...props }) {
  return (
    <div className="relative">
      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
