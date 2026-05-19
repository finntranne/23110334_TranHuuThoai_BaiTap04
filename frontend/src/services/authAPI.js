import api from "./api";

export const authAPI = {
  // LOGIN
  login: (email, password) => {
    return api.post("/login", {
      email,
      password,
    });
  },

  // REGISTER
  register: (data) => {
    console.log("Register data sent to API:", data);
    return api.post("/register", data);
  },

  verifySignUpOTP: (email, code) => {
    return api.post("/verify-signup-otp", {
      email,
      code,
    });
  },

  // FORGOT PASSWORD
  sendPasswordResetOTP: (email) => {
    return api.post("/forgot-password", {
      email,
    });
  },

  verifyPasswordResetOTP: (userId, otp) => {
    return api.post("/verify-reset-password-otp", {
      userId,
      otp,
    });
  },

  resetPasswordWithOTP: (userId, otp, newPassword, confirmPassword) => {
    return api.post("/reset-password", {
      userId,
      otp,
      newPassword,
      confirmPassword,
    });
  },
};

export default authAPI;
