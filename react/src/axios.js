import axios from "axios";
import router from "./router";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
  });

  axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Handle session invalidation or token expiration here
        // If session is invalidated due to login from another device or expired token
        localStorage.clear();  // Clear the session data
        // Optionally, you can add a logout endpoint in Laravel to invalidate all sessions on the backend:
        // await axios.post('/logout');  // If you want to notify the backend and log out from all devices
  
        // Redirect to the login page
        router.navigate('/login');
      }
      return Promise.reject(error);
    }
  );

export default axiosClient;