const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const courseController = require("../controllers/courseController");

const { authenticate } = require("../middlewares/authMiddleware");

const authorize = require("../middlewares/roleMiddleware");

const validate = require("../middlewares/validationMiddleware");

const { loginValidation } = require("../validators/authValidator");

const { registerValidation } = require("../validators/authValidator");

const { authLimiter } = require("../middlewares/rateLimitMiddleware");

// REGISTER
router.post(
  "/register",
  registerValidation,
  validate,
  authLimiter,
  authController.handleRegister,
);

// VERIFY OTP
router.post(
  "/verify-signup-otp",
  validate,
  authLimiter,
  authController.verifyOTPController,
);

// LOGIN
router.post(
  "/login",
  authLimiter,
  ...loginValidation,
  validate,
  authController.login,
);

// USER
router.get(
  "/user/profile",
  authenticate,
  authorize("user"),
  authController.userProfile,
);

// ADMIN
router.get(
  "/admin/profile",
  authenticate,
  authorize("admin"),
  authController.adminProfile,
);

router.post("/forgot-password", authController.sendPasswordResetOTP);

router.post(
  "/verify-reset-password-otp",
  authController.verifyPasswordResetOTP,
);

router.post("/reset-password", authController.resetPasswordWithOTP);

const homeController = require("../controllers/homeController");
// HOME
router.get("/home-data", homeController.getHomePageData);
router.get("/courses", courseController.getCourses);
router.get("/featured-courses", homeController.getFeaturedCourses);

module.exports = router;
 
