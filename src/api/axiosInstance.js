import axios from 'axios';
import store from '../redux/store';
import { setError } from '../redux/features/messenger/messengerSlice';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_ERP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }
});

// Request interceptor - Thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const user_data = JSON.parse(localStorage.getItem('user_data'));
    const token = user_data?.access_token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
    const user_data = JSON.parse(localStorage.getItem('user_data'));

        // Thử refresh token với access token hiện tại
        const currentToken = user_data?.access_token;
        const response = await axios.post(`${process.env.REACT_APP_ERP_API_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });

        // Lưu token mới
        const { access_token } = response.data;
        localStorage.setItem('user_data', JSON.stringify({ ...user_data, access_token }));

        // Thử lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Nếu refresh thất bại thì logout
        localStorage.removeItem('user_data');
        // store.dispatch(setError('Phiên đăng nhập hết hạn'));
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
