import axios from 'axios';

// Runtime API base URL detection
const API_BASE_URL =
  window.location.hostname === '10.4.2.8'
    ? 'http://10.4.2.8:8000'                 // Mobile device
    : import.meta.env.VITE_API_BASE_URL;     // PC / fallback from .env

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Laravel API base
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // if using cookies / Laravel Sanctum
});

// Request interceptor to inject Authorization header
axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('authToken'); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
