const { body } = require("express-validator");

const { validatePasswordStrength } = require("../utils/passwordService");

// ======================
// LOGIN VALIDATION
// ======================

exports.loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];

// ======================
// REGISTER VALIDATION
// ======================

exports.registerValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// ======================
// FORGOT PASSWORD
// ======================

exports.forgotPasswordValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email là bắt buộc")

    .isEmail()
    .withMessage("Email không hợp lệ"),
];

// ======================
// VERIFY OTP
// ======================

exports.verifyOTPValidation = [
  body("userId").notEmpty().withMessage("userId là bắt buộc"),

  body("otp")
    .notEmpty()
    .withMessage("OTP là bắt buộc")

    .isLength({ min: 6, max: 6 })
    .withMessage("OTP phải gồm 6 số"),
];

// ======================
// RESET PASSWORD
// ======================

exports.resetPasswordValidation = [
  body("userId").notEmpty().withMessage("userId là bắt buộc"),

  body("otp").notEmpty().withMessage("OTP là bắt buộc"),

  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới là bắt buộc")

    .custom((value) => {
      const result = validatePasswordStrength(value);

      if (!result.isStrong) {
        throw new Error(result.errors.join(", "));
      }

      return true;
    }),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }

    return true;
  }),
];
