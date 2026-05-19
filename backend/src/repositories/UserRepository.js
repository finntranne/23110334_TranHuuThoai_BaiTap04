const pool = require('../config/database');

class UserRepository {
  /**
   * Lấy người dùng theo email
   */
  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  /**
   * Lấy người dùng theo ID
   */
  async getUserById(id) {
    const query = 'SELECT id, email, fullName as full_name, phoneNumber as phone, address, image as profile_image, roleId as role, createdAt as created_at, updatedAt as updated_at FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  /**
   * Tạo người dùng mới
   */
  async createUser(userData) {
    const query = `
      INSERT INTO users (email, password, full_name, role, created_at, updated_at)
      VALUES (?, ?, ?, 'user', NOW(), NOW())
    `;
    const [result] = await pool.query(query, [userData.email, userData.password, userData.full_name]);
    return result.insertId;
  }

  /**
   * Cập nhật mật khẩu
   */
  async updatePassword(userId, newPassword) {
    const query = 'UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?';
    const [result] = await pool.query(query, [newPassword, userId]);
    return result.affectedRows > 0;
  }

  /**
   * Cập nhật thông tin profile
   */
  async updateProfile(userId, profileData) {
    const fields = [];
    const values = [];

    if (profileData.full_name !== undefined) {
      fields.push('fullName = ?');
      values.push(profileData.full_name);
    }
    if (profileData.phone !== undefined) {
      fields.push('phoneNumber = ?');
      values.push(profileData.phone);
    }
    if (profileData.address !== undefined) {
      fields.push('address = ?');
      values.push(profileData.address);
    }
    if (profileData.profile_image !== undefined) {
      fields.push('image = ?');
      values.push(profileData.profile_image);
    }

    fields.push('updatedAt = NOW()');
    values.push(userId);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  }

  /**
   * Lưu OTP
   */
  async saveOTP(userId, otp) {
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE) * 60000);
    const query = `
      INSERT INTO otps (userId, code, type, expiresAt, isUsed, createdAt)
      VALUES (?, ?, 'forgot_password', ?, 0, NOW())
      ON DUPLICATE KEY UPDATE code = ?, expiresAt = ?
    `;
    await pool.query(query, [userId, otp, expiresAt, otp, expiresAt]);
  }

  /**
   * Xác minh OTP
   */
  async verifyOTP(userId, otp) {
    const query = `
      SELECT * FROM otps 
      WHERE userId = ? AND code = ? AND expiresAt > NOW() AND type = 'forgot_password'
    `;
    const [rows] = await pool.query(query, [userId, otp]);
    return rows[0];
  }

  /**
   * Xóa OTP đã sử dụng
   */
  async deleteOTP(userId) {
    const query = 'DELETE FROM otps WHERE userId = ? AND type = "forgot_password"';
    await pool.query(query, [userId]);
  }
}

module.exports = new UserRepository();
