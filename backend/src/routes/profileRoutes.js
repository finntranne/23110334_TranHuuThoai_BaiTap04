const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả routes yêu cầu xác thực
router.use(authenticate);

/**
 * @route   GET /api/profile
 * @desc    Lấy thông tin profile
 * @return  { data: user }
 */
router.get('/', ProfileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Cập nhật toàn bộ profile
 * @body    { full_name, phone, address, profile_image }
 * @return  { message, data: user }
 */
router.put('/', ProfileController.updateProfile);

/**
 * @route   PATCH /api/profile/name
 * @desc    Cập nhật tên
 * @body    { full_name }
 * @return  { message, data: user }
 */
router.patch('/name', ProfileController.updateName);

/**
 * @route   PATCH /api/profile/phone
 * @desc    Cập nhật số điện thoại
 * @body    { phone }
 * @return  { message, data: user }
 */
router.patch('/phone', ProfileController.updatePhone);

/**
 * @route   PATCH /api/profile/address
 * @desc    Cập nhật địa chỉ
 * @body    { address }
 * @return  { message, data: user }
 */
router.patch('/address', ProfileController.updateAddress);

module.exports = router;
