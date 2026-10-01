/* Third Biome v5, Account & Orders (account.html)
   Real auth via authService + AuthSlice (mirrors old Login/Register flows,
   incl. token storage in the slice and guest-cart merge) and real orders
   via orderService.getUserOrders(). */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import { Arr } from "../components/ui";
import { useCart } from "../cart/CartProvider";
import { inr } from "../data/content";
import { authService } from "../../services/authService";
import { mergeCarts } from "../../services/cartService";
import { getUserOrders } from "../../services/orderService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} from "../../redux/slices/AuthSlice";

const TRACK_STEPS = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];

/* order status → 1-based track step reached (0 = pending / not started) */
const stepFor = (status) => {
  const s = String(status || "").toLowerCase().replace(/[\s-]+/g, "_");
  if (["confirmed", "processing", "accepted"].includes(s)) return 1;
  if (["packed", "packing", "ready_to_ship"].includes(s)) return 2;
  if (["shipped", "dispatched", "in_transit"].includes(s)) return 3;
  if (s === "out_for_delivery") return 4;
  if (["delivered", "completed"].includes(s)) return 5;
  return 0;
};

const statusLabel = (status) =>
  status
    ? String(status).replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase())
    : "Pending";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const errStyle = { fontSize: ".82rem", color: "#b3261e", marginTop: "12px" };
const linkBtnStyle = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  font: "inherit",
  color: "inherit",
  textDecoration: "underline",
};

const CheckSvg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* one real order rendered in the designed .v5-order card */
function OrderCard({ order, onReorder, reorderBusy }) {
  const number =
    order.orderNumber || order.order_number || (order.id != null ? String(order.id).slice(-8) : ", ");
  const placed = fmtDate(order.orderDate || order.createdAt || order.created_at);
  const items = Array.isArray(order.items) ? order.items : [];
  const title =
    items
      .map(
        (it) =>
          `${it.name || it.productName || "Biome Balance"}${(it.quantity || 1) > 1 ? ` ×${it.quantity}` : ""}`
      )
      .join(" · ") || "Biome Balance";
  const s = String(order.status || "").toLowerCase();
  const closed = ["delivered", "cancelled", "refunded", "returned"].includes(s);
  const step = stepFor(order.status);
  const total = order.totalAmount ?? order.total_amount ?? order.total ?? null;
  const awb = order.trackingNumber || order.tracking_number || order.awb || null;
  const closedDate = fmtDate(
    order.deliveredAt || order.delivered_at || order.updatedAt || order.updated_at
  );

  return (
    <div className="v5-order">
      <div className="v5-order__top">
        <div>
          <div className="v5-order__id">
            Order #{number}
            {placed && <> · placed {placed}</>}
          </div>
          <div style={{ fontWeight: 700, marginTop: "4px" }}>{title}</div>
        </div>
        <span
          className="v5-order__status"
          style={closed ? { background: "var(--card)", color: "var(--ink-soft)" } : undefined}
        >
          {statusLabel(order.status)}
        </span>
      </div>
      {closed ? (
        <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", marginTop: "4px" }}>
          {statusLabel(order.status)}
          {closedDate && ` ${closedDate}`}
          {total != null && (
            <>
              {" "}· Order total <b style={{ color: "var(--ink)" }}>{inr(total)}</b>
            </>
          )}
          {s === "delivered" && (
            <>
              {" "}·{" "}
              <button type="button" onClick={onReorder} disabled={reorderBusy} style={linkBtnStyle}>
                Reorder
              </button>
            </>
          )}
        </p>
      ) : (
        <>
          <div className="v5-track">
            {TRACK_STEPS.map((label, i) => {
              const n = i + 1;
              return (
                <div key={label} className={`v5-track__step${n <= step ? " done" : ""}`}>
                  <div className="v5-track__dot">{n < step ? <CheckSvg /> : n}</div>
                  <div className="v5-track__l">{label}</div>
                </div>
              );
            })}
          </div>
          {(total != null || awb) && (
            <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", marginTop: "16px" }}>
              {total != null && (
                <>
                  Order total <b style={{ color: "var(--ink)" }}>{inr(total)}</b>
                </>
              )}
              {awb && <> · AWB {awb}</>}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next");
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { add, busy: cartBusy, say } = useCart();

  const [tab, setTab] = useState(isAuthenticated ? "orders" : "signin");

  /* sign-in form */
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");
  const [siBusy, setSiBusy] = useState(false);
  const [siError, setSiError] = useState("");

  /* forgot password (inline: send code → code + new password) */
  const [fpOpen, setFpOpen] = useState(false);
  const [fpOtp, setFpOtp] = useState("");
  const [fpPass, setFpPass] = useState("");
  const [fpBusy, setFpBusy] = useState(false);
  const [fpMsg, setFpMsg] = useState("");
  const [fpErr, setFpErr] = useState("");

  /* create-account form */
  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [regBusy, setRegBusy] = useState(false);
  const [regError, setRegError] = useState("");
  const [regDone, setRegDone] = useState(false);

  /* orders */
  const [orders, setOrders] = useState([]);
  const [ordersState, setOrdersState] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    setTab(isAuthenticated ? "orders" : "signin");
  }, [isAuthenticated]);

  const fetchOrders = useCallback(async () => {
    setOrdersState("loading");
    try {
      const response = await getUserOrders();
      let data = [];
      if (Array.isArray(response)) data = response;
      else if (Array.isArray(response?.data)) data = response.data;
      else if (Array.isArray(response?.data?.data)) data = response.data.data;
      else if (Array.isArray(response?.orders)) data = response.orders;
      setOrders(data);
      setOrdersState("ready");
    } catch (err) {
      if (err?.response?.status === 404) {
        setOrders([]);
        setOrdersState("ready");
      } else {
        setOrdersState("error");
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated, fetchOrders]);

  const setRegField = (k) => (e) => setReg((r) => ({ ...r, [k]: e.target.value }));

  /* mirrors src/pages/Authentication/Login.jsx handleSubmit */
  const handleSignin = async (e) => {
    e.preventDefault();
    if (siBusy) return;
    setSiError("");
    if (!siEmail.trim() || !/\S+@\S+\.\S+/.test(siEmail)) {
      setSiError("Please enter a valid email address.");
      return;
    }
    if (!siPass) {
      setSiError("Password is required.");
      return;
    }
    setSiBusy(true);
    try {
      dispatch(loginStart());
      const response = await authService.login({ email: siEmail, password: siPass });
      dispatch(loginSuccess(response));
      say("Signed in ✓");
      // merge guest cart with user cart after successful login (as the old Login does)
      try {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
          await mergeCarts();
          say("Your cart items have been merged!");
        }
      } catch (mergeError) {
        // login succeeded, don't surface merge failure
      }
      // return the user to checkout (or wherever they came from) if requested
      if (nextPath) {
        navigate(nextPath);
      }
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "Login failed. Please try again.";
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (err.response?.status) {
        errorMessage = `Error ${err.response.status}: ${err.response.statusText || "Server Error"}`;
        if (typeof errorData === "string") {
          errorMessage += ` - ${errorData.substring(0, 100)}`;
        }
      } else if (err.message) {
        errorMessage = `Network Error: ${err.message}`;
      }
      dispatch(loginFailure(errorMessage));
      setSiError(errorMessage);
    } finally {
      setSiBusy(false);
    }
  };

  /* mirrors src/pages/Authentication/Register.jsx handleSubmit + validation */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regBusy) return;
    setRegError("");
    if (!reg.firstName.trim()) { setRegError("First name is required."); return; }
    if (!reg.lastName.trim()) { setRegError("Last name is required."); return; }
    if (!reg.phoneNumber.trim() || !/^\+?[\d\s\-()]{10,}$/.test(reg.phoneNumber)) {
      setRegError("Please enter a valid phone number.");
      return;
    }
    if (!reg.email.trim() || !/\S+@\S+\.\S+/.test(reg.email)) {
      setRegError("Please enter a valid email address.");
      return;
    }
    if (!reg.password || reg.password.length < 8) {
      setRegError("Password must be at least 8 characters long.");
      return;
    }
    setRegBusy(true);
    try {
      dispatch(registerStart());
      const response = await authService.register(reg);
      dispatch(registerSuccess(response));
      // the register endpoint returns no auth token, prompt sign-in (old page redirected to login)
      setRegDone(true);
      setSiEmail(reg.email);
      say("Account created ✓");
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "Registration failed. Please try again.";
      if (errorData?.errors) {
        errorMessage = Object.values(errorData.errors).flat().join(", ");
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      dispatch(registerFailure(errorMessage));
      setRegError(errorMessage);
    } finally {
      setRegBusy(false);
    }
  };

  const handleForgot = async () => {
    if (fpBusy) return;
    setFpErr("");
    setFpMsg("");
    if (!/\S+@\S+\.\S+/.test(siEmail)) {
      setSiError("Enter your email above first, then tap “Forgot password?”");
      return;
    }
    setSiError("");
    setFpBusy(true);
    try {
      await authService.forgotPassword(siEmail);
      setFpOpen(true);
      setFpMsg(`Reset code sent to ${siEmail}.`);
    } catch (err) {
      setFpErr(err.response?.data?.message || "Couldn't send the reset code. Please try again.");
    } finally {
      setFpBusy(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (fpBusy) return;
    setFpErr("");
    if (!fpOtp.trim()) { setFpErr("Enter the code from your email."); return; }
    if (!fpPass || fpPass.length < 8) {
      setFpErr("New password must be at least 8 characters long.");
      return;
    }
    setFpBusy(true);
    try {
      await authService.resetPassword(siEmail, fpOtp, fpPass);
      setFpOpen(false);
      setFpOtp("");
      setFpPass("");
      setFpMsg("Password reset ✓, sign in with your new password.");
    } catch (err) {
      setFpErr(err.response?.data?.message || "Reset failed. Check the code and try again.");
    } finally {
      setFpBusy(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // slice clears token + persisted auth
    setOrders([]);
    setOrdersState("idle");
    say("Signed out");
  };

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your account";
  const userMeta = [user?.email, user?.phoneNumber].filter(Boolean).join(" · ");

  return (
    <>
      <Seo
        title="Account"
        description="Sign in to Third Biome to track your Biome Balance orders, manage your subscription, and follow your 90-day gut protocol timeline."
      />
      <section
        className="sheet v5-page"
        data-screen-label="Account hero"
        style={{ paddingBottom: "clamp(24px,4vw,40px)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Your account</span>
          <h1>Manage your <em>protocol.</em></h1>
          <p>Sign in to track orders, update your subscription, and see where you are in your 90-day timeline.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Account panes"><div className="wrap" style={{ maxWidth: "920px" }}>
        <div className="v5-tabs" role="tablist">
          <button
            className={`v5-tab${tab === "orders" ? " on" : ""}`}
            data-pane="orders"
            onClick={() => setTab("orders")}
          >
            Orders & tracking
          </button>
          {!isAuthenticated && (
            <button
              className={`v5-tab${tab === "signin" ? " on" : ""}`}
              data-pane="signin"
              onClick={() => setTab("signin")}
            >
              Sign in
            </button>
          )}
        </div>

        {/* ORDERS / TRACKING */}
        {tab === "orders" && (
          <div className="v5-pane on" id="pane-orders">
            {!isAuthenticated ? (
              <div className="v5-order" style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>Sign in to see your orders.</p>
                <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", margin: "6px 0 16px" }}>
                  Your order history and live tracking live in your account.
                </p>
                <button className="btn btn--dark" onClick={() => setTab("signin")}>
                  Sign in <Arr />
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: "var(--card)",
                    borderRadius: "var(--r-lg)",
                    padding: "22px 24px",
                    marginBottom: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{userName}</div>
                    {userMeta && (
                      <div style={{ fontSize: ".86rem", color: "var(--ink-soft)", marginTop: "3px" }}>
                        {userMeta}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button className="btn btn--out" onClick={handleLogout}>Sign out</button>
                  </div>
                </div>

                {ordersState === "loading" && (
                  <div className="v5-order">
                    <p
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: ".62rem",
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "var(--ink-soft)",
                        margin: 0,
                      }}
                    >
                      Loading your orders…
                    </p>
                  </div>
                )}

                {ordersState === "error" && (
                  <div className="v5-order">
                    <p style={{ fontWeight: 700, margin: 0 }}>Couldn't load your orders.</p>
                    <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", margin: "6px 0 14px" }}>
                      Check your connection and try again.
                    </p>
                    <button className="btn btn--ghost" onClick={fetchOrders}>Retry</button>
                  </div>
                )}

                {ordersState === "ready" && orders.length === 0 && (
                  <div className="v5-order">
                    <p style={{ fontWeight: 700, margin: 0 }}>No orders yet.</p>
                    <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", margin: "6px 0 14px" }}>
                      Start your protocol and your orders + live tracking will show up here.
                    </p>
                    <Link className="btn btn--dark" to="/products/biome-balance">
                      Shop Biome Balance <Arr />
                    </Link>
                  </div>
                )}

                {ordersState === "ready" &&
                  orders.map((order, i) => (
                    <OrderCard
                      key={order.id || order.orderNumber || i}
                      order={order}
                      onReorder={() => add()}
                      reorderBusy={cartBusy}
                    />
                  ))}
              </>
            )}
          </div>
        )}

        {/* SIGN IN / CREATE ACCOUNT */}
        {tab === "signin" && !isAuthenticated && (
          <div className="v5-pane on" id="pane-signin">
            <div className="v5-2col">
              <div className="v5-formcard">
                <form id="signinForm" onSubmit={handleSignin}>
                  <span className="eyebrow">Members</span>
                  <h2 style={{ fontSize: "clamp(1.4rem,2.4vw,1.9rem)", margin: "12px 0 20px" }}>Sign in.</h2>
                  <div className="v5-field">
                    <label htmlFor="si-email">Email</label>
                    <input
                      className="v5-input"
                      id="si-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      disabled={siBusy}
                    />
                  </div>
                  <div className="v5-field">
                    <label htmlFor="si-pass">Password</label>
                    <input
                      className="v5-input"
                      id="si-pass"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={siPass}
                      onChange={(e) => setSiPass(e.target.value)}
                      disabled={siBusy}
                    />
                  </div>
                  <button className="btn btn--dark" type="submit" style={{ width: "100%" }} disabled={siBusy}>
                    {siBusy ? "Signing in…" : "Sign in"} <Arr />
                  </button>
                  {siError && <p style={{ ...errStyle, textAlign: "center" }}>{siError}</p>}
                  <p style={{ textAlign: "center", marginTop: "12px", fontSize: ".86rem", color: "var(--ink-soft)" }}>
                    <button type="button" onClick={handleForgot} disabled={fpBusy} style={linkBtnStyle}>
                      Forgot password?
                    </button>
                  </p>
                  {fpMsg && (
                    <p style={{ textAlign: "center", marginTop: "8px", fontSize: ".82rem", color: "var(--green-d)" }}>
                      {fpMsg}
                    </p>
                  )}
                </form>
                {fpOpen && (
                  <form
                    onSubmit={handleReset}
                    style={{ marginTop: "18px", borderTop: "1px solid var(--line)", paddingTop: "18px" }}
                  >
                    <div className="v5-field">
                      <label htmlFor="fp-otp">Reset code</label>
                      <input
                        className="v5-input"
                        id="fp-otp"
                        type="text"
                        placeholder="Code from your email"
                        required
                        value={fpOtp}
                        onChange={(e) => setFpOtp(e.target.value)}
                        disabled={fpBusy}
                      />
                    </div>
                    <div className="v5-field">
                      <label htmlFor="fp-pass">New password</label>
                      <input
                        className="v5-input"
                        id="fp-pass"
                        type="password"
                        placeholder="Min 8 characters"
                        required
                        minLength={8}
                        value={fpPass}
                        onChange={(e) => setFpPass(e.target.value)}
                        disabled={fpBusy}
                      />
                    </div>
                    <button className="btn btn--out" type="submit" style={{ width: "100%" }} disabled={fpBusy}>
                      {fpBusy ? "Resetting…" : "Reset password"}
                    </button>
                  </form>
                )}
                {fpErr && <p style={{ ...errStyle, textAlign: "center" }}>{fpErr}</p>}
              </div>
              <div>
                <span className="eyebrow">New here?</span>
                <h2 style={{ fontSize: "clamp(1.4rem,2.4vw,1.9rem)", margin: "12px 0 12px" }}>Create an account.</h2>
                <p style={{ color: "var(--ink-soft)", marginBottom: "18px" }}>
                  Track every order, manage your subscription, and keep your 90-day timeline in one place.
                </p>
                <ul className="split__list" style={{ marginTop: 0 }}>
                  <li>One-tap reorder & subscription control</li>
                  <li>Live order tracking & invoices</li>
                  <li>Member-only protocol resources</li>
                </ul>
                {regDone ? (
                  <div className="v5-form-ok on" style={{ marginTop: "22px" }}>
                    <h3>Account created ✓</h3>
                    <p style={{ color: "var(--ink-soft)" }}>
                      Sign in with your email and new password to see your orders.
                    </p>
                  </div>
                ) : (
                  <form id="registerForm" onSubmit={handleRegister} style={{ marginTop: "22px" }}>
                    <div className="v5-2col" style={{ gap: "14px" }}>
                      <div className="v5-field">
                        <label htmlFor="ca-first">First name</label>
                        <input
                          className="v5-input"
                          id="ca-first"
                          type="text"
                          placeholder="First name"
                          required
                          value={reg.firstName}
                          onChange={setRegField("firstName")}
                          disabled={regBusy}
                        />
                      </div>
                      <div className="v5-field">
                        <label htmlFor="ca-last">Last name</label>
                        <input
                          className="v5-input"
                          id="ca-last"
                          type="text"
                          placeholder="Last name"
                          required
                          value={reg.lastName}
                          onChange={setRegField("lastName")}
                          disabled={regBusy}
                        />
                      </div>
                    </div>
                    <div className="v5-field">
                      <label htmlFor="ca-phone">Phone</label>
                      <input
                        className="v5-input"
                        id="ca-phone"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        required
                        value={reg.phoneNumber}
                        onChange={setRegField("phoneNumber")}
                        disabled={regBusy}
                      />
                    </div>
                    <div className="v5-field">
                      <label htmlFor="ca-email">Email</label>
                      <input
                        className="v5-input"
                        id="ca-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={reg.email}
                        onChange={setRegField("email")}
                        disabled={regBusy}
                      />
                    </div>
                    <div className="v5-field">
                      <label htmlFor="ca-pass">Password</label>
                      <input
                        className="v5-input"
                        id="ca-pass"
                        type="password"
                        placeholder="Min 8 characters"
                        required
                        minLength={8}
                        value={reg.password}
                        onChange={setRegField("password")}
                        disabled={regBusy}
                      />
                    </div>
                    <button className="btn btn--dark" type="submit" style={{ width: "100%" }} disabled={regBusy}>
                      {regBusy ? "Creating account…" : "Create account"} <Arr />
                    </button>
                    {regError && <p style={errStyle}>{regError}</p>}
                  </form>
                )}
                <div style={{ marginTop: "22px" }}>
                  <Link className="btn btn--out" to="/t3b-club">Join the T3B Club →</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div></section>
    </>
  );
}
