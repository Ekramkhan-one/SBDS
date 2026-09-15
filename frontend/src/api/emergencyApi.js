// src/api/emergencyApi.js

import axiosInstance from './axiosInstance';

export const fetchEmergencyRequests = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
  if (filters.urgency) params.append('urgency', filters.urgency);

  const { data } = await axiosInstance.get(`/emergency?${params.toString()}`);
  return data;
};

export const createEmergencyRequest = async (payload) => {
  const { data } = await axiosInstance.post('/emergency', payload);
  return data;
};
