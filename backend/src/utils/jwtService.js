const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Tạo JWT token
 * @param {object} payload - Dữ liệu để mã hóa
 * @returns {string} Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/**
 * Xác minh JWT token
 * @param {string} token - Token cần xác minh
 * @returns {object} Payload từ token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc hết hạn');
  }
};

/**
 * Tạo refresh token
 * @param {object} payload - Dữ liệu để mã hóa
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * Xác minh refresh token
 * @param {string} token - Refresh token
 * @returns {object} Payload từ token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Refresh token không hợp lệ hoặc hết hạn');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken
};
