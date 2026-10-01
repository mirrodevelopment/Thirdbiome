import { useEffect, useState } from "react";
import getApiClient from "../../axios/axios";

const OFFER_SEEN_KEY = "t3b_welcome_offer_seen";
const OFFER_DISMISSED_KEY = "t3b_welcome_offer_dismissed";
const OFFER_SUBMITTED_KEY = "t3b_welcome_offer_submitted";
const DEFAULT_WELCOME_COUPON = "WELCOME200";

/* Phone-first first-order welcome offer popup (Split modal matching reference image) */
export default function Popup() {
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Show immediately on 1st entrance to the website
  useEffect(() => {
    const alreadyHandled = () =>
      localStorage.getItem(OFFER_SEEN_KEY) ||
      localStorage.getItem(OFFER_DISMISSED_KEY) ||
      localStorage.getItem(OFFER_SUBMITTED_KEY);

    if (alreadyHandled()) return undefined;

    // Trigger popup on first visit after 1 second delay
    const entranceTimer = window.setTimeout(() => {
      if (alreadyHandled()) return;
      localStorage.setItem(OFFER_SEEN_KEY, "1");
      setShow(true);
    }, 1000);

    const onExitIntent = (event) => {
      if (event.clientY <= 0 && !alreadyHandled()) {
        localStorage.setItem(OFFER_SEEN_KEY, "1");
        setShow(true);
      }
    };

    document.addEventListener("mouseout", onExitIntent);
    return () => {
      window.clearTimeout(entranceTimer);
      document.removeEventListener("mouseout", onExitIntent);
    };
  }, []);

  // Listen for manual trigger events (e.g. from buttons or links)
  useEffect(() => {
    const openWelcomeOffer = () => {
      setShow(true);
    };
    window.addEventListener("t3b:open-welcome-offer", openWelcomeOffer);
    return () => window.removeEventListener("t3b:open-welcome-offer", openWelcomeOffer);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!show) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [show]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(OFFER_DISMISSED_KEY, "1");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      setError("Please enter a valid mobile number.");
      setBusy(false);
      return;
    }

    try {
      const apiClient = await getApiClient();
      const response = await apiClient.post("/newsletter/subscribe", {
        phoneNumber: cleanPhone,
        phone: cleanPhone,
        ...(emailOptIn && email.trim() ? { email: email.trim(), emailOptIn: true } : {}),
        source: "first-visit-welcome-popup",
      });

      const data = response?.data || {};
      const payload = data.data || data;
      const code =
        payload.couponCode ||
        payload.coupon_code ||
        payload.code ||
        payload.discountCode ||
        DEFAULT_WELCOME_COUPON;

      sessionStorage.setItem("t3b_pending_coupon", code);
      localStorage.setItem(OFFER_SUBMITTED_KEY, "1");
      setResult({ code });
    } catch {
      // Fallback grace to provide coupon even if backend subscription endpoint is offline
      sessionStorage.setItem("t3b_pending_coupon", DEFAULT_WELCOME_COUPON);
      localStorage.setItem(OFFER_SUBMITTED_KEY, "1");
      setResult({ code: DEFAULT_WELCOME_COUPON });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`popup-overlay${show ? " on" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
      aria-hidden={!show}
    >
      <div
        className="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-offer-title"
      >
        {/* Left Side: Forest Green Story Panel */}
        <div className="popup__story">
          <span className="popup__mono">A little something for your first order</span>
          <h2 id="welcome-offer-title">
            Your gut says<br />hi.
          </h2>
          <p>
            Get a first-order offer, plus the occasional gut fact worth sharing at dinner. No spam. Pinky promise.
          </p>
          <ul className="popup__checklist">
            <li>Sign up with your mobile number</li>
            <li>Get your welcome offer details</li>
            <li>Use it when you’re ready to shop</li>
          </ul>
        </div>

        {/* Right Side: Clean Capture Form */}
        <div className="popup__capture">
          <button
            type="button"
            className="popup__close"
            aria-label="Maybe later"
            onClick={dismiss}
          >
            Maybe later
          </button>

          {!result ? (
            <form className="popup__form" onSubmit={submit}>
              <h3 className="popup__field-label">Get started</h3>

              <div className="popup__input-group">
                <input
                  id="welcome-phone"
                  type="tel"
                  placeholder="Mobile number (+91)"
                  aria-label="Mobile number"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </div>

              <label className="popup__consent">
                <input
                  type="checkbox"
                  checked={emailOptIn}
                  onChange={(event) => setEmailOptIn(event.target.checked)}
                />
                <span>Also send my offer by email (optional)</span>
              </label>

              {emailOptIn && (
                <div className="popup__input-group popup__input-group--fade">
                  <input
                    id="welcome-email"
                    type="email"
                    placeholder="Email address (e.g. you@example.com)"
                    aria-label="Email address"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              )}

              <button
                className="popup__submit-btn"
                type="submit"
                disabled={busy}
              >
                {busy ? "Sending…" : "Send my offer →"}
              </button>

              <small className="popup__disclaimer">
                By signing up, you agree to receive updates about your offer. Unsubscribe anytime.
              </small>

              {error && (
                <p className="popup__error" role="alert">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <div className="popup__success on" role="status">
              <div className="popup__success-icon">✓</div>
              <h3>Your welcome code is ready</h3>
              <p className="popup__success-code">
                Use code <strong>{result.code}</strong> at checkout for ₹200 OFF.
              </p>
              <button
                type="button"
                className="popup__submit-btn"
                onClick={dismiss}
                style={{ marginTop: 18 }}
              >
                Start shopping →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

