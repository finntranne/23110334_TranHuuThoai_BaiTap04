const bcrypt = require('bcryptjs');

/**
 * Tạo mã OTP ngẫu nhiên (6 chữ số)
 * @returns {string} Mã OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mã hóa mật khẩu
 * @param {string} password - Mật khẩu cần mã hóa
 * @returns {Promise<string>} Mật khẩu đã được mã hóa
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Lỗi mã hóa mật khẩu');
  }
};

/**
 * Kiểm tra mật khẩu
 * @param {string} password - Mật khẩu chưa mã hóa
 * @param {string} hashPassword - Mật khẩu đã mã hóa
 * @returns {Promise<boolean>} True nếu khớp, false nếu không
 */
const comparePassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    throw new Error('Lỗi kiểm tra mật khẩu');
  }
};

/**
 * Xác thực độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {object} Kết quả xác thực
 */
const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ thường');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ số');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
  }

  return {
    isStrong: errors.length === 0,
    errors: errors
  };
};

module.exports = {
  generateOTP,
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
