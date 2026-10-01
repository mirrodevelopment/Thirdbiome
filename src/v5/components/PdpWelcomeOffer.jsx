import { useEffect, useState } from "react";
import { PDP_WELCOME_OFFER_CONFIG } from "../data/content";

const PDP_OFFER_SEEN_KEY = "t3b_pdp_welcome_offer_seen";
const PDP_OFFER_DISMISSED_KEY = "t3b_pdp_welcome_offer_dismissed";

export default function PdpWelcomeOffer() {
  const config = PDP_WELCOME_OFFER_CONFIG;
  const [isOpen, setIsOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isPillDismissed, setIsPillDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(config.deadline));

  function getTimeRemaining(deadlineStr) {
    const total = Date.parse(deadlineStr) - Date.now();
    if (isNaN(total) || total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds, expired: false };
  }

  // Ticking countdown timer
  useEffect(() => {
    if (timeLeft.expired) return undefined;
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(config.deadline);
      setTimeLeft(remaining);
      if (remaining.expired) {
        clearInterval(interval);
        setIsOpen(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [config.deadline, timeLeft.expired]);

  // Trigger once per visitor on delay or exit intent
  useEffect(() => {
    if (timeLeft.expired) return undefined;
    const hasSeen = localStorage.getItem(PDP_OFFER_SEEN_KEY) || localStorage.getItem(PDP_OFFER_DISMISSED_KEY);
    if (hasSeen) return undefined;

    const autoOpenTimer = setTimeout(() => {
      if (!localStorage.getItem(PDP_OFFER_SEEN_KEY)) {
        localStorage.setItem(PDP_OFFER_SEEN_KEY, "1");
        setIsOpen(true);
      }
    }, config.autoTriggerDelayMs || 6000);

    const onExitIntent = (e) => {
      if (e.clientY <= 0 && !localStorage.getItem(PDP_OFFER_SEEN_KEY)) {
        localStorage.setItem(PDP_OFFER_SEEN_KEY, "1");
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseout", onExitIntent);
    return () => {
      clearTimeout(autoOpenTimer);
      document.removeEventListener("mouseout", onExitIntent);
    };
  }, [config.autoTriggerDelayMs, timeLeft.expired]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const dismiss = () => {
    setIsOpen(false);
    localStorage.setItem(PDP_OFFER_DISMISSED_KEY, "1");
  };

  const handleApplyOffer = () => {
    sessionStorage.setItem("t3b_pending_coupon", config.couponCode);
    setIsApplied(true);
    localStorage.setItem(PDP_OFFER_DISMISSED_KEY, "1");
    setTimeout(() => {
      setIsOpen(false);
      const buySection = document.getElementById("subs") || document.getElementById("addBag");
      if (buySection) {
        buySection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 1200);
  };

  // If the campaign deadline has expired, don't show the offer popup or pill
  if (timeLeft.expired) {
    return null;
  }

  return (
    <>
      {/* Sticky Bottom-Left Teaser Button (as shown in reference image) */}
      {config.stickyPillEnabled && !isPillDismissed && !isOpen && (
        <aside
          className="pdp-sticky-offer-pill-wrap"
          aria-label="Welcome offer shortcut"
        >
          <button
            type="button"
            className="pdp-sticky-offer-pill"
            onClick={() => setIsOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
          >
            <span className="pdp-sticky-offer-pill__text">
              {config.stickyPillText || "Get up to 48% off"}
            </span>
            <button
              type="button"
              className="pdp-sticky-offer-pill__close"
              onClick={(e) => {
                e.stopPropagation();
                setIsPillDismissed(true);
              }}
              aria-label="Dismiss offer teaser"
            >
              ✕
            </button>
          </button>
        </aside>
      )}

      {/* Main Welcome Offer Modal Dialog with Countdown */}
      <div
        className={`pdp-offer-overlay${isOpen ? " on" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
        aria-hidden={!isOpen}
      >
        <div
          className="pdp-offer-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-offer-title"
          aria-describedby="pdp-offer-desc"
        >
          <button
            type="button"
            className="pdp-offer-close"
            onClick={dismiss}
            aria-label="Close welcome offer dialog"
          >
            ✕
          </button>

          <div className="pdp-offer-head">
            <div className="pdp-offer-badge">
              <span className="pdp-offer-badge__dot" />
              {config.badgeText}
            </div>
            <span className="pdp-offer-discount">{config.discountAmount}</span>
            <h2 id="pdp-offer-title" className="pdp-offer-title">{config.headline}</h2>
          </div>

          <div className="pdp-offer-body">
            <p id="pdp-offer-desc" className="pdp-offer-desc">
              {config.description}
            </p>

            {/* Countdown Clock (Time Limit) */}
            <div className="pdp-offer-countdown-wrap" aria-label="Offer expiration countdown">
              <span className="pdp-offer-countdown-label">Offer expires in:</span>
              <div className="pdp-offer-countdown">
                <div className="pdp-offer-timebox">
                  <b>{String(timeLeft.days).padStart(2, "0")}</b>
                  <small>Days</small>
                </div>
                <span className="pdp-offer-sep">:</span>
                <div className="pdp-offer-timebox">
                  <b>{String(timeLeft.hours).padStart(2, "0")}</b>
                  <small>Hours</small>
                </div>
                <span className="pdp-offer-sep">:</span>
                <div className="pdp-offer-timebox">
                  <b>{String(timeLeft.minutes).padStart(2, "0")}</b>
                  <small>Mins</small>
                </div>
                <span className="pdp-offer-sep">:</span>
                <div className="pdp-offer-timebox">
                  <b>{String(timeLeft.seconds).padStart(2, "0")}</b>
                  <small>Secs</small>
                </div>
              </div>
            </div>

            {/* Coupon Code Block */}
            <div className="pdp-offer-code-chip">
              <span>Use Coupon Code:</span>
              <code>{config.couponCode}</code>
            </div>

            {/* CTA Buttons */}
            <div className="pdp-offer-actions">
              {!isApplied ? (
                <button
                  type="button"
                  className="btn btn--leaf pdp-offer-btn"
                  onClick={handleApplyOffer}
                >
                  {config.ctaText} →
                </button>
              ) : (
                <div className="pdp-offer-success" role="status">
                  ✓ {config.successMessage}
                </div>
              )}
              <button
                type="button"
                className="pdp-offer-skip"
                onClick={dismiss}
              >
                No thanks, I’ll pay full price
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
