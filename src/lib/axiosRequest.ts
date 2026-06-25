import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj';

export const axiosRequest = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosRequest;
