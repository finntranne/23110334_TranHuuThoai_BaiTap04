import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../../services/authAPI"; // <-- Sửa import nếu cần
import { createUserApi } from "../../util/api"; // giữ nếu bạn vẫn dùng file này

// ======================
// ASYNC THUNKS
// ======================

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(userData);

      const data = res?.data || res; // Một số API trả về response.data

      console.log("📨 Cleaned Response:", data);

      return {
        errCode: data.errCode,
        message: data.message,
      };
    } catch (error) {
      const errorData = error.response?.data || error;

      return rejectWithValue({
        message:
          errorData.message || errorData.errMessage || "Đăng ký thất bại",
      });
    }
  },
);

export const verifySignUpOTP = createAsyncThunk(
  "auth/verifySignUpOTP",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const res = await authAPI.verifySignUpOTP(email, code);
      return res?.data || res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Xác thực OTP thất bại",
      );
    }
  },
);

// Login, Forgot Password... (giữ nguyên như cũ, chỉ tinh chỉnh nhẹ)
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      const data = response?.data || response;

      if (!data.token || !data.user) {
        return rejectWithValue(data.message || "Phản hồi từ máy chủ không hợp lệ");
      }

      const { token, user, redirectUrl } = data;

      localStorage.setItem("token", token);

      return { token, user, redirectUrl };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Đăng nhập thất bại";
      return rejectWithValue(errorMessage);
    }
  },
);

// Forgot Password
export const sendPasswordResetOTP = createAsyncThunk(
  "auth/sendPasswordResetOTP",
  async (email, { rejectWithValue }) => {
    try {
      const data = await authAPI.sendPasswordResetOTP(email);

      return data?.data || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  },
);

// Verify OTP
export const verifyPasswordResetOTP = createAsyncThunk(
  "auth/verifyPasswordResetOTP",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const data = await authAPI.verifyPasswordResetOTP(userId, otp);
      const resData = data?.data || data;

      return {
        ...resData,
        otp,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP không hợp lệ",
      );
    }
  },
);

// Reset Password
export const resetPasswordWithOTP = createAsyncThunk(
  "auth/resetPasswordWithOTP",
  async (
    { userId, otp, newPassword, confirmPassword },
    { rejectWithValue },
  ) => {
    try {
      const data = await authAPI.resetPasswordWithOTP(
        userId,
        otp,
        newPassword,
        confirmPassword,
      );

      return data?.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại",
      );
    }
  },
);

// ======================
// INITIAL STATE
// ======================

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("token"),

  loading: false,
  error: null,
  successMessage: null,

  // Register specific
  registerSuccess: false,
  registeredEmail: null,

  // Forgot password states
  forgotPasswordStep: "email",
  forgotPasswordEmail: "",
  forgotPasswordUserId: null,
  forgotPasswordOTP: "",
};

// ======================
// SLICE
// ======================

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    resetRegisterState: (state) => {
      state.registerSuccess = false;
      state.registeredEmail = null;
      state.error = null;
    },

    setForgotPasswordStep: (state, action) => {
      state.forgotPasswordStep = action.payload;
    },

    setForgotPasswordEmail: (state, action) => {
      state.forgotPasswordEmail = action.payload;
    },

    resetForgotPassword: (state) => {
      state.forgotPasswordStep = "email";
      state.forgotPasswordEmail = "";
      state.forgotPasswordUserId = null;
      state.forgotPasswordOTP = "";
      state.error = null;
      state.successMessage = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.registerSuccess = false;
      state.registeredEmail = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },

  extraReducers: (builder) => {
    builder
      // ==================== REGISTER ====================
      // ==================== REGISTER ====================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        if (payload?.errCode === 0 || payload?.errCode === "0") {
          state.registerSuccess = true;
          state.registeredEmail = action.meta.arg.email;
          state.error = null;
          state.successMessage = payload.message || "Đăng ký thành công!";
        } else {
          state.registerSuccess = false;
          state.error = payload?.message || "Đăng ký thất bại";
        }
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registerSuccess = false;
        state.error = action.payload?.message || "Có lỗi xảy ra khi đăng ký";
      });

    // ==================== VERIFY SIGN UP OTP ====================
    builder
      .addCase(verifySignUpOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySignUpOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Xác thực thành công";
        // Có thể set user hoặc redirect ở component
      })
      .addCase(verifySignUpOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================== LOGIN ====================
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = "Đăng nhập thành công";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // SEND OTP
    builder
      .addCase(sendPasswordResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendPasswordResetOTP.fulfilled, (state, action) => {
        state.loading = false;

        state.forgotPasswordStep = "otp";

        state.forgotPasswordUserId = action.payload.userId;

        state.successMessage = action.payload.message;
      })

      .addCase(sendPasswordResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // VERIFY OTP
    builder
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyPasswordResetOTP.fulfilled, (state, action) => {
        state.loading = false;

        state.forgotPasswordStep = "password";

        state.forgotPasswordOTP = action.payload.otp;

        state.successMessage = action.payload.message;
      })

      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // RESET PASSWORD
    builder
      .addCase(resetPasswordWithOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPasswordWithOTP.fulfilled, (state, action) => {
        state.loading = false;

        state.forgotPasswordStep = "success";

        state.successMessage = action.payload.message;
      })

      .addCase(resetPasswordWithOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  resetRegisterState,
  setForgotPasswordStep,
  setForgotPasswordEmail,
  resetForgotPassword,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
