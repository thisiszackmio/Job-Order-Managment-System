import axios from "axios";
import router from "./router";

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
});

// Request interceptor to attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('TOKEN'); // Your stored token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Unauthorized → redirect to login
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.reload();
        router.navigate('/login');
      }

      // Service unavailable → maintenance page
      if (error.response.status === 503) {
        window.location.href = "/maintanance";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
