import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { authService } from "../../services/authService";
import { customerService } from "../../services/customerService";
import { getUserOrders, cancelOrder } from "../../services/orderService";
import { showToast } from "../../utils/toast";
import {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  logout as logoutAction,
} from "../../redux/slices/AuthSlice";
import {
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaHistory,
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaSave,
  FaTimes,
  FaUserCircle,
  FaShoppingBag,
  FaHeart,
  FaStar,
} from "react-icons/fa";

// Modern Floating Input Component matching login design
const FloatingInput = ({
  type,
  name,
  value,
  onChange,
  label,
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <div className="relative mb-6">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:outline-none focus:bg-white transition-all duration-200 peer ${disabled
          ? "bg-gray-100/70 cursor-not-allowed text-gray-500 border-gray-200"
          : "border-gray-200 focus:border-[#034327] text-[#034327]"
          } ${className}`}
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
          ${disabled ? "text-gray-400" : ""}
          bg-white px-1
        `}
      >
        {label}
      </label>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [originalForm, setOriginalForm] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileFetching, setProfileFetching] = useState(false);
  const [orders, setOrders] = useState([]);

  // Form state initialized with user data from Redux or defaults
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "••••••••••••••••",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Helper function to ensure address structure exists
  const ensureAddressStructure = (userData) => {
    return {
      ...userData,
      address: userData.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    };
  };

  // Only redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("token")) {
      navigate("/user/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      // Need user ID for fetching
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        setProfileFetching(true);
        const response = await customerService.getProfile(userId);

        // Handle both wrapped {success, data} and raw response
        const userData = response.data || (response.id || response._id ? response : null);
        console.log("Profile Data Received for ID", userId, ":", userData);

        if (userData) {
          // Robust mapping: only include fields that are actually in the response
          const mappedUser = {
            id: userData.id || userData._id || userId,
          };

          if (userData.first_name || userData.firstName) mappedUser.firstName = userData.first_name || userData.firstName;
          if (userData.last_name || userData.lastName) mappedUser.lastName = userData.last_name || userData.lastName;
          if (userData.phone || userData.phoneNumber || userData.phone_number) mappedUser.phoneNumber = userData.phone || userData.phoneNumber || userData.phone_number;
          if (userData.email) mappedUser.email = userData.email;

          const addr = userData.address || {};
          const mappedAddr = {};

          if (addr.street || userData.street || userData.address_line1) mappedAddr.street = addr.street || userData.street || userData.address_line1;
          if (addr.city || userData.city) mappedAddr.city = addr.city || userData.city;
          if (addr.state || userData.state || userData.province) mappedAddr.state = addr.state || userData.state || userData.province;
          if (addr.zipCode || addr.zip_code || userData.zip_code || userData.postcode) mappedAddr.zipCode = addr.zipCode || addr.zip_code || userData.zip_code || userData.postcode;
          if (addr.country || userData.country) mappedAddr.country = addr.country || userData.country;

          if (Object.keys(mappedAddr).length > 0) {
            mappedUser.address = { ...user?.address, ...mappedAddr };
          }

          dispatch(updateProfileSuccess({ user: mappedUser }));
        }
        else {
          console.warn("Profile data received but structure unknown:", response);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // showToast.error("Could not load profile data from server.");
      } finally {
        setProfileFetching(false);
      }
    };

    if (isAuthenticated || localStorage.getItem("token")) {
      fetchProfile();
    }
  }, [isAuthenticated, user?.id, user?._id, dispatch]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      const newFormData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        password: "••••••••••••••••",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      };
      setForm(newFormData);
    }
  }, [user]);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        console.log("Orders response:", response);
        // Handle different response structures
        let ordersData = [];
        if (Array.isArray(response)) {
          ordersData = response;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.orders)) {
          ordersData = response.orders;
        }

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Don't show toast on 404 (no orders)
        if (error.response?.status !== 404) {
          showToast.error("Failed to fetch order history.");
        }
        setOrders([]);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEdit = () => {
    setOriginalForm({ ...form });
    setIsEditing(true);
    setPasswordChanged(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (originalForm) {
      setForm(originalForm);
    }
    setOriginalForm(null);
    setPasswordChanged(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zipCode", "country"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      // Track if password field is being changed
      if (name === "password") {
        setPasswordChanged(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      dispatch(updateProfileStart());

      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      };

      // Only include password if it has been changed
      if (
        passwordChanged &&
        form.password &&
        form.password !== "••••••••••••••••"
      ) {
        updateData.password = form.password;
      }

      const userId = user?.id || user?._id;
      const response = await customerService.updateProfile(userId, updateData);

      // Map snake_case to camelCase for the updated state
      const apiUser = response.user || response.data?.user || response.data || {};
      const updatedUserData = ensureAddressStructure({
        firstName: apiUser.first_name || apiUser.firstName || form.firstName,
        lastName: apiUser.last_name || apiUser.lastName || form.lastName,
        phoneNumber: apiUser.phone || apiUser.phoneNumber || form.phoneNumber,
        email: apiUser.email || form.email,
        address: apiUser.address || {
          street: apiUser.street || form.address.street,
          city: apiUser.city || form.address.city,
          state: apiUser.state || form.address.state,
          zipCode: apiUser.zip_code || apiUser.zipCode || form.address.zipCode,
          country: apiUser.country || form.address.country,
        }
      });

      dispatch(updateProfileSuccess({ user: updatedUserData }));
      showToast.success(response.message || "Profile updated successfully!");
      setIsEditing(false);
      setOriginalForm(null);
      setPasswordChanged(false);
    } catch (error) {
      dispatch(
        updateProfileFailure(
          error.response?.data?.message || "Failed to update profile"
        )
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      showToast.success("Order cancelled successfully");
      // Refresh orders
      const response = await getUserOrders();
      setOrders(response.data || []);
    } catch (error) {
      showToast.error("Failed to cancel order");
    }
  };

  // Logout handler
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center border border-emerald-300">
                  <FaUserCircle className="text-2xl sm:text-3xl lg:text-4xl text-emerald-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <FaHeart className="text-white text-xs sm:text-sm" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {(() => {
                  const hour = new Date().getHours();
                  let greeting = "Good Morning";
                  if (hour >= 12 && hour < 17) {
                    greeting = "Good Afternoon";
                  } else if (hour >= 17 || hour < 4) {
                    greeting = "Good Evening";
                  }
                  return (
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-2 sm:mb-3 text-[#034327] leading-tight">
                      {greeting},{" "}
                      {user?.firstName || user?.lastName
                        ? `${user.firstName || ""}`.trim()
                        : "Account"}
                      !
                    </h1>
                  );
                })()}
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mb-2 sm:mb-3">
                  Welcome back to your wellness journey
                </p>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="bg-emerald-100 border border-emerald-200 px-2 sm:px-3 py-1 rounded-full text-emerald-700 text-xs font-medium tracking-wide">
                    Our Favorite Customer
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gray-200 hover:text-[#034327] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center lg:justify-start"
            >
              <FaSignOutAlt className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Modern Tab Navigation */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-xl border border-gray-100 backdrop-blur-sm w-full max-w-4xl">
              <div className="flex flex-row space-x-1 sm:space-x-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`group px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden flex-1 text-xs sm:text-sm md:text-base ${activeTab === "profile"
                    ? "bg-gradient-to-r from-[#034327] to-emerald-600 text-white shadow-lg"
                    : "text-[#034327] hover:bg-emerald-50"
                    }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 relative z-10">
                    <FaUser className="text-base sm:text-lg flex-shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">
                      My Profile
                    </span>
                  </div>
                  {activeTab === "profile" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`group px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden flex-1 text-xs sm:text-sm md:text-base ${activeTab === "orders"
                    ? "bg-gradient-to-r from-[#034327] to-emerald-600 text-white shadow-lg"
                    : "text-[#034327] hover:bg-emerald-50"
                    }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 relative z-10">
                    <div className="relative">
                      <FaShoppingBag className="text-base sm:text-lg flex-shrink-0" />
                      {orders.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-emerald-400 text-white text-xs rounded-full px-1 py-0.5 font-bold min-w-[16px] h-4 flex items-center justify-center text-[9px] sm:hidden">
                          {orders.length}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline whitespace-nowrap">
                      My Orders
                    </span>
                    {orders.length > 0 && (
                      <span className="hidden sm:inline-flex bg-emerald-400 text-white text-xs rounded-full px-2 py-1 font-bold min-w-[20px] h-5 items-center justify-center">
                        {orders.length}
                      </span>
                    )}
                  </div>
                  {activeTab === "orders" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`group px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden flex-1 text-xs sm:text-sm md:text-base ${activeTab === "settings"
                    ? "bg-gradient-to-r from-[#034327] to-emerald-600 text-white shadow-lg"
                    : "text-[#034327] hover:bg-emerald-50"
                    }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 relative z-10">
                    <FaCog className="text-base sm:text-lg flex-shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">
                      Settings
                    </span>
                  </div>
                  {activeTab === "settings" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Main Content Area */}
          <div className="relative">
            {profileFetching && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-3xl">
                <div className="flex flex-col items-center gap-4">
                  <FaSpinner className="text-4xl text-emerald-600 animate-spin" />
                  <p className="text-[#034327] font-semibold animate-pulse">Loading profile data...</p>
                </div>
              </div>
            )}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 sm:p-6 border-b border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#034327] mb-1">
                        Profile Information
                      </h2>
                      <p className="text-emerald-700 text-sm">
                        Keep your personal details up to date
                      </p>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#034327] to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium text-sm"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information Section */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUser className="text-emerald-600" />
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FloatingInput
                          type="text"
                          name="firstName"
                          label="First Name"
                          value={form.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                        <FloatingInput
                          type="text"
                          name="lastName"
                          label="Last Name"
                          value={form.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                        <FloatingInput
                          type="tel"
                          name="phoneNumber"
                          label="Phone Number"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                        <FloatingInput
                          type="email"
                          name="email"
                          label="Email Address"
                          value={form.email}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </div>
                      <div className="relative mt-4">
                        <FloatingInput
                          type={showPassword ? "text" : "password"}
                          name="password"
                          label="Password"
                          value={
                            passwordChanged
                              ? form.password
                              : isEditing
                                ? ""
                                : form.password
                          }
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? "Enter new password" : ""}
                        />
                        {isEditing && (
                          <button
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#034327] transition duration-200"
                            type="button"
                            tabIndex={-1}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-emerald-600" />
                        Shipping Address
                      </h3>
                      <div className="space-y-4">
                        <FloatingInput
                          type="text"
                          name="street"
                          label="Street Address"
                          value={form.address?.street || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FloatingInput
                            type="text"
                            name="city"
                            label="City"
                            value={form.address?.city || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                          <FloatingInput
                            type="text"
                            name="state"
                            label="State/Province"
                            value={form.address?.state || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                          <FloatingInput
                            type="text"
                            name="zipCode"
                            label="ZIP/Postal Code"
                            value={form.address?.zipCode || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <FloatingInput
                          type="text"
                          name="country"
                          label="Country"
                          value={form.address?.country || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                          onClick={handleCancel}
                          type="button"
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-sm"
                          disabled={isSubmitting}
                        >
                          Cancel Changes
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#034327] text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Orders Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 sm:p-6 border-b border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#034327] mb-1">
                        My Orders
                      </h2>
                      <p className="text-emerald-700 text-sm">
                        {orders.length} order(s) found
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select className="px-3 py-2 border border-emerald-200 rounded-lg text-sm text-[#034327] bg-white focus:outline-none focus:border-emerald-400">
                        <option>All Orders</option>
                        <option>Delivered</option>
                        <option>Pending</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Orders Content */}
                <div className="p-4 sm:p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShoppingBag className="text-3xl text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-[#034327] mb-3">
                        No Orders Yet
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Looks like you haven't placed any orders yet. Start
                        shopping to see your orders here!
                      </p>
                      <button
                        onClick={() => navigate("/products")}
                        className="px-8 py-3 bg-gradient-to-r from-[#034327] to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          {/* Order Header */}
                          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">
                                    Order Placed
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {(() => {
                                      const dateVal = order.orderDate || order.createdAt || order.created_at;
                                      return dateVal ? new Date(dateVal).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }) : "N/A";
                                    })()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">
                                    Total
                                  </p>
                                  <p className="text-sm font-bold text-[#034327]">
                                    ₹{order.totalAmount ? Number(order.totalAmount).toFixed(2) : "0.00"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">
                                    Ship To
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                    {order.shippingAddress?.city || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : order.status === "shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : order.status === "confirmed"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {order.status
                                    ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                    : "Pending"}
                                </span>
                                <p className="text-xs text-gray-500">
                                  ORDER #
                                  {order.orderNumber || order.id?.toString().slice(-8)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Content */}
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Order Items */}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <FaShoppingBag className="text-emerald-600" />
                                  Items ({order.items?.length || 0})
                                </h4>
                                <div className="space-y-3">
                                  {order.items &&
                                    order.items
                                      .slice(0, 3)
                                      .map((item, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                        >
                                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <FaShoppingBag className="text-gray-400" />
                                          </div>
                                          <div className="flex-1">
                                            <h5 className="font-medium text-gray-900 text-sm">
                                              {item.name ||
                                                `Product ${index + 1}`}
                                            </h5>
                                            <p className="text-xs text-gray-500">
                                              Qty: {item.quantity} • ₹
                                              {(item.price || 0).toFixed(2)}{" "}
                                              each
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-[#034327]">
                                              ₹
                                              {(
                                                (item.price || 0) *
                                                (item.quantity || 1)
                                              ).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                  {order.items && order.items.length > 3 && (
                                    <div className="text-center py-2">
                                      <button className="text-emerald-600 text-sm font-medium hover:text-emerald-800">
                                        View {order.items.length - 3} more items
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Order Status & Actions */}
                              <div className="lg:w-80">
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaTruck className="text-emerald-600" />
                                    Delivery Status
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-3 h-3 rounded-full ${[
                                          "confirmed",
                                          "shipped",
                                          "delivered",
                                        ].includes(order.status)
                                          ? "bg-green-500"
                                          : "bg-gray-300"
                                          }`}
                                      ></div>
                                      <span className="text-sm text-gray-700">
                                        Order Confirmed
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-3 h-3 rounded-full ${["shipped", "delivered"].includes(
                                          order.status
                                        )
                                          ? "bg-green-500"
                                          : "bg-gray-300"
                                          }`}
                                      ></div>
                                      <span className="text-sm text-gray-700">
                                        Shipped
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-3 h-3 rounded-full ${order.status === "delivered"
                                          ? "bg-green-500"
                                          : "bg-gray-300"
                                          }`}
                                      ></div>
                                      <span className="text-sm text-gray-700">
                                        Delivered
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/order/${order.id}`
                                      )
                                    }
                                    className="w-full px-4 py-2 bg-[#034327] text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 font-medium text-sm"
                                  >
                                    View Order Details
                                  </button>
                                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-sm">
                                    Track Package
                                  </button>
                                  {order.status === "delivered" && (
                                    <button className="w-full px-4 py-2 border border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-300 font-medium text-sm">
                                      Write a Review
                                    </button>
                                  )}
                                  {order.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        handleCancelOrder(order.id)
                                      }
                                      className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 font-medium text-sm"
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Footer */}
                          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FaCreditCard className="text-emerald-600" />
                                  <span>
                                    Payment:{" "}
                                    {order.paymentStatus === "paid"
                                      ? "Completed"
                                      : "Pending"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaMapMarkerAlt className="text-emerald-600" />
                                  <span>
                                    Ship to:{" "}
                                    {order.shippingAddress?.state || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                Order placed on{" "}
                                {(() => {
                                  const dateVal = order.orderDate || order.createdAt || order.created_at;
                                  return dateVal ? new Date(dateVal).toLocaleDateString() : "N/A";
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Settings Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 sm:p-6 border-b border-emerald-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#034327] mb-1">
                      Account Settings
                    </h2>
                    <p className="text-emerald-700 text-sm">
                      Manage your account preferences and get support
                    </p>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Help & Support Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 sm:p-6 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <FaCog className="text-lg text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#034327] mb-1">
                            Help & Support
                          </h3>
                          <p className="text-emerald-600 font-medium text-sm">
                            We're here to help you
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-emerald-200">
                          <p className="text-gray-700 font-medium mb-1 text-sm">
                            Customer Service Hotline
                          </p>
                          <a
                            href="tel:1-800-123-4567"
                            className="text-emerald-600 hover:text-emerald-800 font-bold text-base transition-colors duration-200 flex items-center gap-2"
                          >
                            <FaCreditCard className="text-sm" />
                            1-800-123-4567
                          </a>
                          <p className="text-gray-500 text-xs mt-1">
                            Available 24/7 for premium members
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-200">
                          <p className="text-gray-700 font-medium mb-1 text-sm">
                            Email Support
                          </p>
                          <a
                            href="mailto:support@aeobiome.com"
                            className="text-emerald-600 hover:text-emerald-800 font-bold text-base transition-colors duration-200 flex items-center gap-2 break-all"
                          >
                            <FaMapMarkerAlt className="text-sm flex-shrink-0" />
                            support@aeobiome.com
                          </a>
                          <p className="text-gray-500 text-xs mt-1">
                            Response within 24 hours
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Management Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 sm:p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                          <FaUserCircle className="text-lg text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#034327] mb-1">
                            Account Management
                          </h3>
                          <p className="text-gray-600 font-medium text-sm">
                            Manage your account
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <h4 className="text-base font-bold text-[#034327] mb-2">
                            Premium Membership
                          </h4>
                          <p className="text-gray-600 mb-2 text-sm">
                            You're currently enjoying premium benefits including
                            priority support and exclusive offers.
                          </p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="text-sm" />
                            ))}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <h4 className="text-base font-bold text-[#034327] mb-2">
                            Privacy & Security
                          </h4>
                          <p className="text-gray-600 mb-2 text-sm">
                            Your data is protected with enterprise-grade
                            security. Read our privacy policy for more details.
                          </p>
                          <button className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors duration-200 text-sm">
                            View Privacy Policy →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-[#034327] mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <button className="flex items-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-300 border border-emerald-200 group">
                        <FaHistory className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[#034327] font-semibold text-sm">
                          Order History
                        </span>
                      </button>
                      <button className="flex items-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-300 border border-emerald-200 group">
                        <FaHeart className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[#034327] font-semibold text-sm">
                          Wishlist
                        </span>
                      </button>
                      <button className="flex items-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-300 border border-emerald-200 group sm:col-span-2 lg:col-span-1">
                        <FaTruck className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[#034327] font-semibold text-sm">
                          Track Orders
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
