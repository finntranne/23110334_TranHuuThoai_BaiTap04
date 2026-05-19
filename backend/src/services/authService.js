// services/authService.js
const db = require("../models"); // Đường dẫn đến file index.js trong thư mục models
const bcrypt = require("bcryptjs");

const sendOTPEmail_SignUp = require("./emailService").sendOTPEmail_SignUp;

const UserRepository = require("../repositories/UserRepository");
const {
  generateOTP,
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} = require("../utils/passwordService");
const { generateToken, generateRefreshToken } = require("../utils/jwtService");
const {
  sendOTPEmail,
  sendProfileUpdateEmail,
} = require("../services/emailService");

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (password) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (e) {
    throw e;
  }
};

const handleRegister = async (data) => {
  try {
    if (!data.email || !data.email.includes("@")) {
      return {
        errCode: 1,
        message: "Email không đúng định dạng!",
      };
    }

    let userExists = await db.User.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      return {
        errCode: 2,
        message: "Email này đã được sử dụng. Hãy dùng email khác!",
      };
    }

    let hashedPassword = await hashUserPassword(data.password);

    const newUser = await db.User.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender === "1" ? true : false,
      roleId: 2, // Mặc định roleId = 2 (User)
      isVerified: false,
    });

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.OTP.create({
      userId: newUser.id,
      code: otp,
      expiresAt: expiresAt,
    });

    sendOTPEmail_SignUp(data.email, otp);

    return {
      errCode: 0,
      message: "Mã OTP đã được gửi đến email của bạn!",
    };
  } catch (error) {
    console.error("Lỗi tại authService:", error);
    throw error;
  }
};

const verifyOTP = async (email, code) => {
  try {
    if (!email || !email.includes("@")) {
      return {
        errCode: 1,
        message: "Email không đúng định dạng!",
      };
    }

    if (!code) {
      return {
        errCode: 2,
        message: "Vui lòng nhập mã OTP!",
      };
    }

    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return {
        errCode: 3,
        message: "Email không tồn tại!",
      };
    }

    const otpRecord = await db.OTP.findOne({
      where: {
        userId: user.id,
        code,
      },
    });

    if (!otpRecord) {
      return {
        errCode: 4,
        message: "Mã OTP không chính xác!",
      };
    }

    if (otpRecord.isUsed) {
      return {
        errCode: 5,
        message: "Mã OTP đã được sử dụng!",
      };
    }

    if (new Date() > otpRecord.expiresAt) {
      return {
        errCode: 6,
        message: "Mã OTP đã hết hạn!",
      };
    }

    await db.User.update(
      {
        isVerified: true,
      },
      {
        where: { id: user.id },
      },
    );

    await db.OTP.update(
      {
        isUsed: true,
      },
      {
        where: { id: otpRecord.id },
      },
    );

    return {
      errCode: 0,
      message: "Xác thực tài khoản thành công!",
    };
  } catch (error) {
    console.error("Lỗi tại verifyOTP:", error);
    throw error;
  }
};

const checkUserEmail = async (userEmail) => {
  try {
    return await db.User.findOne({
      where: { email: userEmail },
      include: [{ model: db.Role }], // Bao gồm thông tin Role để kiểm tra quyền
    });
  } catch (error) {
    console.error("checkUserEmail error:", error);
    throw error;
  }
};

const handleUserLogin = async (email, password) => {
  try {
    const user = await checkUserEmail(email);

    if (!user) {
      return {
        errCode: 1,
        message: "Email không tồn tại trong hệ thống",
      };
    }

    if (!user.password) {
      return {
        errCode: 3,
        message: "Dữ liệu người dùng không hợp lệ",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        errCode: 2,
        message: "Mật khẩu không chính xác",
      };
    }

    // Lấy tên role từ bảng Role liên kết
    const roleName = user.Role ? user.Role.name : "user";

    return {
      errCode: 0,
      message: "OK",
      user: {
        id: user.id,
        email: user.email,
        role: roleName,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    console.error("handleUserLogin error:", error);
    throw new Error("Lỗi xác thực: " + (error.message || "Không xác định được lỗi"));
  }
};

const sendPasswordResetOTP = async (email) => {
  // Kiểm tra người dùng có tồn tại không
  const user = await UserRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống");
  }

  // Tạo và lưu OTP
  const otp = generateOTP();
  await UserRepository.saveOTP(user.id, otp);

  // Gửi OTP qua email
  await sendOTPEmail(email, otp);

  return {
    success: true,
    message: "OTP đã được gửi vào email của bạn",
    userId: user.id,
  };
};

/**
 * Xác minh OTP
 */
const verifyPasswordResetOTP = async (userId, otp) => {
  const otpRecord = await UserRepository.verifyOTP(userId, otp);

  if (!otpRecord) {
    throw new Error("OTP không hợp lệ hoặc hết hạn");
  }

  return {
    success: true,
    message: "OTP hợp lệ",
  };
};

/**
 * Đặt lại mật khẩu với OTP
 */
const resetPasswordWithOTP = async (userId, otp, newPassword) => {
  // Xác minh OTP
  const otpRecord = await UserRepository.verifyOTP(userId, otp);
  if (!otpRecord) {
    throw new Error("OTP không hợp lệ hoặc hết hạn");
  }

  // Kiểm tra độ mạnh mật khẩu
  const strengthCheck = validatePasswordStrength(newPassword);
  if (!strengthCheck.isStrong) {
    throw new Error(
      `Mật khẩu không đủ mạnh: ${strengthCheck.errors.join(", ")}`,
    );
  }

  // Mã hóa mật khẩu mới
  const hashedPassword = await hashPassword(newPassword);

  // Cập nhật mật khẩu
  await UserRepository.updatePassword(userId, hashedPassword);

  // Xóa OTP đã sử dụng
  await UserRepository.deleteOTP(userId);

  return {
    success: true,
    message: "Mật khẩu đã được đặt lại thành công",
  };
};

module.exports = {
  handleUserLogin,
  handleRegister,
  verifyOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordWithOTP,
};
