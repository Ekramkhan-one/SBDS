// src/pages/ReportsPage.jsx
// Admin Reports & Analytics: real charts built from live aggregated data
// (blood group distribution, area distribution, emergency request breakdowns).

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import { fetchReportsData, fetchAdminStats } from '../api/adminApi';

const BAR_COLOR = '#C41E3A';
const PIE_COLORS = ['#C41E3A', '#7A1B2B', '#D97706', '#16A34A', '#7c3aed', '#0ea5e9'];

// Converts a {label: count} map into the [{name, value}] shape Recharts expects.
const toChartData = (map) =>
  Object.entries(map || {}).map(([name, value]) => ({ name, value }));

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [reportsData, statsData] = await Promise.all([fetchReportsData(), fetchAdminStats()]);
        setReports(reportsData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load reports data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-400 py-20">Loading reports...</p>
      </DashboardLayout>
    );
  }

  const bloodGroupData = toChartData(reports?.bloodGroupBreakdown);
  const areaData = toChartData(reports?.areaBreakdown).slice(0, 8); // top 8 areas, avoids an overcrowded chart
  const urgencyData = toChartData(reports?.requestsByUrgency);
  const statusData = toChartData(reports?.requestsByStatus);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-brand-dark">Reports &amp; Analytics</h1>
        <p className="text-sm text-gray-500">System-wide insights based on live data.</p>
      </div>

      {/* Top summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <SummaryBox label="Total Donors" value={stats?.totalDonors ?? 0} />
        <SummaryBox label="Verified Donors" value={stats?.verifiedDonors ?? 0} />
        <SummaryBox label="Areas Covered" value={stats?.areasCovered ?? 0} />
        <SummaryBox label="Active Requests" value={stats?.activeRequests ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Blood group distribution */}
        <ChartCard title="Donors by Blood Group">
          {bloodGroupData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bloodGroupData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Area distribution */}
        <ChartCard title="Top Areas by Donor Count">
          {areaData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={areaData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                <Tooltip />
                <Bar dataKey="value" fill="#7A1B2B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Emergency requests by urgency */}
        <ChartCard title="Emergency Requests by Urgency">
          {urgencyData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie data={urgencyData} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {urgencyData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Legend data={urgencyData} />
            </div>
          )}
        </ChartCard>

        {/* Emergency requests by status */}
        <ChartCard title="Emergency Requests by Status">
          {statusData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Legend data={statusData} />
            </div>
          )}
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xl font-bold text-brand-dark">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="font-semibold text-brand-dark mb-4 text-sm">{title}</h2>
      {children}
    </div>
  );
}

function Legend({ data }) {
  return (
    <div className="space-y-2 text-xs">
      {data.map((item, i) => (
        <p key={item.name} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
          />
          {item.name} ({item.value})
        </p>
      ))}
    </div>
  );
}

function EmptyState() {
  return <p className="text-sm text-gray-400 text-center py-16">Not enough data yet.</p>;
}
