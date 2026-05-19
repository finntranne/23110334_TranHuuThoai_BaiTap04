import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";

import { EyeIcon, EyeOffIcon } from "../components/ui/auth/icons";
import { InputField } from "../components/ui/auth/input";
import { PasswordStrength } from "../components/ui/auth/password-strength";
import { baseButtonClass } from "../components/ui/auth/button";

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
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
      const emailToSave = form.email.trim(); // Lưu giá trị trước khi reset

      if (emailToSave) {
        localStorage.setItem("email", emailToSave);
      }

      // Reset form
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
    <div className="flex min-h-[80vh] justify-center bg-[#eef2f9] px-4 py-5">
      <div className="w-full max-w-[500px] rounded-[32px] bg-white px-10 pt-10 pb-9 text-left shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <p className="mb-1 text-left text-[18px] font-bold uppercase tracking-[5px] text-blue-600">
          Create Account
        </p>

        <h1 className="mt-[10px] mb-[10px] font-bold text-left text-[2rem] leading-none text-slate-900">
          Start learning today
        </h1>

        <p className="mb-7 text-left text-[16px] leading-[1.6] text-gray-500">
          Create your account to save progress and access premium courses.
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          {/* API Error */}
          {error && (
            <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>
          )}

          <InputField
            id="fullName"
            label="Full Name"
            placeholder="Nguyen Van A"
            value={form.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
          />

          <InputField
            id="email"
            type="email"
            label="Email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />

          {/* Password */}
          <div className="mb-5">
            <label className="mb-[6px] block text-[14px] font-bold text-slate-900">
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange("password")}
                className={`block h-[40px] w-full rounded-[14px] border-[1.5px] pl-4 pr-[44px] text-[15px] outline-none transition-all
                  ${errors.password ? "border-red-500" : "border-slate-200 focus:border-blue-500"}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-[14px] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-[5px] text-[12px] text-red-500">
                {errors.password}
              </p>
            )}
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm Password */}
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            showToggle
            showPassword={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              ${baseButtonClass} mt-2 font-bold text-white bg-blue-600
              shadow-[0_4px_14px_rgba(37,99,235,0.25)]
              hover:bg-blue-700 hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)]
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
          >
            {loading ? "Đang đăng ký..." : "Register"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            className={`${baseButtonClass} flex items-center justify-center gap-3 border border-gray-300 bg-white text-black hover:bg-gray-50`}
          >
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
