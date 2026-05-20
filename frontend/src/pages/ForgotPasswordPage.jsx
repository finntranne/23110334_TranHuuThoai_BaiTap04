import React from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordFlow from '../components/auth/ForgotPasswordFlow';

/**
 * Page Quên mật khẩu
 */
const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <ForgotPasswordFlow />
    </div>
  );
};

export default ForgotPasswordPage;
