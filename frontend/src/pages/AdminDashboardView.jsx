// src/pages/AdminDashboardView.jsx
// Dashboard content shown to admin users: system-wide stats, donor
// verification queue (approve/reject), and all emergency requests.

import { useEffect, useState } from 'react';
import { Users, ShieldCheck, Clock, Bell, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import StatCard from '../components/StatCard';
import {
  fetchAdminStats,
  fetchAllDonorsForAdmin,
  verifyDonorAdmin,
  unverifyDonorAdmin,
  fetchAllEmergencyRequestsForAdmin
} from '../api/adminApi';

export default function AdminDashboardView() {
  const [stats, setStats] = useState(null);
  const [pendingDonors, setPendingDonors] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null); // tracks which row's button is mid-request

  const loadData = async () => {
    try {
      const [statsData, donorsData, emergencyData] = await Promise.all([
        fetchAdminStats(),
        fetchAllDonorsForAdmin('pending'),
        fetchAllEmergencyRequestsForAdmin()
      ]);
      setStats(statsData);
      setPendingDonors(donorsData.donors);
      setEmergencyRequests(emergencyData.requests.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (donorId) => {
    setActioningId(donorId);
    try {
      await verifyDonorAdmin(donorId);
      // Remove from the pending list immediately rather than re-fetching
      // everything - keeps the UI snappy for an admin working through a queue.
      setPendingDonors((prev) => prev.filter((d) => d._id !== donorId));
      setStats((prev) =>
        prev
          ? { ...prev, verifiedDonors: prev.verifiedDonors + 1, pendingVerification: prev.pendingVerification - 1 }
          : prev
      );
    } catch (err) {
      console.error('Verify failed:', err);
      alert(err.response?.data?.message || 'Failed to verify donor');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (donorId) => {
    // "Reject" here just means leave unverified but acknowledge the review -
    // we remove it from the immediate queue view. The donor stays unverified
    // in the DB (no special "rejected" state exists in the schema yet).
    setPendingDonors((prev) => prev.filter((d) => d._id !== donorId));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-brand-dark">Admin Panel</h1>
        <p className="text-sm text-gray-500">Manage users, verify donors and monitor the system.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          iconColor="bg-red-50 text-brand-red"
          value={loading ? '...' : stats?.totalUsers ?? 0}
          label="Total Users"
        />
        <StatCard
          icon={ShieldCheck}
          iconColor="bg-green-50 text-status-available"
          value={loading ? '...' : stats?.verifiedDonors ?? 0}
          label="Verified Donors"
        />
        <StatCard
          icon={Clock}
          iconColor="bg-orange-50 text-status-unavailable"
          value={loading ? '...' : stats?.pendingVerification ?? 0}
          label="Pending Verification"
        />
        <StatCard
          icon={Bell}
          iconColor="bg-red-50 text-brand-red"
          value={loading ? '...' : stats?.activeRequests ?? 0}
          label="Active Requests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Donor verification queue */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-1">Donor Verification Queue</h2>
          <p className="text-xs text-gray-400 mb-4">Review CNIC details and approve trusted donors.</p>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
          ) : pendingDonors.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No donors are waiting for verification. All caught up!
            </p>
          ) : (
            <div className="space-y-3">
              {pendingDonors.map((donor) => (
                <div
                  key={donor._id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-maroon text-white flex items-center justify-center font-semibold text-sm">
                      {donor.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-dark">{donor.fullName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        CNIC: {donor.cnicNumber} &middot;
                        <MapPin size={11} /> {donor.area}
                        <span className="text-brand-red font-semibold ml-1">{donor.bloodGroup}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(donor._id)}
                      disabled={actioningId === donor._id}
                      className="flex items-center gap-1 bg-status-available text-white text-xs font-medium px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50"
                    >
                      <CheckCircle2 size={13} /> Verify
                    </button>
                    <button
                      onClick={() => handleReject(donor._id)}
                      disabled={actioningId === donor._id}
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      <XCircle size={13} /> Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All emergency requests */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-brand-dark mb-1">Emergency Requests</h2>
          <p className="text-xs text-gray-400 mb-4">System-wide, including resolved.</p>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
          ) : emergencyRequests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No emergency requests yet.</p>
          ) : (
            <div className="space-y-3">
              {emergencyRequests.map((req) => (
                <div key={req._id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-brand-red">{req.requiredBloodGroup}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        req.status === 'Active'
                          ? 'bg-red-50 text-brand-red'
                          : req.status === 'Fulfilled'
                          ? 'bg-green-50 text-status-available'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{req.patientName}</p>
                  <p className="text-xs text-gray-400">{req.hospital}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
