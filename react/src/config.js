const API_BASE_URL = window.location.hostname === '10.4.2.8'
  ? 'http://10.4.2.8:8000'           // Mobile device
  : import.meta.env.VITE_API_BASE_URL; // PC or fallback from .env

export default API_BASE_URL;