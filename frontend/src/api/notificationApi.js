// src/api/notificationApi.js
import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
  const { data } = await axiosInstance.get('/notifications');
  return data; // { unreadCount, notifications }
};

export const markNotificationRead = async (id) => {
  const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await axiosInstance.patch('/notifications/read-all');
  return data;
};
