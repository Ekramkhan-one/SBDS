// src/api/authApi.js

import axiosInstance from './axiosInstance';

export const updateMyProfile = async (payload) => {
  const { data } = await axiosInstance.patch('/auth/profile', payload);
  return data;
};

export const changeMyPassword = async (currentPassword, newPassword) => {
  const { data } = await axiosInstance.patch('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return data;
};
