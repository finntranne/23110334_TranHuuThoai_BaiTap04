const ProfileService = require('../services/ProfileService');

class ProfileController {
  /**
   * Lấy thông tin profile
   * GET /api/profile
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await ProfileService.getProfile(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật profile
   * PUT /api/profile
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // Xác thực dữ liệu
      const validatedData = ProfileService.validateProfileData(profileData);

      const result = await ProfileService.updateProfile(userId, validatedData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thông tin cơ bản (full_name)
   * PATCH /api/profile/name
   */
  async updateName(req, res, next) {
    try {
      const userId = req.user.id;
      const { full_name } = req.body;

      if (!full_name || full_name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Tên phải có ít nhất 2 ký tự'
        });
      }

      const result = await ProfileService.updateProfile(userId, { full_name });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật số điện thoại
   * PATCH /api/profile/phone
   */
  async updatePhone(req, res, next) {
    try {
      const userId = req.user.id;
      const { phone } = req.body;

      if (!phone || !/^[0-9]{10,11}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại không hợp lệ (10-11 chữ số)'
        });
      }

      const result = await ProfileService.updateProfile(userId, { phone });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật địa chỉ
   * PATCH /api/profile/address
   */
  async updateAddress(req, res, next) {
    try {
      const userId = req.user.id;
      const { address } = req.body;

      if (!address || address.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Địa chỉ không được để trống'
        });
      }

      const result = await ProfileService.updateProfile(userId, { address });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
