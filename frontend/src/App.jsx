import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/Register";
import VerifySignUpOTPPage from "./pages/VerifySignUpOTP";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
        
        {/* Register */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Verify Sign Up OTP */}
        <Route path="/verify-signup-otp" element={<VerifySignUpOTPPage />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
