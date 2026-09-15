// src/pages/PlaceholderPage.jsx
// Generic "Coming Soon" page for routes that don't have full content yet
// (footer links like Privacy Policy, Terms & Conditions, How It Works, etc.)

import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center py-32 px-6">
        <Construction size={40} className="text-brand-red mb-4" />
        <h1 className="text-2xl font-bold text-brand-dark mb-2">{title}</h1>
        <p className="text-gray-500 mb-6">This page is coming soon.</p>
        <Link to="/" className="text-brand-red font-medium hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      <PublicFooter />
    </div>
  );
}
