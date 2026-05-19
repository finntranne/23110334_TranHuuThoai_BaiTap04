// const express = require("express");
// const AuthController = require("../controllers/AuthController");
// const { authenticate } = require("../middlewares/authMiddleware");

// const router = express.Router();

// /**
//  * @route   POST /api/auth/login
//  * @desc    Đăng nhập
//  * @body    { email, password }
//  * @return  { token, refreshToken, user }
//  */
// router.post("/login", AuthController.login);

// /**
//  * @route   POST /api/auth/register
//  * @desc    Đăng ký tài khoản mới
//  * @body    { email, password, confirmPassword, fullName }
//  * @return  { token, refreshToken, user }
//  */
// router.post("/register", AuthController.handleRegister);

// /**
//  * @route   POST /api/auth/forgot-password
//  * @desc    Gửi OTP cho đặt lại mật khẩu
//  * @body    { email }
//  * @return  { message, userId }
//  */
// router.post("/forgot-password", AuthController.sendPasswordResetOTP);

// /**
//  * @route   POST /api/auth/verify-reset-password-otp
//  * @desc    Xác minh OTP
//  * @body    { userId, otp }
//  * @return  { message }
//  */
// router.post(
//   "/verify-reset-password-otp",
//   AuthController.verifyPasswordResetOTP,
// );

// /**
//  * @route   POST /api/auth/reset-password
//  * @desc    Đặt lại mật khẩu
//  * @body    { userId, otp, newPassword, confirmPassword }
//  * @return  { message }
//  */
// router.post("/reset-password", AuthController.resetPasswordWithOTP);

// module.exports = router;
