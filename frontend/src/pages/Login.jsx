import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      login({
        email: formData.email,
        password: formData.password,
      })
    );

    if (login.fulfilled.match(resultAction)) {
      const redirectUrl = resultAction.payload.redirectUrl;
      navigate(redirectUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white p-8 rounded-lg border border-neutral-200 w-full max-w-md space-y-6">
        
        {/* Header/Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded bg-neutral-900 items-center justify-center text-white font-black text-xl tracking-wider">
            CS
          </div>
          <h2 className="text-xl font-black text-neutral-900 tracking-wide uppercase">
            Đăng Nhập Thành Viên
          </h2>
          <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
            Đăng nhập để nhận các chương trình ưu đãi, tích lũy điểm và trải nghiệm mua sắm tốt nhất.
          </p>
        </div>

        {error && (
          <Alert
             type="error"
             message={error}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Địa chỉ Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />

          <div className="space-y-1">
            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-neutral-800 hover:text-neutral-950 hover:underline transition-all"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full rounded py-2.5 text-xs font-bold uppercase tracking-wider"
              isLoading={loading}
            >
              Đăng Nhập
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4 font-bold">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-neutral-900 hover:text-neutral-950 hover:underline font-black transition-all ml-1 uppercase"
          >
            Đăng ký thành viên
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;