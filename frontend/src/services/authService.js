import api from "./api";

export const authAPI = {
  // Đăng nhập
  login: async (email, password) => {
    // Lưu ý: Đảm bảo route này khớp với backend (nếu backend là /login thì đổi lại nhé)
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Đăng ký
  register: async (email, password, fullName) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      fullName,
    });
    return response.data;
  },

  // Quên mật khẩu
  sendPasswordResetOTP: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  verifyPasswordResetOTP: async (userId, otp) => {
    const response = await api.post("/auth/verify-otp", { userId, otp });
    return response.data;
  },

  resetPasswordWithOTP: async (userId, otp, newPassword, confirmPassword) => {
    const response = await api.post("/auth/reset-password", {
      userId,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};

// Export riêng hàm loginApi để KHÔNG làm lỗi trang Login.jsx của bạn hiện tại
export const loginApi = authAPI.login;

export default authAPI;
