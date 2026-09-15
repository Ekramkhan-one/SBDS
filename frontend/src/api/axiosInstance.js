// src/api/axiosInstance.js
// Centralized Axios instance so we configure the base URL and auth header
// injection in exactly one place, instead of repeating it in every API call.

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Attach the JWT token (if present in localStorage) to every outgoing request.
// This runs before each request, so we don't have to manually pass the header
// every time we call the API from a component.
axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('sbds_user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
