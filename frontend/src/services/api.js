import axios from 'axios';

// Vite sử dụng import.meta.env. Đổi về port 3000 theo đúng backend của bạn.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor Request: Tự động gắn Token vào header trước khi gửi API
api.interceptors.request.use(
  (config) => {
    // Giả sử sau khi login bạn lưu token vào localStorage với key là 'token'
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Xử lý lỗi trả về từ Backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Nếu Backend báo lỗi 401 (Chưa xác thực / Hết hạn token)
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // Ép chuyển hướng về trang đăng nhập
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;