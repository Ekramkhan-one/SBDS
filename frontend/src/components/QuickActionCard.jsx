// src/components/QuickActionCard.jsx
// Clickable card for the 4 quick actions on the dashboard
// (Donor Management, Search Donors, Emergency Requests, Communication).

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ icon: Icon, iconBg, iconColor, title, description, linkText, linkColor, to }) {
  return (
    <Link
      to={to}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow block"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <p className="font-semibold text-sm text-brand-dark">{title}</p>
      <p className="text-xs text-gray-500 mt-1 mb-3">{description}</p>
      <span className={`text-xs font-medium flex items-center gap-1 ${linkColor}`}>
        {linkText} <ArrowRight size={13} />
      </span>
    </Link>
  );
}
