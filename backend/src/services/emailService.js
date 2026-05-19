const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**
 * Gửi email OTP cho người dùng
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP
 * @returns {Promise}
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Mã OTP Đặt lại Mật Khẩu - Trang Web Học Lập Trình",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Đặt Lại Mật Khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>Mã OTP có hiệu lực trong <strong>${process.env.OTP_EXPIRE} phút</strong></p>
          <p style="color: #666; font-size: 12px;">
            Nếu bạn không yêu cầu này, vui lòng bỏ qua email này.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP đã được gửi thành công" };
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
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
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Thông báo: Thông tin tài khoản đã được cập nhật",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thông tin Tài Khoản Đã Cập Nhật</h2>
          <p>Xin chào <strong>${name}</strong>,</p>
          <p>Thông tin tài khoản của bạn đã được cập nhật thành công vào lúc <strong>${new Date().toLocaleString("vi-VN")}</strong></p>
          <p style="color: #666; font-size: 12px;">
            Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với bộ phận hỗ trợ.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email xác nhận đã được gửi" };
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};

const sendOTPEmail_SignUp = async (email, otp) => {
  await transporter.verify();

  await transporter.sendMail({
    from: process.env.MAIL_USER,

    to: email,

    subject: "Verify your account",

    html: `
         <h2>Your OTP Code</h2>

         <h1>${otp}</h1>

         <p>
            OTP expires in 5 minutes
         </p>
      `,
  });
};

module.exports = {
  sendOTPEmail,
  sendProfileUpdateEmail,
  sendOTPEmail_SignUp,
};
