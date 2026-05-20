import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPasswordResetOTP, setForgotPasswordStep } from '../../redux/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const VerifyOTPForm = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordUserId } = useSelector(state => state.auth);
  const [otp, setOtp] = useState('');
  const [validationError, setValidationError] = useState('');

  const inputsRef = useRef([]);

  const handleOtpChange = (index, value) => {
    const numericVal = value.replace(/[^0-9]/g, '');
    const newOtp = otp.split('');
    newOtp[index] = numericVal.slice(-1);
    const updatedOtp = newOtp.join('');
    setOtp(updatedOtp);
    setValidationError('');

    if (numericVal && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!otp.trim()) {
      setValidationError('Vui lòng nhập OTP');
      return;
    }

    if (otp.length !== 6) {
      setValidationError('Mã OTP phải gồm 6 chữ số');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex w-12 h-12 rounded bg-neutral-900 items-center justify-center text-white font-black text-xl tracking-wider animate-pulse">
          CS
        </div>
        <h2 className="text-xl font-black text-neutral-900 uppercase tracking-wide">Xác minh OTP</h2>
        <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
          Nhập mã xác thực 6 chữ số vừa được gửi vào email của bạn.
        </p>
      </div>

      {(error || validationError) && (
        <Alert
          type="error"
          message={error || validationError}
        />
      )}

      {/* Grid Inputs */}
      <div className="flex gap-2.5 justify-center py-2">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            maxLength="1"
            inputMode="numeric"
            value={otp[i] || ''}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-center text-xl font-bold border border-neutral-200 bg-neutral-50 text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none rounded transition-all"
          />
        ))}
      </div>

      <div className="space-y-1">
        <Input
          label="Hoặc nhập mã OTP trực tiếp"
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
      </div>

      <div className="flex gap-3 pt-2">
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
          Xác minh
        </Button>
      </div>
    </form>
  );
};

export default VerifyOTPForm;
