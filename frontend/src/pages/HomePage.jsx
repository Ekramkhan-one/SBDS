// src/pages/HomePage.jsx
// Public landing page: hero, quick donor search bar, live stats, urgent
// request banner, "Why Choose Us", "How It Works", and footer.

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Users,
  ShieldCheck,
  Bus,
  Search,
  UserPlus,
  Phone,
  Heart,
  MessageCircle,
  Lock,
  MapPin
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { fetchDashboardStats } from '../api/donorApi';
import { fetchEmergencyRequests } from '../api/emergencyApi';
import { BLOOD_GROUPS, PESHAWAR_AREAS, BRT_STATIONS } from '../data/peshawarData';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [urgentRequest, setUrgentRequest] = useState(null);
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState('');
  const [area, setArea] = useState('');
  const [brtStation, setBrtStation] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [statsData, emergencyData] = await Promise.all([
          fetchDashboardStats(),
          fetchEmergencyRequests({ urgency: 'Critical' })
        ]);
        setStats(statsData);
        setUrgentRequest(emergencyData.requests[0] || null);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (area) params.append('area', area);
    if (brtStation) params.append('brtStation', brtStation);
    navigate(`/donors?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 to-red-50 px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-brand-dark leading-tight">
              EVERY DROP COUNTS,
              <br />
              <span className="text-brand-red">SAVE A LIFE TODAY!</span>
            </h1>
            <p className="text-gray-600 mt-4 max-w-md">
              Smart Blood Donation System for Peshawar connects blood donors with those in need.
              Your small act of kindness can bring a big change.
            </p>
            <div className="flex gap-3 mt-6">
              <Link
                to="/donors"
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-medium px-5 py-3 rounded-lg transition-colors"
              >
                <Droplet size={16} /> Find Donors
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 border-2 border-brand-red text-brand-red font-medium px-5 py-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Users size={16} /> Become a Donor
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Droplet size={180} className="text-brand-red/30" fill="currentColor" />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        {/* Quick search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white border border-gray-200 shadow-lg rounded-xl p-5"
        >
          <p className="text-xs font-bold text-brand-red tracking-wide mb-3">FIND A BLOOD DONOR</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">Select Area in Peshawar</option>
              {PESHAWAR_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <select
              value={brtStation}
              onChange={(e) => setBrtStation(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">Select BRT Station (Optional)</option>
              {BRT_STATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-medium rounded-lg transition-colors"
            >
              <Search size={16} /> Search Donors
            </button>
          </div>
        </form>

        {/* Stats + urgent banner */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-6">
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              icon={Users}
              value={stats ? `${stats.totalDonors}+` : '...'}
              label="Total Donors"
              trend="Verified & Active"
            />
            <StatBox
              icon={Droplet}
              value={stats ? `${stats.areasCovered}+` : '...'}
              label="Areas Covered"
              trend="Across Peshawar"
            />
            <StatBox icon={Bus} value="25+" label="BRT Stations" trend="Connected" />
            <StatBox
              icon={ShieldCheck}
              value={stats ? `${stats.verifiedDonors}+` : '...'}
              label="Verified Donors"
              trend="CNIC Verified"
            />
          </div>

          <div className="lg:col-span-1">
            {urgentRequest ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 h-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-brand-red">URGENT BLOOD NEEDED</p>
                  <span className="bg-brand-red text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Emergency
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-brand-dark">
                  {urgentRequest.requiredBloodGroup}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={11} /> {urgentRequest.hospital}
                </p>
                <Link
                  to="/emergency"
                  className="block text-center bg-brand-red text-white text-xs font-medium mt-3 py-2 rounded-lg hover:bg-brand-red-dark transition-colors"
                >
                  View All Requests &rarr;
                </Link>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-full flex items-center justify-center text-center">
                <p className="text-xs text-gray-400">No critical requests right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Us + How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-bold text-brand-red tracking-wide mb-1">WHY CHOOSE US?</p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <Feature icon={ShieldCheck} title="Verified Donors" desc="All donors are CNIC verified for safety." />
            <Feature icon={MessageCircle} title="Instant Communication" desc="Connect with donors instantly via WhatsApp." />
            <Feature icon={Bus} title="BRT Meetup Support" desc="Easy meetup at nearby BRT stations." />
            <Feature icon={Lock} title="Secure & Reliable" desc="Your data is safe with us." />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-brand-red tracking-wide mb-1">HOW IT WORKS</p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <Step number={1} icon={UserPlus} title="Register" desc="Create your account as donor or seeker." />
            <Step number={2} icon={Search} title="Search Donor" desc="Search by blood group, area or BRT station." />
            <Step number={3} icon={Phone} title="Contact Instantly" desc="Connect via WhatsApp or direct call." />
            <Step number={4} icon={Heart} title="Save Lives" desc="Your donation can save a life." />
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function StatBox({ icon: Icon, value, label, trend }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-brand-red" />
      </div>
      <p className="text-xl font-bold text-brand-dark">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xs text-status-available font-medium mt-0.5">{trend}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div>
      <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mb-2">
        <Icon size={16} className="text-status-available" />
      </div>
      <p className="font-semibold text-sm text-brand-dark">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  );
}

function Step({ number, icon: Icon, title, desc }) {
  return (
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center relative">
        <Icon size={18} className="text-brand-red" />
        <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {number}
        </span>
      </div>
      <p className="font-semibold text-sm text-brand-dark mt-2">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  );
}
