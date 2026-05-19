import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyOTPForm from './VerifyOTPForm';
import ResetPasswordForm from './ResetPasswordForm';

/**
 * Component chính cho Forgot Password flow
 */
const ForgotPasswordFlow = () => {
  const { forgotPasswordStep, successMessage } = useSelector(state => state.auth);

  const renderStep = () => {
    switch (forgotPasswordStep) {
      case 'email':
        return <ForgotPasswordForm />;
      case 'otp':
        return <VerifyOTPForm />;
      case 'password':
        return <ResetPasswordForm />;
      case 'success':
        return (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h2>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <p className="text-gray-600">
              Bạn có thể đăng nhập với mật khẩu mới của mình
            </p>
          </div>
        );
      default:
        return <ForgotPasswordForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
