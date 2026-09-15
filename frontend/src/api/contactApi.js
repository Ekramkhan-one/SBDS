// src/api/contactApi.js

import axiosInstance from './axiosInstance';

export const submitContactMessage = async (payload) => {
  const { data } = await axiosInstance.post('/contact', payload);
  return data;
};
