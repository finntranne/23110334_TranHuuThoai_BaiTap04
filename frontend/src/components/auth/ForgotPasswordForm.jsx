import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendPasswordResetOTP, setForgotPasswordEmail } from '../../redux/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordEmail } = useSelector(state => state.auth);
  const [email, setEmail] = useState(forgotPasswordEmail || '');
  const [validationError, setValidationError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Vui lòng nhập email');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Email không hợp lệ');
      return;
    }

    dispatch(setForgotPasswordEmail(email));
    dispatch(sendPasswordResetOTP(email));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex w-12 h-12 rounded bg-neutral-900 items-center justify-center text-white font-black text-xl tracking-wider animate-pulse">
          CS
        </div>
        <h2 className="text-xl font-black text-neutral-900 uppercase tracking-wide">Quên mật khẩu?</h2>
        <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
          Nhập email đăng ký của bạn để nhận mã OTP thiết lập lại mật khẩu mới.
        </p>
      </div>

      {(error || validationError) && (
        <Alert
          type="error"
          message={error || validationError}
        />
      )}

      <Input
        label="Địa chỉ Email"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setValidationError('');
        }}
        required
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full rounded py-2.5 text-xs font-bold uppercase tracking-wider"
          isLoading={loading}
        >
          Gửi mã OTP
        </Button>
      </div>

      <div className="text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4 font-bold">
        Quay lại{" "}
        <Link
          to="/login"
          className="text-neutral-900 hover:text-neutral-950 hover:underline font-black transition-all ml-1 uppercase"
        >
          Đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
