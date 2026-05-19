import React from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordFlow from '../components/auth/ForgotPasswordFlow';

/**
 * Page Quên mật khẩu
 */
const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ForgotPasswordFlow />
    </div>
  );
};

export default ForgotPasswordPage;
