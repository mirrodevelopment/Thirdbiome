import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { showToast } from "../../utils/toast";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
} from "../../redux/slices/AuthSlice";

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

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!form.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(form.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    setValidationErrors(errors);
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
      dispatch(registerStart());

      const response = await authService.register(form);

      dispatch(registerSuccess(response));
      showToast.success("Account created successfully! Please log in.");
      navigate("/user/login"); // Redirect to login page since no token is returned
    } catch (err) {
      console.error("Registration error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      const errorData = err.response?.data;
      let errorMessage = "Registration failed. Please try again.";

      if (errorData?.errors) {
        // If there are validation errors from Laravel
        errorMessage = Object.values(errorData.errors).flat().join(", ");
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      dispatch(registerFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Navbar />
      <div className="relative z-10 text-center py-12">
        <h1 className="text-5xl md:text-7xl font-bold  text-[#034327] bg-clip-text-">
          Create Account
        </h1>
      </div>

      {/* Main Registration Content */}
      <div className="flex flex-col items-center justify-center  px-6">
        <div className="w-full max-w-xl">
          {/* Registration Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="w-full">
              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#034327] mb-3">
                      First Name
                    </label>
                    <FloatingInput
                      type="text"
                      name="firstName"
                      label="Enter your first name"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 ${validationErrors.firstName
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#034327]"
                        }`}
                    />
                    {validationErrors.firstName && (
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
                        {validationErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#034327] mb-3">
                      Last Name
                    </label>
                    <FloatingInput
                      type="text"
                      name="lastName"
                      label="Enter your last name"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 ${validationErrors.lastName
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#034327]"
                        }`}
                    />
                    {validationErrors.lastName && (
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
                        {validationErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#034327] mb-3">
                    Phone Number
                  </label>
                  <FloatingInput
                    type="tel"
                    name="phoneNumber"
                    label="Enter your phone number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className={`border-2 rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-200 ${validationErrors.phoneNumber
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-[#034327]"
                      }`}
                  />
                  {validationErrors.phoneNumber && (
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
                      {validationErrors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#034327] mb-3">
                    Password
                  </label>
                  <FloatingInput
                    type="password"
                    name="password"
                    label="Create a secure password (min 8 characters)"
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
                  <div className="mt-3 text-xs text-[#034327]/60">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>At least 8 characters long</li>
                      <li>Mix of letters, numbers, and symbols recommended</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
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
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create Account
                    </span>
                  )}
                </button>

                <div className="text-center pt-6">
                  <p className="text-[#034327]/70">
                    Already have an account?{" "}
                    <Link
                      to="/user/login"
                      className="text-[#034327] hover:text-emerald-600 font-semibold underline transition-colors duration-300"
                    >
                      Sign in here
                    </Link>
                  </p>
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

export default Register;
