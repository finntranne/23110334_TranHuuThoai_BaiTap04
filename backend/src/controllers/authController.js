// controllers/authController.js
const authService = require("../services/authService");
const { generateToken } = require("../utils/jwtService");

let handleRegister = async (req, res) => {
  try {
    // Đợi Service xử lý logic và trả về kết quả
    let result = await authService.handleRegister(req.body);

    // Trả kết quả về cho client (Postman/Trình duyệt)
    return res.status(200).json(result);
  } catch (error) {
    // Nếu Service ném lỗi (throw error), nó sẽ nhảy vào đây
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống (Internal Server Error)",
    });
  }
};

let verifyOTPController = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyOTP(email, code);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: error.message || "Lỗi xác thực OTP",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Vui lòng nhập đầy đủ email và mật khẩu",
    });
  }

  try {
    const userData = await authService.handleUserLogin(email, password);

    if (userData.errCode !== 0) {
      return res.status(401).json({
        errCode: userData.errCode,
        message: userData.message,
      });
    }

    // Validate user data before token generation
    if (!userData.user || !userData.user.id || !userData.user.email) {
      console.error("Invalid user data from authService:", userData.user);
      return res.status(500).json({
        errCode: -1,
        message: "Dữ liệu người dùng không hợp lệ",
      });
    }

    let token;
    try {
      token = generateToken({
        id: userData.user.id,
        email: userData.user.email,
        role: userData.user.role
      });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError.message);
      return res.status(500).json({
        errCode: -1,
        message: "Lỗi tạo token: " + tokenError.message,
      });
    }

    // Logic điều hướng dựa trên Role trong DB
    let redirectUrl =
      userData.user.role === "admin" ? "/admin/profile" : "/user/profile";

    return res.status(200).json({
      errCode: 0,
      message: "Đăng nhập thành công",
      token,
      user: userData.user,
      redirectUrl,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      errCode: -1,
      message: error.message || "Lỗi máy chủ nội bộ",
    });
  }
};

const userProfile = (req, res) => {
  res.json({
    message: "Welcome User",
    user: req.user,
  });
};

const adminProfile = (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user,
  });
};

const sendPasswordResetOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email là bắt buộc",
      });
    }

    const result = await authService.sendPasswordResetOTP(email);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Xác minh OTP
 * POST /api/auth/verify-otp
 */
const verifyPasswordResetOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "userId và otp là bắt buộc",
      });
    }

    const result = await authService.verifyPasswordResetOTP(userId, otp);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Đặt lại mật khẩu với OTP
 * POST /api/auth/reset-password
 */
const resetPasswordWithOTP = async (req, res, next) => {
  try {
    const { userId, otp, newPassword, confirmPassword } = req.body;

    // Xác thực dữ liệu
    if (!userId || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "userId, otp, newPassword và confirmPassword là bắt buộc",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không khớp",
      });
    }

    const result = await authService.resetPasswordWithOTP(
      userId,
      otp,
      newPassword,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRegister,
  verifyOTPController,
  login,
  userProfile,
  adminProfile,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordWithOTP,
};
