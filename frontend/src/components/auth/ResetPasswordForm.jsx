import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordWithOTP, setForgotPasswordStep } from '../../redux/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordUserId, forgotPasswordOTP } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex w-12 h-12 rounded bg-neutral-900 items-center justify-center text-white font-black text-xl tracking-wider animate-pulse">
          CS
        </div>
        <h2 className="text-xl font-black text-neutral-900 uppercase tracking-wide">Đặt lại mật khẩu</h2>
        <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
          Tạo mật khẩu mới có tính bảo mật cao cho tài khoản thành viên của bạn.
        </p>
      </div>

      {(error || validationError) && (
        <Alert
          type="error"
          message={error || validationError}
        />
      )}

      {/* Password field */}
      <div className="relative">
        <Input
          label="Mật khẩu mới"
          type={showPassword ? 'text' : 'password'}
          name="newPassword"
          placeholder="Nhập mật khẩu mới"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-xs font-bold text-neutral-450 hover:text-neutral-700"
        >
          {showPassword ? 'Ẩn' : 'Hiện'}
        </button>
        <p className="text-[10px] text-neutral-450 mt-1 font-bold">
          Yêu cầu: 8+ ký tự, chữ hoa, chữ thường và chữ số
        </p>
      </div>

      {/* Confirm Password field */}
      <div className="relative">
        <Input
          label="Xác nhận mật khẩu"
          type={showConfirm ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu mới"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-[38px] text-xs font-bold text-neutral-450 hover:text-neutral-700"
        >
          {showConfirm ? 'Ẩn' : 'Hiện'}
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleBack}
          className="flex-1 rounded text-xs py-2.5 uppercase font-bold"
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="flex-1 rounded text-xs py-2.5 uppercase font-bold"
        >
          Đặt lại mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
