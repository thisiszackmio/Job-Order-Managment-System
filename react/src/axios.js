import axios from "axios";
import router from "./router";

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    //baseURL: 'http://20.20.22.28:8000/api',
  });

axiosClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
    return config
});

axiosClient.interceptors.response.use(response => {
    return response
}, error =>{
    if(error.response && error.response.status === 401){
        router.navigate('/login')
        return error;
    }
    throw error;
});

export default axiosClient;