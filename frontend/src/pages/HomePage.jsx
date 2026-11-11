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
  MapPin,
  ArrowRight
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
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blush via-white to-white px-4 sm:px-6 lg:px-8 pt-14 pb-24 sm:pt-20 sm:pb-28">
        {/* Soft decorative glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-32 w-80 h-80 rounded-full bg-brand-rose/70 blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-up text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-[1.08]">
              EVERY DROP COUNTS,
              <br />
              <span className="bg-gradient-to-r from-brand-red to-brand-maroon bg-clip-text text-transparent">
                SAVE A LIFE TODAY!
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Smart Blood Donation System for Peshawar connects blood donors with those in need.
              Your small act of kindness can bring a big change.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
              <Link to="/donors" className="btn-primary !px-6 !py-3.5">
                <Droplet size={16} /> Find Donors
              </Link>
              <Link to="/register" className="btn-outline !px-6 !py-3.5">
                <Users size={16} /> Become a Donor
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-rose via-brand-blush to-white shadow-soft" />
              <div className="absolute inset-6 rounded-full border border-brand-red/15" />
              <div className="absolute inset-14 rounded-full border border-dashed border-brand-red/20" />
              <div className="absolute inset-0 flex items-center justify-center animate-float">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] bg-gradient-to-br from-brand-red to-brand-maroon shadow-lift flex items-center justify-center rotate-6">
                  <Droplet size={64} className="text-white" fill="currentColor" fillOpacity={0.92} />
                </div>
              </div>

              <div className="absolute left-0 sm:-left-8 top-10 bg-white rounded-2xl shadow-soft border border-gray-100 px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-brand-blush flex items-center justify-center">
                  <ShieldCheck size={16} className="text-brand-red" />
                </span>
                <span className="text-xs font-semibold text-brand-dark">CNIC Verified</span>
              </div>
              <div className="absolute right-0 sm:-right-6 bottom-12 bg-white rounded-2xl shadow-soft border border-gray-100 px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-brand-blush flex items-center justify-center">
                  <MessageCircle size={16} className="text-brand-red" />
                </span>
                <span className="text-xs font-semibold text-brand-dark">WhatsApp Contact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10">
        {/* Quick search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white border border-gray-100 shadow-lift rounded-2xl p-5 sm:p-6"
        >
          <p className="eyebrow mb-4">Find a Blood Donor</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="field"
            >
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <select value={area} onChange={(e) => setArea(e.target.value)} className="field">
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
              className="field"
            >
              <option value="">Select BRT Station (Optional)</option>
              {BRT_STATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary">
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
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-red to-brand-maroon text-white rounded-2xl p-5 h-full shadow-lift">
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                <div className="relative flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold tracking-wider text-white/90">
                    URGENT BLOOD NEEDED
                  </p>
                  <span className="flex items-center gap-1.5 bg-white/15 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" />
                    Emergency
                  </span>
                </div>
                <p className="relative font-display text-4xl font-extrabold">
                  {urgentRequest.requiredBloodGroup}
                </p>
                <p className="relative text-xs text-white/80 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {urgentRequest.hospital}
                </p>
                <Link
                  to="/emergency"
                  className="relative flex items-center justify-center gap-1.5 bg-white text-brand-red text-xs font-semibold mt-4 py-2.5 rounded-xl hover:bg-brand-blush"
                >
                  View All Requests <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 h-full flex items-center justify-center text-center">
                <p className="text-xs text-gray-400">No critical requests right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Us + How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 shadow-soft rounded-3xl p-6 sm:p-8">
          <p className="eyebrow">Why Choose Us?</p>
          <div className="h-1 w-10 rounded-full bg-brand-red mt-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <Feature icon={ShieldCheck} title="Verified Donors" desc="All donors are CNIC verified for safety." />
            <Feature icon={MessageCircle} title="Instant Communication" desc="Connect with donors instantly via WhatsApp." />
            <Feature icon={Bus} title="BRT Meetup Support" desc="Easy meetup at nearby BRT stations." />
            <Feature icon={Lock} title="Secure & Reliable" desc="Your data is safe with us." />
          </div>
        </div>

        <div className="bg-brand-blush border border-brand-rose rounded-3xl p-6 sm:p-8">
          <p className="eyebrow">How It Works</p>
          <div className="h-1 w-10 rounded-full bg-brand-red mt-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-soft hover:-translate-y-1 hover:shadow-lift">
      <div className="w-10 h-10 rounded-xl bg-brand-blush flex items-center justify-center mb-3 group-hover:bg-brand-red">
        <Icon size={18} className="text-brand-red group-hover:text-white" />
      </div>
      <p className="font-display text-2xl font-extrabold text-brand-dark">{value}</p>
      <p className="text-sm text-gray-600 mt-0.5">{label}</p>
      <p className="text-xs text-brand-red font-medium mt-1">{trend}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-xl bg-brand-blush flex items-center justify-center shrink-0">
        <Icon size={20} className="text-brand-red" />
      </div>
      <div>
        <p className="font-display font-bold text-sm text-brand-dark">{title}</p>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Step({ number, icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="relative w-11 h-11 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
        <Icon size={20} className="text-brand-red" />
        <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-brand-blush">
          {number}
        </span>
      </div>
      <div>
        <p className="font-display font-bold text-sm text-brand-dark">{title}</p>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
