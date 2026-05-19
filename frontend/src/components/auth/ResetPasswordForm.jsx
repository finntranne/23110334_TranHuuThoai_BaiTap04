import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordWithOTP, setForgotPasswordStep } from '../../redux/slices/authSlice';
import Button from '../common/Button';

/**
 * Component để đặt lại mật khẩu
 */
const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordUserId, forgotPasswordOTP } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('ít nhất 8 ký tự');
    if (!/[A-Z]/.test(password)) errors.push('1 chữ hoa');
    if (!/[a-z]/.test(password)) errors.push('1 chữ thường');
    if (!/[0-9]/.test(password)) errors.push('1 chữ số');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const { newPassword, confirmPassword } = formData;

    if (!newPassword.trim()) {
      setValidationError('Vui lòng nhập mật khẩu mới');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setValidationError(`Mật khẩu phải chứa: ${passwordErrors.join(', ')}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Mật khẩu không khớp');
      return;
    }

    dispatch(resetPasswordWithOTP({
      userId: forgotPasswordUserId,
      otp: forgotPasswordOTP,
      newPassword,
      confirmPassword
    }));
  };

  const handleBack = () => {
    dispatch(setForgotPasswordStep('otp'));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
        <p className="text-gray-600 mt-2">
          Nhập mật khẩu mới của bạn
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu mới <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword.newPassword ? 'text' : 'password'}
            name="newPassword"
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('newPassword')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword.newPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Phải chứa: 8+ ký tự, chữ hoa, chữ thường, số
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Xác nhận mật khẩu <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword.confirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmPassword')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword.confirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleBack}
          className="w-full"
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full"
        >
          Đặt lại mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
