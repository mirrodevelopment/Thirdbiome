/* Third Biome v5, Checkout.
   Straight functional port of src/pages/Checkout/Checkout.jsx (the working
   production checkout) into the v5 design language. The order/payment flow is
   byte-identical: Redux cart → createOrder payload → payuService.initPayment
   → postToPayU redirect. Only the presentation layer changed. */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Arr } from "../components/ui";
import Seo from "../components/Seo";
import { track, PIXEL_PRODUCT } from "../lib/analytics";
import { showToast } from "../../utils/toast";
import { getCart, generateSessionId } from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { payuService } from "../../services/paymentService";
import { postToPayU } from "../../utils/payment";
import { logout } from "../../redux/slices/AuthSlice";
import couponService from "../../services/couponService";
import { inr, FREE_SHIP_THRESHOLD } from "../data/content";

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

/* Same key as production so a saved form survives across old/new checkout */
const CHECKOUT_FORM_KEY = "aeobiome_checkout_form";

const IMG_FALLBACK = "/src/assets/imageTest.webp";

function PolicyModal({ title, onClose, children }) {
  return (
    <div className="v5-cmodal" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="v5-cmodal__card" onClick={(e) => e.stopPropagation()}>
        <div className="v5-cmodal__head">
          <h3>{title}</h3>
          <button type="button" className="v5-cmodal__x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="v5-cmodal__body">{children}</div>
      </div>
    </div>
  );
}

export default function Checkout() {
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
    country: "IN",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [shipping, setShipping] = useState("ship1");
  const [billing, setBilling] = useState({
    country: "IN",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [saveInfo, setSaveInfo] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  /* red-border class for a required field that failed validation */
  const err = (name, base = "v5-input") => `${base}${fieldErrors[name] ? " v5-input--err" : ""}`;
  /* fire-once guards for analytics + carried coupon */
  const firedInitiateCheckout = useRef(false);
  const couponCarried = useRef(false);

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(CHECKOUT_FORM_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.delivery) setDelivery(parsed.delivery);
        if (typeof parsed.news === "boolean") setNews(parsed.news);
      } catch {
        // If parsing fails, just continue without saved data
      }
    }
  }, []);

  // Fetch cart data on component mount (ensure a guest session id exists)
  useEffect(() => {
    const fetchCart = async () => {
      if (!localStorage.getItem("sessionId")) {
        await generateSessionId();
      }
      await getCart();
    };
    fetchCart();
  }, []);

  // Totals, identical math to production
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee =
    shippingMethods.find((m) => m.id === shipping)?.price || 0;
  const tax = 0; // No tax
  const total = subtotal + shippingFee + tax - discountAmount;

  // Fire InitiateCheckout once, on mount, when the cart is non-empty
  useEffect(() => {
    if (firedInitiateCheckout.current) return;
    if (cart.length === 0) return;
    firedInitiateCheckout.current = true;
    track("InitiateCheckout", {
      ...PIXEL_PRODUCT,
      value: total,
      currency: "INR",
      num_items: cart.length,
    });
  }, [cart.length, total]);

  // Carry a coupon applied on the cart into checkout, prefill + auto-apply once
  // the cart (and thus subtotal) has loaded so the discount math is correct.
  useEffect(() => {
    if (couponCarried.current) return;
    if (subtotal <= 0 || appliedCoupon) return;
    const pending = sessionStorage.getItem("t3b_pending_coupon");
    if (pending) {
      couponCarried.current = true;
      setDiscount(pending);
      handleApplyCoupon(pending);
    }
  }, [subtotal, appliedCoupon]);

  // Coupon handlers
  const handleApplyCoupon = async (codeArg) => {
    /* codeArg is a string only when called programmatically (carried coupon);
       the onClick handler passes an event, which falls back to the input state. */
    const code = (typeof codeArg === "string" ? codeArg : discount).trim();
    if (!code) {
      setCouponError("Please enter a discount code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await couponService.validateCoupon(code, subtotal);
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

  // Field handlers
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: false } : prev));
  };
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  // Save form data before navigating to login
  const handleLoginClick = (e) => {
    sessionStorage.setItem(
      CHECKOUT_FORM_KEY,
      JSON.stringify({ email, delivery, news })
    );
    navigate("/account");
    e.preventDefault();
  };

  // Place order + PayU redirect, identical logic to production
  const handlePayNow = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields (phone is mandatory; failures mark fields red)
      const currentEmail = isAuthenticated ? user?.email : email;

      const missing = [
        [!delivery.firstName?.trim(), "firstName", "First Name"],
        [!delivery.lastName?.trim(), "lastName", "Last Name"],
        [!delivery.address?.trim(), "address", "Street Address"],
        [!delivery.city?.trim(), "city", "City"],
        [!delivery.state, "state", "State/Region"],
        [!delivery.zip?.trim(), "zip", "ZIP/Postal Code"],
        [!/^\d{10}$/.test((delivery.phone || "").replace(/\D/g, "")), "phone", "Phone Number (10 digits)"],
        [!currentEmail?.trim(), "email", "Email Address"],
      ].filter(([bad]) => bad);

      if (missing.length > 0) {
        setFieldErrors(Object.fromEntries(missing.map(([, key]) => [key, true])));
        showToast.error(`Please fill in: ${missing.map(([, , label]) => label).join(", ")}`);
        setTimeout(() => {
          document.querySelector(".v5-input--err")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 60);
        return;
      }
      setFieldErrors({});

      const orderData = {
        customerId: isAuthenticated ? user?.id : null,
        customerName: `${delivery.firstName} ${delivery.lastName}`,
        customerEmail: currentEmail,
        customerPhone: delivery.phone || "",
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
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
          sessionStorage.setItem("lastOrderId", String(createdOrderId));
        if (createdOrderNumber)
          sessionStorage.setItem("lastOrderNumber", String(createdOrderNumber));
      } catch { /* non-fatal */ }

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
          showToast.error("Payment couldn't start. Please retry or contact support.");
          return;
        }
        if (!/^\d+(\.\d{2})$/.test(String(params.amount))) {
          showToast.error("Payment couldn't start. Please retry or contact support.");
          return;
        }
        const isAbs = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
        if (!isAbs(params.surl) || !isAbs(params.furl)) {
          showToast.error("Payment couldn't start. Please retry or contact support.");
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
  };

  // Loading state
  if (loading && cart.length === 0) {
    return (
      <section className="sheet sheet--pad v5-page" data-screen-label="Checkout">
        <div className="wrap">
          <div className="v5-cart-empty">
            <p style={{ color: "var(--ink-soft)", fontSize: "1.05rem" }}>Loading checkout...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="sheet sheet--pad v5-page" data-screen-label="Checkout">
        <div className="wrap">
          <div className="v5-cart-empty">
            <p style={{ color: "#b3261e", fontSize: "1.05rem" }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <section className="sheet sheet--pad v5-page" data-screen-label="Checkout">
        <div className="wrap">
          <div className="v5-cart-empty">
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.1rem)", marginBottom: "10px" }}>Your cart’s as empty as it gets.</h2>
            <button className="btn btn--dark" onClick={() => navigate("/")} style={{ marginTop: "14px" }}>
              Continue Shopping <Arr />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        title="Checkout"
        description="Secure checkout for Biome Balance. Pay by UPI, cards, netbanking or wallets. Free shipping across India."
      />
      <section className="sheet v5-page" data-screen-label="Checkout">
        <div className="wrap">
          <span className="eyebrow">Secure checkout</span>
          <h1>Checkout</h1>
          <p>All transactions are secure and encrypted.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Checkout form & summary">
        <div className="wrap">
          <div className="v5-2col v5-2col--wideL">
            {/* Left: forms */}
            <div className="v5-formcard">
              {/* Contact */}
              <div className="v5-cohead">
                <h2>Contact</h2>
                {isAuthenticated ? (
                  <button type="button" className="v5-colink" onClick={() => dispatch(logout())}>
                    Log out
                  </button>
                ) : (
                  <a
                    href="/account"
                    className="v5-colink"
                    onClick={handleLoginClick}
                  >
                    Log in
                  </a>
                )}
              </div>
              <div className="v5-field">
                <label htmlFor="co-email">Email</label>
                {isAuthenticated ? (
                  <input
                    id="co-email"
                    type="email"
                    className="v5-input"
                    value={user?.email || ""}
                    disabled
                  />
                ) : (
                  <input
                    id="co-email"
                    type="email"
                    className={err("email")}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => (prev.email ? { ...prev, email: false } : prev)); }}
                  />
                )}
              </div>
              <label className="v5-checkline">
                <input type="checkbox" checked={news} onChange={() => setNews(!news)} />
                <span>Email me with news and offers</span>
              </label>

              {/* Delivery */}
              <div className="v5-cohead"><h2>Delivery</h2></div>
              <div className="v5-field">
                <label htmlFor="co-country">Country/Region</label>
                <select
                  id="co-country"
                  name="country"
                  className="v5-select"
                  value={delivery.country || "IN"}
                  onChange={handleDeliveryChange}
                >
                  <option value="IN">India</option>
                </select>
              </div>
              <div className="v5-co2">
                <div className="v5-field">
                  <label htmlFor="co-first">First name</label>
                  <input id="co-first" name="firstName" className={err("firstName")} value={delivery.firstName} onChange={handleDeliveryChange} />
                </div>
                <div className="v5-field">
                  <label htmlFor="co-last">Last name</label>
                  <input id="co-last" name="lastName" className={err("lastName")} value={delivery.lastName} onChange={handleDeliveryChange} />
                </div>
              </div>
              <div className="v5-field">
                <label htmlFor="co-company">Company (optional)</label>
                <input id="co-company" name="company" className="v5-input" value={delivery.company} onChange={handleDeliveryChange} />
              </div>
              <div className="v5-field">
                <label htmlFor="co-address">Address</label>
                <input id="co-address" name="address" className={err("address")} value={delivery.address} onChange={handleDeliveryChange} />
              </div>
              <div className="v5-field">
                <label htmlFor="co-apartment">Apartment, suite, etc. (optional)</label>
                <input id="co-apartment" name="apartment" className="v5-input" value={delivery.apartment} onChange={handleDeliveryChange} />
              </div>
              <div className="v5-co3">
                <div className="v5-field">
                  <label htmlFor="co-city">City</label>
                  <input id="co-city" name="city" className={err("city")} value={delivery.city} onChange={handleDeliveryChange} />
                </div>
                <div className="v5-field">
                  <label htmlFor="co-state">State</label>
                  <select id="co-state" name="state" className={err("state", "v5-select")} value={delivery.state} onChange={handleDeliveryChange}>
                    <option value="" disabled>Select state</option>
                    {stateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="v5-field">
                  <label htmlFor="co-zip">ZIP code</label>
                  <input id="co-zip" name="zip" className={err("zip")} value={delivery.zip} onChange={handleDeliveryChange} />
                </div>
              </div>
              <div className="v5-field">
                <label htmlFor="co-phone">Phone</label>
                <input id="co-phone" name="phone" className={err("phone")} value={delivery.phone} onChange={handleDeliveryChange} />
              </div>
              <label className="v5-checkline">
                <input type="checkbox" checked={saveInfo} onChange={() => setSaveInfo(!saveInfo)} />
                <span>Save my information for a faster checkout</span>
              </label>

              {/* Shipping method */}
              <div className="v5-cohead"><h2>Shipping method</h2></div>
              {shippingMethods.map((method) => (
                <label key={method.id} className="v5-payline">
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shipping === method.id}
                    onChange={() => setShipping(method.id)}
                  />
                  <span className="v5-payline__txt">
                    <b>{method.label}</b>
                    <span>{method.description}</span>
                  </span>
                  <span className="v5-payline__price">{method.price === 0 ? "Free" : inr(method.price)}</span>
                </label>
              ))}
              <p className="v5-conote">Free Shipping · No additional charges</p>

              {/* Payment */}
              <div className="v5-cohead"><h2>Payment</h2></div>
              <p className="v5-conote" style={{ marginTop: 0 }}>All transactions are secure and encrypted.</p>
              <div className="v5-payline v5-payline--on">
                <input type="radio" name="payment" value="payu" checked readOnly />
                <span className="v5-payline__txt">
                  <b>PayU (UPI, Cards, NetBanking, Wallets)</b>
                  <span>After clicking 'Pay now', you will be redirected to PayU to complete your purchase securely.</span>
                </span>
                <span className="v5-payline__brands" aria-hidden="true">
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><rect width="20" height="12" rx="2" fill="#6C5CE7" /><text x="10" y="8" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">UPI</text></svg>
                  <svg width="24" height="8" viewBox="0 0 24 8" fill="none"><rect width="24" height="8" rx="1" fill="#1A1F71" /><text x="12" y="6" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">VISA</text></svg>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><circle cx="7" cy="6" r="4" fill="#EB001B" /><circle cx="13" cy="6" r="4" fill="#F79E1B" /><path d="M7 2C8.5 4 8.5 8 7 10C8.5 8 8.5 4 7 2Z" fill="#FF5F00" /></svg>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><rect width="20" height="12" rx="2" fill="#2563EB" /><text x="10" y="8" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">NET</text></svg>
                </span>
              </div>

              {/* Billing address */}
              <label className="v5-checkline" style={{ marginTop: "18px" }}>
                <input
                  type="checkbox"
                  checked={useShippingAsBilling}
                  onChange={() => setUseShippingAsBilling(!useShippingAsBilling)}
                />
                <span>Use shipping address as billing address</span>
              </label>
              {!useShippingAsBilling && (
                <div>
                  <div className="v5-cohead"><h2>Billing address</h2></div>
                  <div className="v5-field">
                    <label htmlFor="cb-country">Country/Region</label>
                    <select id="cb-country" name="country" className="v5-select" value={billing.country} onChange={handleBillingChange}>
                      {countryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="v5-co2">
                    <div className="v5-field">
                      <label htmlFor="cb-first">First name</label>
                      <input id="cb-first" name="firstName" className="v5-input" value={billing.firstName} onChange={handleBillingChange} />
                    </div>
                    <div className="v5-field">
                      <label htmlFor="cb-last">Last name</label>
                      <input id="cb-last" name="lastName" className="v5-input" value={billing.lastName} onChange={handleBillingChange} />
                    </div>
                  </div>
                  <div className="v5-field">
                    <label htmlFor="cb-company">Company (optional)</label>
                    <input id="cb-company" name="company" className="v5-input" value={billing.company} onChange={handleBillingChange} />
                  </div>
                  <div className="v5-field">
                    <label htmlFor="cb-address">Address</label>
                    <input id="cb-address" name="address" className="v5-input" value={billing.address} onChange={handleBillingChange} />
                  </div>
                  <div className="v5-field">
                    <label htmlFor="cb-apartment">Apartment, suite, etc. (optional)</label>
                    <input id="cb-apartment" name="apartment" className="v5-input" value={billing.apartment} onChange={handleBillingChange} />
                  </div>
                  <div className="v5-co3">
                    <div className="v5-field">
                      <label htmlFor="cb-city">City</label>
                      <input id="cb-city" name="city" className="v5-input" value={billing.city} onChange={handleBillingChange} />
                    </div>
                    <div className="v5-field">
                      <label htmlFor="cb-state">State</label>
                      <select id="cb-state" name="state" className="v5-select" value={billing.state} onChange={handleBillingChange}>
                        {stateOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="v5-field">
                      <label htmlFor="cb-zip">ZIP code</label>
                      <input id="cb-zip" name="zip" className="v5-input" value={billing.zip} onChange={handleBillingChange} />
                    </div>
                  </div>
                  <div className="v5-field">
                    <label htmlFor="cb-phone">Phone (optional)</label>
                    <input id="cb-phone" name="phone" className="v5-input" value={billing.phone} onChange={handleBillingChange} />
                  </div>
                </div>
              )}

              {/* Pay now */}
              <button
                type="button"
                className="btn btn--dark"
                style={{ width: "100%", marginTop: "24px" }}
                onClick={handlePayNow}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Pay Now with PayU"} <Arr />
              </button>
              <p className="v5-conote" style={{ marginTop: "16px" }}>
                One or more items in your cart is a deferred or recurring purchase. By
                continuing with your payment, you agree that your payment method will
                automatically be charged at the price and frequency listed on this page
                until it ends or you cancel. All cancellations are subject to the{" "}
                <a href="#" className="v5-colink">cancellation policy</a>.
              </p>
              <div className="v5-policylinks">
                <button type="button" onClick={() => setShowRefundModal(true)}>Refund policy</button>
                <button type="button" onClick={() => setShowShippingModal(true)}>Shipping policy</button>
                <button type="button" onClick={() => setShowCancellationModal(true)}>Cancellation policy</button>
                <button type="button" onClick={() => setShowContactModal(true)}>Contact information</button>
              </div>
            </div>

            {/* Right: order summary */}
            <aside className="v5-summary">
              <h3>Order summary</h3>
              {cart.map((item) => (
                <div key={item.variantId} className="v5-sumitem">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = IMG_FALLBACK;
                    }}
                  />
                  <span>
                    <span className="v5-sumitem__n">{item.name}</span>
                    <span className="v5-sumitem__q">Quantity: {item.quantity}</span>
                  </span>
                  <span className="v5-sumitem__p">{inr(item.price * item.quantity)}</span>
                </div>
              ))}

              {/* Discount code */}
              {appliedCoupon ? (
                <div className="v5-coupon-applied">
                  <span><b>{appliedCoupon.code}</b> (−{inr(discountAmount)})</span>
                  <button type="button" onClick={handleRemoveCoupon}>Remove</button>
                </div>
              ) : (
                <div className="v5-coupon-wrap">
                  <div className="v5-coupon">
                    <input
                      type="text"
                      className="v5-input"
                      placeholder="Discount code or gift card"
                      value={discount}
                      onChange={(e) => { setDiscount(e.target.value); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      style={couponError ? { borderColor: "#b3261e" } : undefined}
                    />
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="v5-err">{couponError}</p>}
                </div>
              )}

              {/* Totals */}
              <div className="v5-sumrow">
                <span>Subtotal · {cart.length} items</span>
                <span>{inr(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="v5-sumrow">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span style={{ color: "var(--green-d)" }}>−{inr(discountAmount)}</span>
                </div>
              )}
              <div className="v5-sumrow">
                <span>Shipping</span>
                {subtotal >= FREE_SHIP_THRESHOLD || shippingFee === 0 ? (
                  <span className="free">Free</span>
                ) : (
                  <span>{inr(shippingFee)}</span>
                )}
              </div>
              <div className="v5-sumrow v5-sumrow--total">
                <span>Total</span>
                <span>{inr(total)}</span>
              </div>
              <p className="v5-conote">This order has a recurring charge for multiple items.</p>
            </aside>
          </div>
        </div>
      </section>

      {/* Refund policy modal */}
      {showRefundModal && (
        <PolicyModal title="Refund policy" onClose={() => setShowRefundModal(false)}>
          <p>Third Biome does not issue refunds unless under the following conditions:</p>
          <ul>
            <li>The product ordered is out of stock or unavailable.</li>
            <li>The delivery address is non-serviceable.</li>
            <li>You were charged twice for the same order.</li>
            <li>You comply fully with the return policy, and the product is verified to be in good, untampered condition.</li>
          </ul>
          <h4>Refunds will not be processed if:</h4>
          <ul>
            <li>The product is returned used, damaged, or altered.</li>
            <li>The shipping address provided was incorrect.</li>
            <li>You've consumed part of the product before requesting a return.</li>
            <li>You do not comply with the conditions above.</li>
          </ul>
          <h4>Return Pickup</h4>
          <ul>
            <li>For eligible pin codes, we will initiate a reverse pickup within 1-2 days of return approval.</li>
            <li>If your location is not serviceable by our courier, you will be asked to self-ship the product. We will reimburse the courier charges upon submission of a valid receipt.</li>
          </ul>
          <h4>Refund Timelines</h4>
          <ul>
            <li>For online payments, refunds will be processed to the original source within 7 working days of approval.</li>
            <li>For COD orders, refunds will be processed to your bank account within 14 working days of request verification.</li>
          </ul>
        </PolicyModal>
      )}

      {/* Shipping policy modal */}
      {showShippingModal && (
        <PolicyModal title="Shipping policy" onClose={() => setShowShippingModal(false)}>
          <p>At Third Biome, we are committed to delivering precision wellness products safely and on time.</p>
          <h4>Shipping Timeline:</h4>
          <ul>
            <li>Orders are processed within 24-48 hours after confirmation.</li>
            <li>Orders are typically delivered within 7-10 business days from the date of dispatch.</li>
            <li>You will receive a tracking link via SMS/email once your order is shipped.</li>
          </ul>
          <h4>Shipping Charges:</h4>
          <ul>
            <li>We offer free shipping on all prepaid orders across India.</li>
            <li>COD (if enabled) may incur additional charges, which will be reflected at checkout.</li>
          </ul>
        </PolicyModal>
      )}

      {/* Cancellation policy modal */}
      {showCancellationModal && (
        <PolicyModal title="Cancellation policy" onClose={() => setShowCancellationModal(false)}>
          <p>You may cancel your order only if it has not been shipped.</p>
          <h4>Cancellation Process:</h4>
          <ul>
            <li>
              To cancel an order, please write to our customer support at{" "}
              <a href="mailto:support@thirdbiome.com" className="v5-colink">support@thirdbiome.com</a>{" "}
              with your order ID and reason.
            </li>
            <li>If the order is eligible for cancellation, the refund (if any) will be processed within 7 business days of confirmation.</li>
            <li>Once shipped, orders cannot be cancelled.</li>
          </ul>
        </PolicyModal>
      )}

      {/* Contact information modal */}
      {showContactModal && (
        <PolicyModal title="Contact Us" onClose={() => setShowContactModal(false)}>
          <p>For any questions or support:</p>
          <h4>Contact Details:</h4>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@thirdbiome.com" className="v5-colink">support@thirdbiome.com</a>
            </li>
            <li><strong>Phone:</strong> +91-XXXXXXXXXX (Mon-Fri, 10 AM - 6 PM IST)</li>
          </ul>
        </PolicyModal>
      )}
    </>
  );
}
