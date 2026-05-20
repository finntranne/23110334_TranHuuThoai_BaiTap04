import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

import { verifySignUpOTP, clearError } from "../redux/slices/authSlice";

const RESEND_SECONDS = 300;
const OTP_LENGTH = 6;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VerifySignUpOTPPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // redux state
  const { loading, error } = useSelector((state) => state.auth);

  // otp state
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  // resend timer
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // local validation
  const [validationError, setValidationError] = useState("");

  // refs
  const inputsRef = useRef([]);

  // countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const id = setTimeout(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timer]);

  // handle input change
  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // clear errors
    setValidationError("");
    if (error) {
      dispatch(clearError());
    }

    // next input
    if (val && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // paste otp
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  // resend otp
  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    inputsRef.current[0]?.focus();
  };

  // verify otp
  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    const email = localStorage.getItem("email");
    setValidationError("");

    // validate
    if (code.length < OTP_LENGTH) {
      setValidationError("Vui lòng điền đầy đủ mã OTP 6 chữ số!");
      return;
    }

    // dispatch redux thunk
    const resultAction = await dispatch(
      verifySignUpOTP({
        email,
        code,
      }),
    );

    // success
    if (verifySignUpOTP.fulfilled.match(resultAction)) {
      localStorage.removeItem("email");
      navigate("/login");
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="w-full max-w-[500px] rounded-lg bg-white px-8 py-10 border border-neutral-200 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded bg-neutral-900 items-center justify-center text-white font-black text-xl tracking-wider animate-pulse">
            CS
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-wide uppercase">
            Xác Minh Tài Khoản
          </h1>
          <p className="text-xs text-neutral-500 max-w-[320px] mx-auto leading-relaxed">
            Nhập mã OTP 6 chữ số vừa được gửi tới Email đăng ký thành viên của bạn.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {(validationError || error) && (
            <Alert
              type="error"
              message={validationError || error}
            />
          )}

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 py-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold border border-neutral-200 bg-neutral-50 text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none rounded transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!isComplete || loading}
              className="w-full rounded py-2.5 font-bold text-xs uppercase tracking-wider"
              isLoading={loading}
            >
              Xác Nhận Đăng Ký
            </Button>
          </div>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`w-full py-2.5 rounded border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 uppercase tracking-wider ${
              canResend
                ? "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                : "bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {canResend ? "Gửi lại mã OTP" : `Gửi lại mã OTP (${formatTime(timer)})`}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4 font-bold">
          Quay lại trang{" "}
          <Link to="/register" className="text-neutral-900 hover:text-neutral-950 hover:underline font-black transition-all ml-1 uppercase">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifySignUpOTPPage;
