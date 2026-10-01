import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { showToast } from "../../utils/toast";
import { mergeCarts } from "../../services/cartService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "../../redux/slices/AuthSlice";
import { FiArrowLeft } from "react-icons/fi";

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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Passwordless login state
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1: email, 2: otp+password
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpPassword, setOtpPassword] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      navigate(redirect || "/checkout");
    }
  }, [isAuthenticated, navigate, location.search]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOtpForm = () => {
    const errors = {};

    if (!otpEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(otpEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (otpStep === 2) {
      if (!otpCode.trim()) {
        errors.otp = "OTP code is required";
      }
      if (!otpPassword.trim()) {
        errors.password = "Password is required";
      } else if (otpPassword.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setOtpError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(loginStart());

      const response = await authService.login(form);

      dispatch(loginSuccess(response));
      showToast.success("Login successful!");

      // Merge guest cart with user cart after successful login
      try {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
          await mergeCarts();
          showToast.success("Your cart items have been merged!");
        }
      } catch (mergeError) {
        // Don't show error to user as login was successful
      }

      // Redirect handled by useEffect
    } catch (err) {
      console.error("Full Login Error:", err);
      const errorData = err.response?.data;
      let errorMessage = "Login failed. Please try again.";

      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (err.response?.status) {
        errorMessage = `Error ${err.response.status}: ${err.response.statusText || 'Server Error'}`;
        if (typeof errorData === 'string') {
          errorMessage += ` - ${errorData.substring(0, 100)}`;
        }
      } else if (err.message) {
        errorMessage = `Network Error: ${err.message}`;
      }

      dispatch(loginFailure(errorMessage));
    }
  };

  // Handle passwordless login flow
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!validateOtpForm()) {
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError("");

      if (otpStep === 1) {
        // Send OTP
        await authService.sendLoginCode(otpEmail);
        showToast.success("Login code sent to your email!");
        setOtpStep(2);
      } else if (otpStep === 2) {
        // Verify OTP and set password
        const response = await authService.verifyLoginCodeAndSetPassword(
          otpEmail,
          otpCode,
          otpPassword
        );

        // Login successful
        dispatch(loginSuccess(response));
        showToast.success(
          "Account created successfully! You are now logged in."
        );

        // Merge guest cart with user cart after successful login
        try {
          const sessionId = localStorage.getItem("sessionId");
          if (sessionId) {
            await mergeCarts();
            showToast.success("Your cart items have been merged!");
          }
        } catch (mergeError) {
          // Error merging carts
        }

        // Reset passwordless login state
        setShowOtpLogin(false);
        setOtpStep(1);
        setOtpEmail("");
        setOtpCode("");
        setOtpPassword("");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Operation failed. Please try again.";
      setOtpError({ general: errorMessage });
      showToast.error(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Navbar />

      <div className="relative z-10 text-center py-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#034327] bg-clip-text-">
          Login
        </h1>
      </div>
      {/* Main Login Content */}
      <div className="flex flex-col items-center justify-center py-1 px-6">
        <div className="w-full max-w-xl">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Corner Element */}

            {/* Go back icon for passwordless login */}
            {showOtpLogin && (
              <button
                className="mb-6 flex items-center text-[#034327] hover:text-emerald-600 transition-colors duration-200"
                onClick={() => {
                  setShowOtpLogin(false);
                  setOtpStep(1);
                  setOtpEmail("");
                  setOtpCode("");
                  setOtpPassword("");
                  setOtpError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                aria-label="Go back"
              >
                <FiArrowLeft className="mr-3 text-xl" />
                <span className="font-medium underline">Back to login</span>
              </button>
            )}

            {/* Passwordless Login UI */}
            {!showOtpLogin ? (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <span className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-4 py-2 rounded-full text-[#034327] text-sm font-medium tracking-wide">
                      Welcome Back{" "}
                    </span>
                  </div>
                  <p className="text-[#034327]/80 font-medium leading-relaxed">
                    Passwordless login, simply sign in with a secure four-digit
                    code sent to you via email and/or SMS <br />
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    className="group relative w-full bg-gradient-to-r from-[#034327] to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 mb-"
                    onClick={() => setShowOtpLogin(true)}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Send Login Code
                    </span>
                    <div className="absolute inset-0 bg-emerald-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[#034327] mb-2">
                    {otpStep === 1 ? "Enter Your Email" : "Complete Setup"}
                  </h2>
                  <p className="text-[#034327]/70">
                    {otpStep === 1
                      ? "We'll send a secure code to your email address"
                      : "Enter the code and set your password"}
                  </p>
                </div>

                <form className="w-full space-y-6" onSubmit={handleOtpSubmit}>
                  {/* Step 1: Email */}
                  {otpStep === 1 && (
                    <div>
                      <label
                        className="block text-sm font-semibold text-[#034327] mb-3"
                        htmlFor="otp-email"
                      >
                        Email Address
                      </label>
                      <input
                        id="otp-email"
                        type="email"
                        className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:outline-none focus:bg-white transition-all duration-200 ${otpError.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-[#034327]"
                          }`}
                        placeholder="Enter your email address"
                        value={otpEmail}
                        onChange={(e) => {
                          setOtpEmail(e.target.value);
                          if (otpError.email) {
                            setOtpError({ ...otpError, email: "" });
                          }
                        }}
                        required
                        disabled={otpLoading}
                      />
                      {otpError.email && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {otpError.email}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 2: OTP + Set Password */}
                  {otpStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label
                          className="block text-sm font-semibold text-[#034327] mb-3"
                          htmlFor="otp-code"
                        >
                          Verification Code
                        </label>
                        <input
                          id="otp-code"
                          type="text"
                          className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:outline-none focus:bg-white transition-all duration-200 text-center text-2xl tracking-widest ${otpError.otp
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-[#034327]"
                            }`}
                          placeholder="0000000"
                          value={otpCode}
                          onChange={(e) => {
                            setOtpCode(e.target.value);
                            if (otpError.otp) {
                              setOtpError({ ...otpError, otp: "" });
                            }
                          }}
                          required
                          disabled={otpLoading}
                          maxLength={7}
                        />
                        {otpError.otp && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {otpError.otp}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="block text-sm font-semibold text-[#034327] mb-3"
                          htmlFor="otp-password"
                        >
                          Create Password
                        </label>
                        <input
                          id="otp-password"
                          type="password"
                          className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:outline-none focus:bg-white transition-all duration-200 ${otpError.password
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-[#034327]"
                            }`}
                          placeholder="Create a secure password (min 6 characters)"
                          value={otpPassword}
                          onChange={(e) => {
                            setOtpPassword(e.target.value);
                            if (otpError.password) {
                              setOtpError({ ...otpError, password: "" });
                            }
                          }}
                          required
                          disabled={otpLoading}
                          minLength={6}
                        />
                        {otpError.password && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {otpError.password}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {otpError.general && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {otpError.general}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${otpLoading
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-[#034327] to-emerald-600 text-white hover:shadow-xl hover:scale-105 shadow-lg"
                      }`}
                  >
                    {otpLoading
                      ? "Processing..."
                      : otpStep === 1
                        ? "Send Verification Code"
                        : "Complete Setup & Sign In"}
                  </button>

                  <button
                    type="button"
                    className="w-full text-center text-sm text-[#034327]/70 hover:text-[#034327] mt-4 underline transition-colors duration-200"
                    onClick={() => {
                      setShowOtpLogin(false);
                      setOtpStep(1);
                      setOtpEmail("");
                      setOtpCode("");
                      setOtpPassword("");
                      setOtpError("");
                    }}
                  >
                    Use password instead
                  </button>
                </form>
              </div>
            )}

            {/* Divider and password login form only shown if not in passwordless login mode */}
            {!showOtpLogin && (
              <>
                <div className="flex items-center my-8 w-full">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <span className="mx-4 text-[#034327]/60 font-medium text-sm bg-white px-2">
                    or continue with password
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Enhanced login form */}
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div>
                    <FloatingInput
                      type="email"
                      name="email"
                      label="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      className={`border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 ${validationErrors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#034327]"
                        }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <FloatingInput
                      type="password"
                      name="password"
                      label="Password"
                      value={form.password}
                      onChange={handleChange}
                      className={`border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 ${validationErrors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#034327]"
                        }`}
                    />
                    {validationErrors.password && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/user/forgot-password"
                      className="text-sm text-[#034327] hover:text-emerald-600 font-medium underline transition-colors duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${loading
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
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <p className="text-[#034327]/70">
                      Don't have an account?{" "}
                      <Link
                        to="/user/register"
                        className="text-[#034327] hover:text-emerald-600 font-semibold underline transition-colors duration-300"
                      >
                        Create one now
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
