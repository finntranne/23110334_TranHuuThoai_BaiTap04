import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { PasswordStrength } from "../components/ui/auth/password-strength";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

import {
  registerUser,
  clearError,
  resetRegisterState,
} from "../redux/slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth,
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Xóa lỗi khi người dùng gõ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) {
      dispatch(clearError());
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.fullName.trim()) {
      errs.fullName = "Họ và tên là bắt buộc";
    }

    if (!form.email.trim()) {
      errs.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Email không hợp lệ";
    }

    if (!form.password) {
      errs.password = "Mật khẩu là bắt buộc";
    } else if (form.password.length < 8) {
      errs.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (form.confirmPassword !== form.password) {
      errs.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      registerUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    );
  };

  // Xử lý sau khi đăng ký thành công
  useEffect(() => {
    if (registerSuccess) {
      const emailToSave = form.email.trim();
      if (emailToSave) {
        localStorage.setItem("email", emailToSave);
      }

      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});

      navigate("/verify-signup-otp");
    }
  }, [registerSuccess, navigate, form.email]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="w-full max-w-[500px] rounded-lg bg-white px-8 py-10 border border-neutral-200 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded bg-neutral-900 items-center justify-center text-white font-black text-xl tracking-wider">
            CS
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-wide uppercase">
            Đăng Ký Thành Viên
          </h1>
          <p className="text-xs text-neutral-500 max-w-[320px] mx-auto leading-relaxed">
            Trở thành thành viên để nhận mã giảm giá 10% và cập nhật các bộ sưu tập quần áo mới nhất.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert
              type="error"
              message={error}
            />
          )}

          <Input
            label="Họ và tên"
            name="fullName"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Địa chỉ Email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Mật khẩu"
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Nhập mật khẩu ít nhất 8 ký tự"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-[38px] text-xs font-bold text-neutral-450 hover:text-neutral-700"
            >
              {showPwd ? "Ẩn" : "Hiện"}
            </button>
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu phía trên"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[38px] text-xs font-bold text-neutral-450 hover:text-neutral-700"
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full rounded py-2.5 font-bold text-xs uppercase tracking-wider"
              isLoading={loading}
            >
              Đăng Ký Tài Khoản
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-[1px] flex-1 bg-neutral-100" />
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">hoặc</span>
            <div className="h-[1px] flex-1 bg-neutral-100" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            className="w-full py-2.5 flex items-center justify-center gap-3 border border-neutral-300 bg-white text-xs font-bold text-neutral-700 hover:bg-slate-50 transition-colors rounded shadow-sm"
          >
            <FcGoogle size={18} />
            <span>Đăng ký qua Google</span>
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4 font-bold">
          Đã có tài khoản thành viên?{" "}
          <Link to="/login" className="text-neutral-900 hover:text-neutral-950 hover:underline font-black transition-all ml-1 uppercase">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
