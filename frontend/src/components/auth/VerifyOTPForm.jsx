import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPasswordResetOTP, setForgotPasswordStep } from '../../redux/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Component để xác minh OTP
 */
const VerifyOTPForm = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordUserId } = useSelector(state => state.auth);
  const [otp, setOtp] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!otp.trim()) {
      setValidationError('Vui lòng nhập OTP');
      return;
    }

    if (otp.length !== 6) {
      setValidationError('OTP phải có 6 chữ số');
      return;
    }

    dispatch(verifyPasswordResetOTP({
      userId: forgotPasswordUserId,
      otp: otp
    }));
  };

  const handleBack = () => {
    dispatch(setForgotPasswordStep('email'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Xác minh OTP</h2>
        <p className="text-gray-600 mt-2">
          Nhập mã OTP được gửi vào email của bạn
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

      <div className="flex gap-2 justify-center mb-6">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            inputMode="numeric"
            value={otp[i] || ''}
            onChange={(e) => {
              const newOtp = otp.split('');
              newOtp[i] = e.target.value.slice(0, 1);
              setOtp(newOtp.join(''));
            }}
            className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        ))}
      </div>

      <Input
        label="Hoặc nhập OTP dưới đây"
        type="text"
        placeholder="Nhập 6 chữ số"
        value={otp}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
          setOtp(value);
          setValidationError('');
        }}
        maxLength="6"
      />

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
          Xác minh
        </Button>
      </div>
    </form>
  );
};

export default VerifyOTPForm;
