const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.MAIL_PORT || "587"),
  secure: false, // true cho port 465, false cho các port khác như 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 giây timeout
  socketTimeout: 10000,
});

/**
 * Gửi email OTP cho người dùng
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP
 * @returns {Promise}
 */
const sendOTPEmail = async (email, otp) => {
  // Luôn in OTP ra console để hỗ trợ phát triển local
  console.log(`\n==========================================`);
  console.log(`[QUÊN MẬT KHẨU] Mã OTP của ${email} là: ${otp}`);
  console.log(`==========================================\n`);

  try {
    const isConfigured = process.env.MAIL_USER && 
                        process.env.MAIL_USER !== "your-email@gmail.com" &&
                        process.env.MAIL_PASSWORD &&
                        process.env.MAIL_PASSWORD !== "your-app-password";

    if (isConfigured) {
      const mailOptions = {
        from: process.env.MAIL_USER || process.env.MAIL_FROM,
        to: email,
        subject: "Mã OTP Đặt lại Mật Khẩu - UTESTYLE",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 5px;">
            <h2 style="color: #111; border-bottom: 2px solid #111; padding-bottom: 10px;">Đặt Lại Mật Khẩu</h2>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây để xác thực:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: #2f5acf; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p>Mã OTP có hiệu lực trong <strong>${process.env.OTP_EXPIRE || 10} phút</strong>.</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Nếu bạn không yêu cầu hành động này, vui lòng bỏ qua email này an toàn.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, message: "OTP đã được gửi thành công" };
    } else {
      console.log("MAIL_USER chưa được cấu hình hoặc đang để mặc định. Đã bỏ qua gửi email SMTP thực tế.");
      return { success: true, message: "Đã in OTP ra console (local)" };
    }
  } catch (error) {
    console.error("Lỗi gửi email đặt lại mật khẩu (SMTP):", error.message);
    return { success: true, message: "Đã in OTP ra console (local fallback)" };
  }
};

/**
 * Gửi email xác nhận thay đổi profile
 * @param {string} email - Email của người dùng
 * @param {string} name - Tên người dùng
 * @returns {Promise}
 */
const sendProfileUpdateEmail = async (email, name) => {
  try {
    const isConfigured = process.env.MAIL_USER && 
                        process.env.MAIL_USER !== "your-email@gmail.com" &&
                        process.env.MAIL_PASSWORD &&
                        process.env.MAIL_PASSWORD !== "your-app-password";

    if (isConfigured) {
      const mailOptions = {
        from: process.env.MAIL_USER || process.env.MAIL_FROM,
        to: email,
        subject: "Thông báo: Thông tin tài khoản đã được cập nhật",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 5px;">
            <h2 style="color: #111; border-bottom: 2px solid #111; padding-bottom: 10px;">Thông tin Tài Khoản Đã Cập Nhật</h2>
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Thông tin tài khoản của bạn đã được cập nhật thành công vào lúc <strong>${new Date().toLocaleString("vi-VN")}</strong></p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với bộ phận hỗ trợ ngay lập tức.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email xác nhận đã được gửi" };
    }
    return { success: true, message: "Bỏ qua gửi email xác nhận do chưa cấu hình SMTP" };
  } catch (error) {
    console.error("Lỗi gửi email cập nhật thông tin (SMTP):", error.message);
    return { success: true, message: "Lỗi gửi email cập nhật thông tin" };
  }
};

const sendOTPEmail_SignUp = async (email, otp) => {
  // Luôn in OTP ra console để hỗ trợ phát triển local
  console.log(`\n==========================================`);
  console.log(`[ĐĂNG KÝ TÀI KHOẢN] Mã OTP của ${email} là: ${otp}`);
  console.log(`DEBUG: MAIL_USER = "${process.env.MAIL_USER}", MAIL_PASSWORD = "${process.env.MAIL_PASSWORD}"`);
  console.log(`==========================================\n`);

  try {
    const isConfigured = process.env.MAIL_USER && 
                        process.env.MAIL_USER !== "your-email@gmail.com" &&
                        process.env.MAIL_PASSWORD &&
                        process.env.MAIL_PASSWORD !== "your-app-password";

    if (isConfigured) {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Xác minh tài khoản của bạn - UTESTYLE",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 5px;">
            <h2 style="color: #111; border-bottom: 2px solid #111; padding-bottom: 10px;">Xác Minh Tài Khoản</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản thành viên. Vui lòng sử dụng mã OTP dưới đây để hoàn tất:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: #2f5acf; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p>Mã OTP có hiệu lực trong 5 phút.</p>
          </div>
        `,
      });
    } else {
      console.log("MAIL_USER chưa được cấu hình hoặc đang để mặc định. Đã bỏ qua gửi email SMTP thực tế.");
    }
  } catch (error) {
    console.error("Lỗi gửi email đăng ký (SMTP):", error.message);
  }
};

module.exports = {
  sendOTPEmail,
  sendProfileUpdateEmail,
  sendOTPEmail_SignUp,
};
