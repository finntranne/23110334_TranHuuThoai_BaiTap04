import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyOTPForm from './VerifyOTPForm';
import ResetPasswordForm from './ResetPasswordForm';

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
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-150 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wide">Khôi phục thành công!</h2>
              <p className="text-xs text-neutral-500">{successMessage}</p>
            </div>
            <div className="pt-4 border-t border-neutral-100">
              <Link
                to="/login"
                className="inline-block w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded transition-all text-xs text-center uppercase tracking-wider"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        );
      default:
        return <ForgotPasswordForm />;
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-neutral-200 p-8">
      {renderStep()}
    </div>
  );
};

export default ForgotPasswordFlow;
