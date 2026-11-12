// src/pages/SearchDonorsPage.jsx
// Donor search/directory page with a free-text search box plus Blood Group,
// Area, and BRT Station filters. Reads initial filters from the URL query
// string so links from the homepage search bar, the top-bar search box, or a
// shared link land with filters already applied.

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, MessageCircle, ShieldCheck, MapPin, Bus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchDonors } from '../api/donorApi';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { BLOOD_GROUPS, PESHAWAR_AREAS, BRT_STATIONS } from '../data/peshawarData';

export default function SearchDonorsPage() {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [brtStation, setBrtStation] = useState(searchParams.get('brtStation') || '');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await fetchDonors(filters);
      setDonors(data.donors);
    } catch (err) {
      console.error('Donor search failed:', err);
      setDonors([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }, []);

  // Run search on mount, honoring any filters that arrived via the URL
  // (e.g. from the homepage's quick search bar or the top-bar search box).
  useEffect(() => {
    runSearch({
      q: searchParams.get('q') || '',
      bloodGroup: searchParams.get('bloodGroup') || '',
      area: searchParams.get('area') || '',
      brtStation: searchParams.get('brtStation') || ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch({ q: query, bloodGroup, area, brtStation });
  };

  const handleReset = () => {
    setQuery('');
    setBloodGroup('');
    setArea('');
    setBrtStation('');
    runSearch({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-up">
        <div>
          <h1 className="text-xl font-display font-bold text-brand-dark">Search Donors</h1>
          <p className="text-sm text-gray-500">
            Search by name, blood group, area or BRT station — or narrow it down with the filters.
          </p>
        </div>

        {/* Filter bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white border border-gray-100 shadow-soft rounded-2xl p-4 space-y-3"
        >
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, blood group (e.g. O+), area or BRT station..."
              className="field pl-9"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="field"
            >
              <option value="">Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            <select value={area} onChange={(e) => setArea(e.target.value)} className="field">
              <option value="">Area in Peshawar</option>
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
              <option value="">BRT Station</option>
              {BRT_STATIONS.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 !py-2.5">
                <Search size={15} /> Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset filters"
                className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                <RotateCcw size={15} className="text-gray-500" />
              </button>
            </div>
          </div>
        </form>

        {/* Result count */}
        {hasSearched && !loading && (
          <div className="bg-brand-blush text-brand-red text-sm font-medium px-4 py-2 rounded-lg inline-block">
            {donors.length} donor{donors.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Results grid */}
        {loading ? (
          <p className="text-center text-gray-400 py-10">Searching...</p>
        ) : donors.length === 0 ? (
          <div className="bg-white border border-gray-100 shadow-soft rounded-2xl p-10 text-center text-gray-400">
            No donors match these filters yet. Try broadening your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((donor, index) => (
              <div
                key={donor._id}
                style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                className="animate-fade-up bg-white border border-gray-100 shadow-soft hover:-translate-y-1 hover:shadow-lift rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-maroon to-brand-maroon-dark text-white flex items-center justify-center font-semibold">
                    {donor.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark flex items-center gap-1">
                      {donor.fullName}
                      {donor.isVerified && (
                        <ShieldCheck size={14} className="text-status-available" />
                      )}
                    </p>
                    <p className="text-brand-red font-bold text-sm">{donor.bloodGroup}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} /> {donor.area}
                  </p>
                  {donor.preferredBrtStation && (
                    <p className="flex items-center gap-1.5">
                      <Bus size={12} /> {donor.preferredBrtStation} BRT
                    </p>
                  )}
                  <p className="text-status-available font-medium">
                    &#9679; {donor.availabilityStatus}
                  </p>
                </div>

                <a
                  href={buildWhatsAppLink(donor.phoneNumber, donor.fullName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-1.5 bg-status-available hover:opacity-90 text-white text-xs font-medium py-2 rounded-lg"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
