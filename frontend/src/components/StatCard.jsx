// src/components/StatCard.jsx
// Small stat box: icon, big number, label, and an optional trend line.
// Used for "Total Donors", "Areas Covered", "BRT Stations", "Verified Donors".

export default function StatCard({ icon: Icon, iconColor, value, label, trend, trendColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xl font-bold text-brand-dark leading-tight">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {trend && <p className={`text-xs font-medium mt-0.5 ${trendColor}`}>{trend}</p>}
      </div>
    </div>
  );
}
