import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../redux/slices/authSlice";

import InputField from "../components/InputField";
import Button from "../components/Button";

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
      // lấy redirectUrl từ backend
      const redirectUrl =
        resultAction.payload.redirectUrl;

      navigate(redirectUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Đăng Nhập
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />

          <InputField
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />

          <div className="mt-6">
            <Button type="submit" isLoading={loading}>
              Đăng Nhập
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-500"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;