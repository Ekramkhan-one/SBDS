// src/api/adminApi.js

import axiosInstance from './axiosInstance';

export const fetchAdminStats = async () => {
  const { data } = await axiosInstance.get('/admin/stats');
  return data;
};

export const fetchAllDonorsForAdmin = async (status) => {
  const params = status ? `?status=${status}` : '';
  const { data } = await axiosInstance.get(`/admin/donors${params}`);
  return data;
};

export const createDonorAdmin = async (payload) => {
  const { data } = await axiosInstance.post('/admin/donors', payload);
  return data;
};

export const updateDonorAdmin = async (donorId, payload) => {
  const { data } = await axiosInstance.patch(`/admin/donors/${donorId}`, payload);
  return data;
};

export const deleteDonorAdmin = async (donorId) => {
  const { data } = await axiosInstance.delete(`/admin/donors/${donorId}`);
  return data;
};

export const verifyDonorAdmin = async (donorId) => {
  const { data } = await axiosInstance.patch(`/admin/donors/${donorId}/verify`);
  return data;
};

export const unverifyDonorAdmin = async (donorId) => {
  const { data } = await axiosInstance.patch(`/admin/donors/${donorId}/unverify`);
  return data;
};

export const fetchAllEmergencyRequestsForAdmin = async () => {
  const { data } = await axiosInstance.get('/admin/emergency');
  return data;
};

export const fetchReportsData = async () => {
  const { data } = await axiosInstance.get('/admin/reports');
  return data;
};
