import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    if (status === 503) {
      window.location.href = "/maintenance";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;