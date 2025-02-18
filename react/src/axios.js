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
        localStorage.clear();  // Clear the session data
        window.location.reload();
  
        // Redirect to the login page
        router.navigate('/login');
      }
      if(error.response && error.response.status === 503){
        window.location.href = "/maintanance";
      }
      return Promise.reject(error);
    }
  );

export default axiosClient;