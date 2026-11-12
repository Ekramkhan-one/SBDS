// src/api/contactApi.js

import axiosInstance from './axiosInstance';

export const submitContactMessage = async (payload) => {
  const { data } = await axiosInstance.post('/contact', payload);
  return data;
};

export const getContactMessages = async () => {
  const { data } = await axiosInstance.get('/contact');
  return data; // { count, messages }
};

export const markMessageRead = async (id) => {
  const { data } = await axiosInstance.patch(`/contact/${id}/read`);
  return data;
};
