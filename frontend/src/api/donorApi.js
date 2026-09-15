// src/api/donorApi.js
// Centralized donor-related API calls. Always URL-encodes filter values
// (important for blood groups like "O+" where "+" would otherwise be
// misread as a space in a query string).

import axiosInstance from './axiosInstance';

export const fetchDashboardStats = async () => {
  const { data } = await axiosInstance.get('/donors/stats/summary');
  return data;
};

export const fetchRecentDonors = async (limit = 4) => {
  const { data } = await axiosInstance.get(`/donors/recent?limit=${limit}`);
  return data;
};

export const fetchDonors = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
  if (filters.area) params.append('area', filters.area);
  if (filters.brtStation) params.append('brtStation', filters.brtStation);
  if (filters.verifiedOnly) params.append('verifiedOnly', 'true');

  const { data } = await axiosInstance.get(`/donors?${params.toString()}`);
  return data;
};

export const toggleMyAvailability = async () => {
  const { data } = await axiosInstance.patch('/donors/availability');
  return data;
};
