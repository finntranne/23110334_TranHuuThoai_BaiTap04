import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { baseButtonClass } from "../components/ui/auth/button";

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
  const [errors, setErrors] = useState({});

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

    // clear local error
    if (errors.api) {
      setErrors({});
    }

    // clear redux error
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

    setErrors({});

    // validate
    if (code.length < OTP_LENGTH) {
      setErrors({
        api: "Please enter full OTP code!",
      });

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
    <div className="flex min-h-[50vh] justify-center bg-[#eef2f9] px-4 py-5">
      <div
        className="
          w-full
          max-w-[500px]
          rounded-[32px]
          bg-white
          px-10
          pt-10
          pb-9
          text-left
          shadow-[0_2px_16px_rgba(0,0,0,0.06)]
        "
      >
        {/* Header */}
        <p
          className="
            mb-1
            text-center
            text-[18px]
            font-bold
            uppercase
            tracking-[5px]
            text-blue-600
          "
        >
          Verify Your Account
        </p>

        <h1
          className="
            mt-[10px]
            mb-[10px]
            text-center
            text-[2rem]
            font-bold
            leading-none
            text-slate-900
          "
        >
          Enter 6-digit code
        </h1>

        <p
          className="
            mb-7
            text-center
            text-[16px]
            leading-[1.6]
            text-gray-500
          "
        >
          We sent an OTP to your email address.
        </p>

        {/* Form */}
        <form onSubmit={handleVerify} className="text-left">
          {/* Error */}
          {(errors.api || error) && (
            <p className="mt-2 mb-4 text-sm text-red-500">
              {errors.api || error}
            </p>
          )}

          {/* OTP Inputs */}
          <div
            className="
              mb-[28px]
              flex
              justify-center
              gap-[10px]
            "
          >
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
                className={`
                  box-border
                  h-[60px]
                  w-[52px]
                  rounded-[14px]
                  border-2
                  bg-white
                  text-center
                  text-[22px]
                  font-bold
                  text-slate-800
                  outline-none
                  transition-colors
                  ${digit ? "border-blue-500" : "border-slate-200"}
                `}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isComplete || loading}
            className={`
              ${baseButtonClass}
              bg-blue-600
              font-bold
              text-white
              shadow-[0_4px_14px_rgba(37,99,235,0.25)]
              hover:bg-blue-700
              hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)]
              disabled:opacity-60
            `}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`
              ${baseButtonClass}
              flex
              items-center
              justify-center
              gap-3
              border
              border-gray-300
              bg-white
              font-bold
              transition-all
              ${
                canResend
                  ? "cursor-pointer text-black hover:bg-blue-50"
                  : "cursor-not-allowed text-gray-400 opacity-70"
              }
            `}
          >
            <span>
              {canResend ? "Resend OTP" : `Resend OTP (${formatTime(timer)})`}
            </span>
          </button>
        </form>

        {/* Footer */}
        <p
          className="
            mt-5
            text-center
            text-[15px]
            text-gray-500
          "
        >
          Back to{" "}
          <Link
            to="/register"
            className="
              font-bold
              text-blue-600
            "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifySignUpOTPPage;
