// src/components/QuickActionCard.jsx
// Clickable card for the 4 quick actions on the dashboard
// (Donor Management, Search Donors, Emergency Requests, Communication).

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ icon: Icon, iconBg, iconColor, title, description, linkText, linkColor, to }) {
  return (
    <Link
      to={to}
      className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-soft hover:-translate-y-1 hover:shadow-lift block"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <p className="font-display font-bold text-sm text-brand-dark">{title}</p>
      <p className="text-sm text-gray-500 mt-1.5 mb-4 leading-relaxed">{description}</p>
      <span className={`text-sm font-semibold flex items-center gap-1.5 ${linkColor}`}>
        {linkText}
        <ArrowRight size={14} className="group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
