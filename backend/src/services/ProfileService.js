const UserRepository = require("../repositories/UserRepository");
const { sendProfileUpdateEmail } = require("../services/emailService");
const Joi = require("joi");

class ProfileService {
  /**
   * Lấy thông tin profile
   */
  async getProfile(userId) {
    const user = await UserRepository.getUserById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Cập nhật profile
   */
  async updateProfile(userId, profileData) {
    // Xác thực dữ liệu
    const schema = Joi.object({
      full_name: Joi.string().min(2).max(255),
      phone: Joi.string()
        .regex(/^[0-9]{10,11}$/)
        .messages({
          "string.pattern.base": "Số điện thoại không hợp lệ (10-11 chữ số)",
        }),
      address: Joi.string().max(500),
      profile_image: Joi.string().uri(),
      gender: Joi.boolean().allow(null),
    });

    const { error, value } = schema.validate(profileData, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((d) => d.message).join("; ");
      throw new Error(`Dữ liệu không hợp lệ: ${messages}`);
    }

    // Lấy thông tin người dùng hiện tại
    const user = await UserRepository.getUserById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Cập nhật profile
    const updateData = Object.keys(value).length > 0 ? value : profileData;
    const updated = await UserRepository.updateProfile(userId, updateData);

    if (!updated) {
      throw new Error("Cập nhật profile thất bại");
    }

    // Gửi email xác nhận
    await sendProfileUpdateEmail(user.email, value.full_name || user.full_name);

    // Lấy thông tin người dùng sau khi cập nhật
    const updatedUser = await UserRepository.getUserById(userId);

    return {
      success: true,
      message: "Profile đã được cập nhật thành công",
      data: updatedUser,
    };
  }

  /**
   * Xác thực dữ liệu profile trước khi cập nhật
   */
  validateProfileData(profileData) {
    const schema = Joi.object({
      full_name: Joi.string().min(2).max(255),
      phone: Joi.string()
        .regex(/^[0-9]{10,11}$/)
        .messages({
          "string.pattern.base": "Số điện thoại không hợp lệ (10-11 chữ số)",
        }),
      address: Joi.string().max(500),
      profile_image: Joi.string().uri(),
      gender: Joi.boolean().allow(null),
    }).min(1);

    const { error, value } = schema.validate(profileData, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((d) => d.message).join("; ");
      throw new Error(`Dữ liệu không hợp lệ: ${messages}`);
    }

    return value;
  }
}

module.exports = new ProfileService();
