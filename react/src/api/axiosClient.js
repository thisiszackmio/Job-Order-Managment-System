import axios from 'axios';

// Create an axios instance
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to inject the Authorization header
axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('authToken'); // Get token from local storage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to the Authorization header
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axiosClient;
