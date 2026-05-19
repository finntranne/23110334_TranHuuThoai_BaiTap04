import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPasswordResetOTP, setForgotPasswordEmail } from '../../redux/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Component để yêu cầu gửi OTP reset mật khẩu
 */
const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordEmail } = useSelector(state => state.auth);
  const [email, setEmail] = useState(forgotPasswordEmail);
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h2>
        <p className="text-gray-600 mt-2">
          Nhập email của bạn và chúng tôi sẽ gửi OTP để đặt lại mật khẩu
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {validationError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setValidationError('');
        }}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={loading}
        className="w-full"
      >
        Gửi OTP
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
