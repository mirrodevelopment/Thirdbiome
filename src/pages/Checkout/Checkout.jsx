import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { showToast } from "../../utils/toast";
import { getCart, generateSessionId } from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { payuService } from "../../services/paymentService";
import { postToPayU } from "../../utils/payment";
import { logout } from "../../redux/slices/AuthSlice";
import couponService from "../../services/couponService";
import Logo from "../../assets/thirdbio.webp";
import { FiShoppingBag } from "react-icons/fi";

// Add smooth animations
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInUp {
    from { 
      opacity: 0;
      transform: translateY(50px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes slideDown {
    from { 
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
    to { 
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 1;
      max-height: 1000px;
      transform: translateY(0);
    }
    to { 
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

// Removed sampleCart as we're now using API data

const countryOptions = [
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
];
const stateOptions = [
  { value: "", label: "Select state" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "AR", label: "Arunachal Pradesh" },
  { value: "AS", label: "Assam" },
  { value: "BR", label: "Bihar" },
  { value: "CT", label: "Chhattisgarh" },
  { value: "GA", label: "Goa" },
  { value: "GJ", label: "Gujarat" },
  { value: "HR", label: "Haryana" },
  { value: "HP", label: "Himachal Pradesh" },
  { value: "JH", label: "Jharkhand" },
  { value: "KA", label: "Karnataka" },
  { value: "KL", label: "Kerala" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "MH", label: "Maharashtra" },
  { value: "MN", label: "Manipur" },
  { value: "ML", label: "Meghalaya" },
  { value: "MZ", label: "Mizoram" },
  { value: "NL", label: "Nagaland" },
  { value: "OR", label: "Odisha" },
  { value: "PB", label: "Punjab" },
  { value: "RJ", label: "Rajasthan" },
  { value: "SK", label: "Sikkim" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "TR", label: "Tripura" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "UT", label: "Uttarakhand" },
  { value: "WB", label: "West Bengal" },
  { value: "AN", label: "Andaman and Nicobar Islands" },
  { value: "CH", label: "Chandigarh" },
  { value: "DN", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "DL", label: "Delhi" },
  { value: "JK", label: "Jammu and Kashmir" },
  { value: "LA", label: "Ladakh" },
  { value: "LD", label: "Lakshadweep" },
  { value: "PY", label: "Puducherry" },
];

const shippingMethods = [
  {
    id: "ship1",
    label: "Free Shipping",
    price: 0.0,
    description: "Ships in 1 business day",
    recurring: true,
  },
];

const paymentMethods = [
  {
    id: "payu",
    label: "PayU (UPI, Cards, NetBanking, Wallets)",
    description:
      "After clicking 'Pay now', you will be redirected to PayU to complete your purchase securely.",
    icons: ["UPI", "VISA", "Mastercard", "NetBanking"],
  },
];

const CHECKOUT_FORM_KEY = "aeobiome_checkout_form";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const [discount, setDiscount] = useState("");
  const [email, setEmail] = useState("");
  const [news, setNews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [delivery, setDelivery] = useState({
    country: "US",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "AL",
    zip: "",
    phone: "",
  });
  const [shipping, setShipping] = useState("ship1");
  const [payment, setPayment] = useState("payu");

  const [billing, setBilling] = useState({
    country: "US",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "AL",
    zip: "",
    phone: "",
  });
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(CHECKOUT_FORM_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.delivery) setDelivery(parsed.delivery);
        if (typeof parsed.news === "boolean") setNews(parsed.news);
      } catch (error) {
        // If parsing fails, just continue without saved data
      }
    }
  }, []);

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCart = async () => {
      // Ensure session ID exists for guest users
      if (!localStorage.getItem("sessionId")) {
        await generateSessionId();
      }
      await getCart();
    };

    fetchCart();
  }, []);

  // Totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee =
    shippingMethods.find((m) => m.id === shipping)?.price || 0;
  const tax = 0; // No tax
  const total = subtotal + shippingFee + tax - discountAmount;

  // Coupon handler
  const handleApplyCoupon = async () => {
    if (!discount.trim()) {
      setCouponError("Please enter a discount code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await couponService.validateCoupon(discount.trim(), subtotal);
      if (res.success && res.data) {
        const coupon = res.data;
        let calcDiscount = 0;
        if (coupon.discountType === "percentage") {
          calcDiscount = (subtotal * parseFloat(coupon.discountValue)) / 100;
          if (coupon.maxDiscount && calcDiscount > parseFloat(coupon.maxDiscount)) {
            calcDiscount = parseFloat(coupon.maxDiscount);
          }
        } else {
          calcDiscount = parseFloat(coupon.discountValue);
        }
        if (calcDiscount > subtotal) calcDiscount = subtotal;
        setDiscountAmount(calcDiscount);
        setAppliedCoupon(coupon);
        setCouponError("");
        showToast.success(res.message || "Coupon applied successfully!");
      }
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message || "Invalid coupon code";
      setCouponError(msg);
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setDiscount("");
    setCouponError("");
    showToast.success("Coupon removed");
  };

  // Handlers
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
  };
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  // Show loading state
  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading checkout...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg text-gray-600 mb-4">Your cart is empty</div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Save form data before navigating to login
  const handleLoginClick = (e) => {
    sessionStorage.setItem(
      CHECKOUT_FORM_KEY,
      JSON.stringify({ email, delivery, news })
    );
    navigate("/user/login?redirect=/checkout");
    e.preventDefault();
  };

  return (
    <div className=" bg-white">
      {/* Mini header with logo and cart icon */}
      <div className="flex items-center justify-between px-4 py-4 lg:justify-center lg:gap-[55vw] xl:gap-[42vw] lg:px-0 lg:py-8 border-b border-gray-200 ">
        <Link to="/">
          <img src={Logo} alt="ThirdBio Logo" className="h-8 w-auto" />
        </Link>
        <Link
          to="/cart"
          className="relative p-2 transition-colors duration-200"
          style={{ color: "#134E4A" }}
        >
          {/* Import FiShoppingBag at the top: import { FiShoppingBag } from "react-icons/fi"; */}
          <FiShoppingBag className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-[#134E4A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
            {cart.length}
          </span>
        </Link>
      </div>
      <div
        className="flex justify-between px-4 py-6 bg-[#F5F5F5] lg:hidden"
        onClick={() => setShowOrderSummary(!showOrderSummary)}
      >
        <button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="flex items-center font-semibold gap-1 text-[#134E4A] hover:text-[#0f3a38] transition-colors cursor-pointer"
        >
          Order Summary
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 inline-block transition-transform duration-300 ease-in-out ${showOrderSummary ? "rotate-180" : ""
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <p className="text-xl font-semibold"> ₹{total.toFixed(2)}</p>
      </div>
      <div
        className={`space-y-7 px-4 py-6 bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${showOrderSummary
          ? "max-h-[2000px] opacity-100 transform translate-y-0"
          : "max-h-0 opacity-0 transform -translate-y-2"
          }`}
        style={{
          animation: showOrderSummary
            ? "slideDown 0.3s ease-out"
            : "slideUp 0.3s ease-out",
        }}
      >
        {/* Cart Items */}
        {cart.map((item) => (
          <div key={item.variantId} className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/imageTest.webp";
              }}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.name}</div>
              <div className="text-xs text-gray-500">
                Quantity: {item.quantity}
              </div>
            </div>
            <div className="font-medium text-gray-900">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
        {/* Discount code */}
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-green-700 font-medium text-sm">🎉 {appliedCoupon.code}</span>
              <span className="text-green-600 text-xs">(-₹{discountAmount.toFixed(2)})</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code or gift card"
                value={discount}
                onChange={(e) => { setDiscount(e.target.value); setCouponError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none ${couponError ? 'border-red-400' : 'border-gray-300'}`}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
          </div>
        )}
        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal · {cart.length} items</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedCoupon?.code})</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>
        <div className="flex justify-between items-center border-t pt-4 mt-2">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-2xl text-gray-900">
            ₹{total.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          This order has a recurring charge for multiple items.
        </div>
      </div>
      <div className=" ">
        <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 ">
          {/* Left: Forms */}
          <div className="px-4 lg:pl-[20%] xl:pl-[45%] p-4 lg:p-6">
            {/* Account/Email Section */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="text-xl font-extrabold text-gray-900">
                  Contact
                </span>
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="text-xs text-[#134a4e] underline ml-2"
                    onClick={() => dispatch(logout())}
                  >
                    Log out
                  </button>
                ) : (
                  <a
                    href="/user/login?redirect=/checkout"
                    className="text-xs text-[#134a4e] underline ml-2"
                    onClick={handleLoginClick}
                  >
                    Log in
                  </a>
                )}
              </label>
              {isAuthenticated ? (
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={user?.email || ""}
                  disabled
                />
              ) : (
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
              <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                <span className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={news}
                    onChange={() => setNews(!news)}
                    className="peer appearance-none w-4 h-4 border-1 border-[#134E4A] rounded-xs bg-white checked:bg-[#134E4A] transition-colors duration-200 outline-none "
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 transition-transform duration-200 scale-75 opacity-0 peer-checked:opacity-100 peer-checked:scale-100 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 10 18 4 12" />
                  </svg>
                </span>
                <span className="text-sm font-medium">
                  Email me with news and offers
                </span>
              </label>
            </div>

            {/* Delivery Address Form */}
            <div className="space-y-4 mt-4">
              <h3 className="text-xl font-extrabold text-gray-900">Delivery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Country/Region
                  </label>
                  <select
                    name="country"
                    value={delivery.country || "IN"}
                    onChange={handleDeliveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                  >
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    First name
                  </label>
                  <input
                    name="firstName"
                    value={delivery.firstName}
                    onChange={handleDeliveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    value={delivery.lastName}
                    onChange={handleDeliveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Company (optional)
                </label>
                <input
                  name="company"
                  value={delivery.company}
                  onChange={handleDeliveryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={delivery.address}
                  onChange={handleDeliveryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  name="apartment"
                  value={delivery.apartment}
                  onChange={handleDeliveryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    value={delivery.city}
                    onChange={handleDeliveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    State
                  </label>
                  <select
                    name="state"
                    value={delivery.state}
                    onChange={handleDeliveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {stateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ZIP code
                  </label>
                  <input
                    name="zip"
                    value={delivery.zip}
                    onChange={handleDeliveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone (optional)
                </label>
                <input
                  name="phone"
                  value={delivery.phone}
                  onChange={handleDeliveryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                />
              </div>
              <label className="flex items-center gap-2 mt-2">
                <span className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={() => setSaveInfo(!saveInfo)}
                    className="peer appearance-none w-4 h-4 border-1 border-[#134E4A] rounded-xs bg-white checked:bg-[#134E4A] transition-colors duration-200 outline-none"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 transition-transform duration-200 scale-75 opacity-0 peer-checked:opacity-100 peer-checked:scale-100 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 10 18 4 12" />
                  </svg>
                </span>
                <span className="text-sm text-gray-700">
                  Save my information for a faster checkout
                </span>
              </label>
            </div>

            {/* Shipping Method */}
            <div className="space-y-2 mt-7">
              <h3 className="text-xl font-extrabold text-gray-900">
                Shipping method
              </h3>
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 mb-2 cursor-pointer"
                >
                  <span className="relative flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={shipping === method.id}
                      onChange={() => setShipping(method.id)}
                      className="peer appearance-none w-4 h-4 border-1 border-[#134E4A] rounded-full bg-white checked:bg-[#134E4A] transition-colors duration-200 outline-none"
                    />
                    <svg
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 transition-transform duration-200 scale-75 opacity-0 peer-checked:opacity-100 peer-checked:scale-100 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="6" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="flex-1">
                    <span className="font-medium text-gray-900">
                      {method.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {method.description}
                    </span>
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{method.price.toFixed(2)}
                  </span>
                </label>
              ))}
              <div className="text-xs text-gray-500 ml-1">
                Free Shipping · No additional charges
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 mt-7">
              <h3 className="text-xl font-extrabold text-gray-900">Payment</h3>
              <p className="text-sm text-gray-600">
                All transactions are secure and encrypted.
              </p>

              <div className="border border-green-500 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center mt-1">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <span className="font-medium text-gray-900">
                        PayU (UPI, Cards, NetBanking, Wallets)
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* UPI Logo */}
                        <div className="w-8 h-5 rounded flex items-center justify-center">
                          <svg
                            width="20"
                            height="12"
                            viewBox="0 0 20 12"
                            fill="none"
                          >
                            <rect
                              width="20"
                              height="12"
                              rx="2"
                              fill="#6C5CE7"
                            />
                            <text
                              x="10"
                              y="8"
                              textAnchor="middle"
                              fill="white"
                              fontSize="6"
                              fontWeight="bold"
                            >
                              UPI
                            </text>
                          </svg>
                        </div>
                        {/* VISA Logo */}
                        <div className="w-8 h-5  rounded flex items-center justify-center">
                          <svg
                            width="24"
                            height="8"
                            viewBox="0 0 24 8"
                            fill="none"
                          >
                            <rect width="24" height="8" rx="1" fill="#1A1F71" />
                            <text
                              x="12"
                              y="6"
                              textAnchor="middle"
                              fill="white"
                              fontSize="5"
                              fontWeight="bold"
                            >
                              VISA
                            </text>
                          </svg>
                        </div>
                        {/* Mastercard Logo */}
                        <div className="w-8 h-5  rounded flex items-center justify-center">
                          <svg
                            width="20"
                            height="12"
                            viewBox="0 0 20 12"
                            fill="none"
                          >
                            <circle cx="7" cy="6" r="4" fill="#EB001B" />
                            <circle cx="13" cy="6" r="4" fill="#F79E1B" />
                            <path
                              d="M7 2C8.5 4 8.5 8 7 10C8.5 8 8.5 4 7 2Z"
                              fill="#FF5F00"
                            />
                          </svg>
                        </div>
                        {/* NetBanking Logo */}
                        <div className="w-8 h-5 rounded flex items-center justify-center">
                          <svg
                            width="20"
                            height="12"
                            viewBox="0 0 20 12"
                            fill="none"
                          >
                            <rect
                              width="20"
                              height="12"
                              rx="2"
                              fill="#2563EB"
                            />
                            <text
                              x="10"
                              y="8"
                              textAnchor="middle"
                              fill="white"
                              fontSize="4"
                              fontWeight="bold"
                            >
                              NET
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-4 bg-gray-200 rounded border border-gray-300 flex items-center justify-start px-1">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1 h-3 bg-gray-200 rounded"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                        <div className="w-4 h-4 text-gray-400">→</div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        After clicking 'Pay now', you will be redirected to PayU
                        to complete your purchase securely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4 mt-7">
              <label className="flex items-center gap-2">
                <span className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={useShippingAsBilling}
                    onChange={() =>
                      setUseShippingAsBilling(!useShippingAsBilling)
                    }
                    className="peer appearance-none w-4 h-4 border-1 border-[#134E4A] rounded-xs bg-white checked:bg-[#134E4A] transition-colors duration-200 outline-none"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 transition-transform duration-200 scale-75 opacity-0 peer-checked:opacity-100 peer-checked:scale-100 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 10 18 4 12" />
                  </svg>
                </span>
                <span className="text-sm text-gray-700">
                  Use shipping address as billing address
                </span>
              </label>
              {!useShippingAsBilling && (
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Billing address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Country/Region
                      </label>
                      <select
                        name="country"
                        value={billing.country}
                        onChange={handleBillingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                      >
                        {countryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        First name
                      </label>
                      <input
                        name="firstName"
                        value={billing.firstName}
                        onChange={handleBillingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Last name
                      </label>
                      <input
                        name="lastName"
                        value={billing.lastName}
                        onChange={handleBillingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Company (optional)
                    </label>
                    <input
                      name="company"
                      value={billing.company}
                      onChange={handleBillingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      name="address"
                      value={billing.address}
                      onChange={handleBillingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      name="apartment"
                      value={billing.apartment}
                      onChange={handleBillingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        name="city"
                        value={billing.city}
                        onChange={handleBillingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        State
                      </label>
                      <select
                        name="state"
                        value={billing.state}
                        onChange={handleBillingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                      >
                        {stateOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        ZIP code
                      </label>
                      <input
                        name="zip"
                        value={billing.zip}
                        onChange={handleBillingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Phone (optional)
                    </label>
                    <input
                      name="phone"
                      value={billing.phone}
                      onChange={handleBillingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-2 focus:border-[#134E4A]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pay Now Button and Legal Text */}
            <div className="pt-4">
              <button
                onClick={async () => {
                  try {
                    setIsSubmitting(true);

                    // Validate required fields
                    const currentEmail = isAuthenticated ? user?.email : email;

                    if (
                      !delivery.firstName ||
                      !delivery.lastName ||
                      !delivery.address ||
                      !delivery.city ||
                      !delivery.state ||
                      !delivery.zip ||
                      !currentEmail
                    ) {
                      const missingFields = [];
                      if (!delivery.firstName) missingFields.push("First Name");
                      if (!delivery.lastName) missingFields.push("Last Name");
                      if (!delivery.address) missingFields.push("Street Address");
                      if (!delivery.city) missingFields.push("City");
                      if (!delivery.state) missingFields.push("State/Region");
                      if (!delivery.zip) missingFields.push("ZIP/Postal Code");
                      if (!delivery.phone) missingFields.push("Phone Number");
                      if (!currentEmail) missingFields.push("Email Address");

                      if (missingFields.length > 0) {
                        showToast.error(
                          `Please fill in: ${missingFields.join(", ")}`
                        );
                        return;
                      }
                    }

                    const orderData = {
                      customerId: isAuthenticated ? user?.id : null,
                      customerName: `${delivery.firstName} ${delivery.lastName}`,
                      customerEmail: currentEmail,
                      customerPhone: delivery.phone || "",
                      items: cart.map(item => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                      })),
                      totalAmount: total,
                      couponCode: appliedCoupon?.code || null,
                      discountAmount: discountAmount || 0,
                      paymentMethod: "payu",
                      shippingAddress: {
                        firstName: delivery.firstName,
                        lastName: delivery.lastName,
                        email: currentEmail,
                        phone: delivery.phone || "",
                        street: delivery.address,
                        city: delivery.city,
                        state: delivery.state,
                        zipCode: delivery.zip,
                        country: delivery.country,
                      },
                    };

                    const response = await createOrder(orderData);
                    try {
                      const createdOrderId =
                        response.data?.orderId ||
                        response.data?.data?.orderId ||
                        response.data?.id ||
                        response.data?.data?._id ||
                        response.data?.order?._id;
                      const createdOrderNumber =
                        response.data?.orderNumber ||
                        response.data?.data?.orderNumber ||
                        response.data?.order?.orderNumber;
                      if (createdOrderId)
                        sessionStorage.setItem(
                          "lastOrderId",
                          String(createdOrderId)
                        );
                      if (createdOrderNumber)
                        sessionStorage.setItem(
                          "lastOrderNumber",
                          String(createdOrderNumber)
                        );
                    } catch { }

                    // Initialize payment and submit to PayU
                    {
                      const orderId =
                        response.data?.orderId ||
                        response.data?.id ||
                        response.data?.order?._id;
                      if (!orderId) {
                        throw new Error("Order ID missing for PayU initiation");
                      }
                      const initRes = await payuService.initPayment(orderId);
                      const payuUrl = initRes?.data?.payuUrl;
                      const params = initRes?.data?.params;
                      if (!payuUrl || !params) {
                        throw new Error("Invalid PayU init response");
                      }

                      // Payment validation

                      const required = [
                        "key",
                        "txnid",
                        "amount",
                        "productinfo",
                        "firstname",
                        "email",
                        "udf1",
                        "surl",
                        "furl",
                        "hash",
                      ];
                      const missing = required.filter((k) => !params?.[k]);
                      if (missing.length) {
                        return;
                      }
                      if (!/^\d+(\.\d{2})$/.test(String(params.amount))) {
                        return;
                      }
                      const isAbs = (u) =>
                        typeof u === "string" && /^https?:\/\//i.test(u);
                      if (!isAbs(params.surl) || !isAbs(params.furl)) {
                        return;
                      }

                      postToPayU(payuUrl, params);
                      return;
                    }
                  } catch (err) {
                    showToast.error(
                      err.response?.data?.message || err.message || "Failed to place order"
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#64796c] text-white rounded-lg font-semibold text-lg hover:bg-[#134a4e] transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed duration-300 cursor-pointer"
              >
                {isSubmitting ? "Processing..." : "Pay Now with PayU"}
              </button>
              <div className="text-sm text-gray-500 mb-2 mt-4">
                One or more items in your cart is a deferred or recurring
                purchase. By continuing with your payment, you agree that your
                payment method will automatically be charged at the price and
                frequency listed on this page until it ends or you cancel. All
                cancellations are subject to the{" "}
                <a href="#" className="underline text-[#134a4e] font-medium">
                  cancellation policy
                </a>
                .
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-400 mt-4">
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="underline hover:text-gray-600 transition-colors text-[#134a4e] font-medium"
                >
                  Refund policy
                </button>
                <button
                  onClick={() => setShowShippingModal(true)}
                  className="underline hover:text-gray-600 transition-colors text-[#134a4e] font-medium"
                >
                  Shipping policy
                </button>

                <button
                  onClick={() => setShowCancellationModal(true)}
                  className="underline hover:text-gray-600 transition-colors text-[#134a4e] font-medium"
                >
                  Cancellation policy
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="underline hover:text-gray-600 transition-colors text-[#134a4e] font-medium"
                >
                  Contact information
                </button>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-[#F5F5F5] border border-gray-200 p-4 lg:p-6 px-4 lg:pr-[20%] xl:pr-[45%]">
            <div className="space-y-7">
              {/* Cart Items */}
              {cart.map((item) => (
                <div key={item.variantId} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/imageTest.webp";
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              {/* Discount code */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-medium text-sm">🎉 {appliedCoupon.code}</span>
                    <span className="text-green-600 text-xs">(-₹{discountAmount.toFixed(2)})</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code or gift card"
                      value={discount}
                      onChange={(e) => { setDiscount(e.target.value); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none ${couponError ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                </div>
              )}
              {/* Totals */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal · {cart.length} items</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t pt-4 mt-2">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl text-gray-900">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                This order has a recurring charge for multiple items.
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Refund Policy Modal */}
      {showRefundModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out"
          onClick={() => setShowRefundModal(false)}
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-200 ease-out mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "slideInUp 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 ">
              <div>
                <h2 className="text-xl font-black text-black">Refund policy</h2>
              </div>
              <button
                onClick={() => setShowRefundModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-600 text-lg">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 text-sm text-gray-700 leading-relaxed">
              <div>
                <p className="mb-4">
                  Third Biome does not issue refunds unless under the following
                  conditions:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>The product ordered is out of stock or unavailable.</li>
                  <li>The delivery address is non-serviceable.</li>
                  <li>You were charged twice for the same order.</li>
                  <li>
                    You comply fully with the return policy, and the product is
                    verified to be in good, untampered condition.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">
                  Refunds will not be processed if:
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>The product is returned used, damaged, or altered.</li>
                  <li>The shipping address provided was incorrect.</li>
                  <li>
                    You've consumed part of the product before requesting a
                    return.
                  </li>
                  <li>You do not comply with the conditions above.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">Return Pickup</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>
                    For eligible pin codes, we will initiate a reverse pickup
                    within 1-2 days of return approval.
                  </li>
                  <li>
                    If your location is not serviceable by our courier, you will
                    be asked to self-ship the product. We will reimburse the
                    courier charges upon submission of a valid receipt.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">Refund Timelines</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    For online payments, refunds will be processed to the
                    original source within 7 working days of approval.
                  </li>
                  <li>
                    For COD orders, refunds will be processed to your bank
                    account within 14 working days of request verification.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Shipping Policy Modal */}
      {showShippingModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out"
          onClick={() => setShowShippingModal(false)}
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-200 ease-out mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "slideInUp 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-xl font-black text-black">
                  Shipping policy
                </h2>
              </div>
              <button
                onClick={() => setShowShippingModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-600 text-lg">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 text-sm text-gray-700 leading-relaxed">
              <div>
                <p className="mb-4">
                  At Third Biome, we are committed to delivering precision
                  wellness products safely and on time.
                </p>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">
                  Shipping Timeline:
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>
                    Orders are processed within 24-48 hours after confirmation.
                  </li>
                  <li>
                    Orders are typically delivered within 7-10 business days
                    from the date of dispatch.
                  </li>
                  <li>
                    You will receive a tracking link via SMS/email once your
                    order is shipped.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">
                  Shipping Charges:
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    We offer free shipping on all prepaid orders across India.
                  </li>
                  <li>
                    COD (if enabled) may incur additional charges, which will be
                    reflected at checkout.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cancellation Policy Modal */}
      {showCancellationModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out"
          onClick={() => setShowCancellationModal(false)}
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-200 ease-out mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "slideInUp 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-xl font-black text-black">
                  Cancellation policy
                </h2>
              </div>
              <button
                onClick={() => setShowCancellationModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-600 text-lg">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 text-sm text-gray-700 leading-relaxed">
              <div>
                <p className="mb-4">
                  You may cancel your order only if it has not been shipped.
                </p>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">
                  Cancellation Process:
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>
                    To cancel an order, please write to our customer support at{" "}
                    <a
                      href="mailto:support@thirdbiome.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@thirdbiome.com
                    </a>{" "}
                    with your order ID and reason.
                  </li>
                  <li>
                    If the order is eligible for cancellation, the refund (if
                    any) will be processed within 7 business days of
                    confirmation.
                  </li>
                  <li>Once shipped, orders cannot be cancelled.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Contact Information Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out"
          onClick={() => setShowContactModal(false)}
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-200 ease-out mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "slideInUp 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-xl font-black text-black">Contact Us</h2>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-600 text-lg">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 text-sm text-gray-700 leading-relaxed">
              <div>
                <p className="mb-4">For any questions or support:</p>
              </div>

              <div>
                <h3 className="font-black text-black mb-3">Contact Details:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@thirdbiome.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@thirdbiome.com
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> +91-XXXXXXXXXX (Mon-Fri, 10 AM - 6
                    PM IST)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
