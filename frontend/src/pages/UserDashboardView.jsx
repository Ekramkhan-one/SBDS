// src/pages/UserDashboardView.jsx
// Dashboard content shown to regular donor/recipient users.
// (Same content that was previously in DashboardPage.jsx directly.)

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Droplet, Bus, ShieldCheck, Phone, MessageCircle, CheckCircle2, Search, Bell, MessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';
import { fetchDashboardStats, fetchRecentDonors } from '../api/donorApi';
import { fetchEmergencyRequests } from '../api/emergencyApi';
import { buildWhatsAppLink } from '../utils/whatsapp';

const PIE_COLORS = ['#16A34A', '#D97706'];

export default function UserDashboardView() {
  const [stats, setStats] = useState(null);
  const [recentDonors, setRecentDonors] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, donorsData, emergencyData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentDonors(4),
          fetchEmergencyRequests()
        ]);
        setStats(statsData);
        setRecentDonors(donorsData.donors);
        setEmergencyRequests(emergencyData.requests.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const pieData = stats
    ? [
        { name: 'Available', value: stats.availability.available },
        { name: 'Not Available', value: stats.availability.notAvailable }
      ]
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-5">
        {/* Hero banner */}
        <div className="bg-gradient-to-br from-pink-50 to-red-50 border border-red-100 rounded-xl p-6 flex items-center justify-between overflow-hidden">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Save Lives, Donate Blood</h1>
            <p className="text-brand-red font-semibold mt-0.5">Be a Hero in Someone's Life</p>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              A simple act of kindness can save a life. Join thousands of verified donors in
              Peshawar.
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                to="/register"
                className="bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Droplet size={15} /> Donate Blood
              </Link>
              <Link
                to="/donors"
                className="border border-gray-300 bg-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <Droplet size={90} className="text-brand-red/20 hidden sm:block" fill="currentColor" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            iconColor="bg-red-50 text-brand-red"
            value={loading ? '...' : `${stats?.totalDonors ?? 0}+`}
            label="Total Donors"
          />
          <StatCard
            icon={Droplet}
            iconColor="bg-red-50 text-brand-red"
            value={loading ? '...' : `${stats?.areasCovered ?? 0}+`}
            label="Areas Covered"
            trend="Peshawar"
            trendColor="text-status-available"
          />
          <StatCard
            icon={Bus}
            iconColor="bg-red-50 text-brand-red"
            value="25+"
            label="BRT Stations"
            trend="Connected"
            trendColor="text-status-available"
          />
          <StatCard
            icon={ShieldCheck}
            iconColor="bg-red-50 text-brand-red"
            value={loading ? '...' : `${stats?.verifiedDonors ?? 0}+`}
            label="Verified Donors"
            trend="CNIC Verified"
            trendColor="text-status-available"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            icon={Users}
            iconBg="bg-red-50"
            iconColor="text-brand-red"
            title="Donor Management"
            description="Add, update and manage donor information"
            linkText="Manage Donors"
            linkColor="text-brand-red"
            to="/donor-management"
          />
          <QuickActionCard
            icon={Search}
            iconBg="bg-green-50"
            iconColor="text-status-available"
            title="Search Donors"
            description="Search donors by blood group, area or BRT station"
            linkText="Search Now"
            linkColor="text-status-available"
            to="/donors"
          />
          <QuickActionCard
            icon={Bell}
            iconBg="bg-orange-50"
            iconColor="text-status-unavailable"
            title="Emergency Requests"
            description="Post or view emergency blood requests"
            linkText="View Requests"
            linkColor="text-status-unavailable"
            to="/emergency"
          />
          <QuickActionCard
            icon={MessageSquare}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            title="Communication"
            description="Contact donors instantly via WhatsApp"
            linkText="Start Chat"
            linkColor="text-purple-600"
            to="/communication"
          />
        </div>

        {/* Recent donors table */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-brand-dark">Recent Donors</h2>
            <Link to="/donor-management" className="text-xs text-brand-red font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Blood Group</th>
                  <th className="py-2 font-medium">Area</th>
                  <th className="py-2 font-medium">Availability</th>
                  <th className="py-2 font-medium">Verified</th>
                  <th className="py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : recentDonors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      No donors registered yet.
                    </td>
                  </tr>
                ) : (
                  recentDonors.map((donor) => (
                    <tr key={donor._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-maroon text-white text-xs flex items-center justify-center font-semibold">
                          {donor.fullName.charAt(0)}
                        </div>
                        {donor.fullName}
                      </td>
                      <td className="py-3 text-brand-red font-semibold">{donor.bloodGroup}</td>
                      <td className="py-3 text-gray-600">{donor.area}</td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            donor.availabilityStatus === 'Available'
                              ? 'bg-green-50 text-status-available'
                              : 'bg-orange-50 text-status-unavailable'
                          }`}
                        >
                          {donor.availabilityStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        {donor.isVerified ? (
                          <CheckCircle2 size={16} className="text-status-available" />
                        ) : (
                          <CheckCircle2 size={16} className="text-gray-300" />
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <a
                            href={buildWhatsAppLink(donor.phoneNumber, donor.fullName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-green-50 text-status-available hover:bg-green-100"
                          >
                            <MessageCircle size={14} />
                          </a>
                          <a
                            href={`tel:${donor.phoneNumber}`}
                            className="p-1.5 rounded-md bg-red-50 text-brand-red hover:bg-red-100"
                          >
                            <Phone size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-5">
        {/* Emergency requests panel */}
        <div className="bg-brand-red rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Emergency Requests</h2>
            <Link to="/emergency" className="text-xs text-white/80 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {emergencyRequests.length === 0 ? (
              <p className="text-xs text-white/70">No active emergency requests.</p>
            ) : (
              emergencyRequests.map((req) => (
                <div key={req._id} className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{req.requiredBloodGroup}</span>
                    <span className="bg-white text-brand-red text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {req.urgencyLevel}
                    </span>
                  </div>
                  <p className="text-xs mt-1">
                    Urgent: {req.unitsNeeded} unit{req.unitsNeeded > 1 ? 's' : ''} needed
                  </p>
                  <p className="text-xs text-white/80 mt-0.5">{req.hospital}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System overview donut chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold text-sm text-brand-dark mb-3">System Overview</h2>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={2}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs space-y-1.5">
              <p className="font-bold text-brand-dark text-sm">
                {stats?.totalDonors ?? 0} <span className="font-normal text-gray-400">Total</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-available inline-block" />
                Available ({stats?.availability?.available ?? 0})
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-unavailable inline-block" />
                Not Available ({stats?.availability?.notAvailable ?? 0})
              </p>
            </div>
          </div>
        </div>

        {/* CNIC verified box */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-status-available">
              {stats?.verifiedDonors ?? 0}+ Donors
            </p>
            <p className="text-xs text-gray-500 mt-0.5">are CNIC Verified</p>
            <p className="text-xs text-gray-400 mt-1">Help build a trusted community</p>
          </div>
          <ShieldCheck size={36} className="text-status-available" />
        </div>
      </div>
    </div>
  );
}
