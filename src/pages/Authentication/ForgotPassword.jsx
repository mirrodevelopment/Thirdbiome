import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

// Floating label input component (updated for new design)
const FloatingInput = ({
  type,
  name,
  value,
  onChange,
  label,
  className = "",
  ...rest
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-4 focus:outline-none bg-transparent peer ${className}`}
        autoComplete="off"
        placeholder=" "
        {...rest}
      />
      <label
        htmlFor={name}
        className={`
          absolute left-4 top-1/2 -translate-y-1/2 text-[#034327]/60 pointer-events-none transition-all duration-200
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-[#034327]/60
          peer-placeholder-shown:-translate-y-1/2
          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:text-[#034327]
          peer-focus:font-semibold
          ${value ? "top-2 text-xs text-[#034327] font-semibold" : ""}
          bg-white px-1
        `}
        style={{ backgroundColor: "#fff" }}
      >
        {label}
      </label>
    </div>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validateOTP = (otp) => {
    if (!otp.trim()) {
      return "OTP is required";
    }
    if (otp.length !== 7) {
      return "OTP must be 7 digits";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(form.email);
    if (emailError) {
      showToast.error(emailError);
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(form.email);
      setStep(2);
      showToast.success("OTP sent successfully to your email");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const otpError = validateOTP(form.otp);
    if (otpError) {
      showToast.error(otpError);
      return;
    }

    setLoading(true);

    try {
      await authService.verifyOTP(form.email, form.otp);
      setStep(3);
      showToast.success("OTP verified successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      showToast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(form.email, form.otp, form.newPassword);
      showToast.success(
        "Password reset successfully! You can now login with your new password."
      );
      navigate("/user/login");
      setTimeout(() => {
        setForm({ email: "", otp: "", newPassword: "" });
        setStep(1);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Navbar />

      <div className="relative z-10 text-center py-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#034327] bg-clip-text-">
          Forgot Password
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-1 px-6">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= stepNumber
                        ? "bg-gradient-to-r from-[#034327] to-emerald-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > stepNumber ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-12 h-0.5 transition-all duration-300 ${
                        step > stepNumber
                          ? "bg-gradient-to-r from-[#034327] to-emerald-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-[#034327]/70 font-medium">
              <span>Email</span>
              <span>Verify</span>
              <span>Reset</span>
            </div>
          </div>

          {/* Reset Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Corner Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-[#034327]/10 rounded-full -translate-y-16 translate-x-16"></div>

            <form
              onSubmit={
                step === 1
                  ? handleEmailSubmit
                  : step === 2
                  ? handleOtpSubmit
                  : handlePasswordSubmit
              }
              className="w-full"
            >
              {/* Step Headers */}
              <div className="text-center mb-8">
                {step === 1 && (
                  <>
                    <div className="inline-block mb-4">
                      <span className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-4 py-2 rounded-full text-[#034327] text-sm font-medium tracking-wide">
                        STEP 1 OF 3
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#034327] mb-2">
                      Enter Your Email
                    </h2>
                    <p className="text-[#034327]/70">
                      We'll send a verification code to your email address
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="inline-block mb-4">
                      <span className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-4 py-2 rounded-full text-[#034327] text-sm font-medium tracking-wide">
                        STEP 2 OF 3
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#034327] mb-2">
                      Verify Your Identity
                    </h2>
                    <p className="text-[#034327]/70">
                      Enter the 7-digit code sent to{" "}
                      <span className="font-semibold text-[#034327]">
                        {form.email}
                      </span>
                    </p>
                  </>
                )}
                {step === 3 && (
                  <>
                    <div className="inline-block mb-4">
                      <span className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-4 py-2 rounded-full text-[#034327] text-sm font-medium tracking-wide">
                        STEP 3 OF 3
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#034327] mb-2">
                      Create New Password
                    </h2>
                    <p className="text-[#034327]/70">
                      Choose a strong password to secure your account
                    </p>
                  </>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-semibold text-[#034327] mb-3">
                      Email Address
                    </label>
                    <FloatingInput
                      type="email"
                      name="email"
                      label="Enter your email address"
                      value={form.email}
                      onChange={handleChange}
                      className="border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 border-gray-200 focus:border-[#034327]"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-sm font-semibold text-[#034327] mb-3">
                      Verification Code
                    </label>
                    <FloatingInput
                      type="text"
                      name="otp"
                      label="Enter 7-digit code"
                      value={form.otp}
                      onChange={handleChange}
                      maxLength={7}
                      className="border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 border-gray-200 focus:border-[#034327] text-center text-2xl tracking-widest"
                    />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <label className="block text-sm font-semibold text-[#034327] mb-3">
                      New Password
                    </label>
                    <FloatingInput
                      type="password"
                      name="newPassword"
                      label="Create a strong password (min 8 characters)"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 border-gray-200 focus:border-[#034327]"
                    />
                    <div className="mt-3 text-xs text-[#034327]/60">
                      <p>Password requirements:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>At least 8 characters long</li>
                        <li>
                          Mix of letters, numbers, and symbols recommended
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-[#034327] to-emerald-600 text-white hover:shadow-xl hover:scale-105 shadow-lg"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {step === 1
                        ? "Sending..."
                        : step === 2
                        ? "Verifying..."
                        : "Resetting..."}
                    </span>
                  ) : (
                    <>
                      {step === 1 && "Send Verification Code"}
                      {step === 2 && "Verify Code"}
                      {step === 3 && "Reset Password"}
                    </>
                  )}
                </button>

                {/* Navigation Buttons */}
                {step === 2 && (
                  <button
                    type="button"
                    className="w-full py-3 text-[#034327]/70 hover:text-[#034327] font-medium underline transition-colors duration-200"
                    onClick={() => setStep(1)}
                  >
                    ← Back to Email
                  </button>
                )}

                <div className="text-center pt-4">
                  <Link
                    to="/user/login"
                    className="text-[#034327]/70 hover:text-[#034327] font-medium underline transition-colors duration-300"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default ForgotPassword;
