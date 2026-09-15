// src/pages/DonorManagementPage.jsx
// Admin page: add new donors directly, and manage (edit/verify/delete)
// all existing donors in one table.

import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Pencil, Trash2, ShieldCheck, ShieldOff, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import {
  fetchAllDonorsForAdmin,
  createDonorAdmin,
  updateDonorAdmin,
  deleteDonorAdmin,
  verifyDonorAdmin,
  unverifyDonorAdmin
} from '../api/adminApi';
import { BLOOD_GROUPS, PESHAWAR_AREAS, BRT_STATIONS } from '../data/peshawarData';

const emptyFormState = {
  fullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  cnicNumber: '',
  bloodGroup: '',
  area: '',
  preferredBrtStation: '',
  availabilityStatus: 'Available',
  isVerified: false
};

export default function DonorManagementPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating new
  const [formData, setFormData] = useState(emptyFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadDonors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllDonorsForAdmin();
      setDonors(data.donors);
    } catch (err) {
      console.error('Failed to load donors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonors();
  }, [loadDonors]);

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyFormState);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (donor) => {
    setEditingId(donor._id);
    setFormData({
      fullName: donor.fullName,
      email: donor.email,
      password: '', // not editable here - left blank, never sent unless creating
      phoneNumber: donor.phoneNumber,
      cnicNumber: donor.cnicNumber,
      bloodGroup: donor.bloodGroup,
      area: donor.area,
      preferredBrtStation: donor.preferredBrtStation || '',
      availabilityStatus: donor.availabilityStatus,
      isVerified: donor.isVerified
    });
    setError('');
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (editingId) {
        await updateDonorAdmin(editingId, formData);
      } else {
        await createDonorAdmin(formData);
      }
      setShowForm(false);
      await loadDonors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save donor.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (donor) => {
    if (!window.confirm(`Remove ${donor.fullName} from the system? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDonorAdmin(donor._id);
      setDonors((prev) => prev.filter((d) => d._id !== donor._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete donor.');
    }
  };

  const handleToggleVerify = async (donor) => {
    try {
      if (donor.isVerified) {
        await unverifyDonorAdmin(donor._id);
      } else {
        await verifyDonorAdmin(donor._id);
      }
      setDonors((prev) =>
        prev.map((d) => (d._id === donor._id ? { ...d, isVerified: !d.isVerified } : d))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update verification.');
    }
  };

  const filteredDonors = donors.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.fullName.toLowerCase().includes(term) ||
      d.phoneNumber.includes(term) ||
      d.area.toLowerCase().includes(term) ||
      d.bloodGroup.toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Donor Management</h1>
          <p className="text-sm text-gray-500">Add, update and manage donor information.</p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Add New Donor
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand-dark">
              {editingId ? 'Edit Donor' : 'Add New Donor'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <FormField
                label="CNIC Number"
                name="cnicNumber"
                value={formData.cnicNumber}
                onChange={handleChange}
                required
                disabled={!!editingId}
                pattern="\d{13}"
                title="13 digits, no dashes"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Blood Group"
                name="bloodGroup"
                as="select"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </FormField>
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!editingId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="03\d{9}"
                title="Format: 03XXXXXXXXX"
              />
              <FormField
                label="Area in Peshawar"
                name="area"
                as="select"
                value={formData.area}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Area
                </option>
                {PESHAWAR_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="BRT Station"
                name="preferredBrtStation"
                as="select"
                value={formData.preferredBrtStation}
                onChange={handleChange}
              >
                <option value="">No preference</option>
                {BRT_STATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </FormField>
              <FormField
                label="Availability Status"
                name="availabilityStatus"
                as="select"
                value={formData.availabilityStatus}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </FormField>
            </div>

            {!editingId && (
              <FormField
                label="Temporary Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            )}

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
              />
              Mark as CNIC Verified
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Donor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* All Donors table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-brand-dark">All Donors</h2>
          <div className="relative w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search donors..."
              className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Blood Group</th>
                <th className="py-2 font-medium">Phone</th>
                <th className="py-2 font-medium">Area</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Verified</th>
                <th className="py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    No donors found.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor._id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-maroon text-white text-xs flex items-center justify-center font-semibold">
                        {donor.fullName.charAt(0)}
                      </div>
                      {donor.fullName}
                    </td>
                    <td className="py-3 text-brand-red font-semibold">{donor.bloodGroup}</td>
                    <td className="py-3 text-gray-600">{donor.phoneNumber}</td>
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
                      <button
                        onClick={() => handleToggleVerify(donor)}
                        title={donor.isVerified ? 'Click to unverify' : 'Click to verify'}
                      >
                        {donor.isVerified ? (
                          <ShieldCheck size={16} className="text-status-available" />
                        ) : (
                          <ShieldOff size={16} className="text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(donor)}
                          className="p-1.5 rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(donor)}
                          className="p-1.5 rounded-md bg-red-50 text-brand-red hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FormField({ label, as = 'input', children, ...props }) {
  const Component = as;
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <Component
        {...props}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red disabled:bg-gray-50 disabled:text-gray-400"
      >
        {children}
      </Component>
    </div>
  );
}
