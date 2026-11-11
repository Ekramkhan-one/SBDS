// src/components/StatCard.jsx
// Small stat box: icon, big number, label, and an optional trend line.
// Used for "Total Donors", "Areas Covered", "BRT Stations", "Verified Donors".

export default function StatCard({ icon: Icon, iconColor, value, label, trend, trendColor }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-soft hover:-translate-y-0.5 hover:shadow-lift">
      <div className={`p-2.5 rounded-xl ${iconColor}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-extrabold text-brand-dark leading-tight">{value}</p>
        <p className="text-sm text-gray-600 mt-0.5">{label}</p>
        {trend && <p className={`text-xs font-medium mt-1 ${trendColor}`}>{trend}</p>}
      </div>
    </div>
  );
}
