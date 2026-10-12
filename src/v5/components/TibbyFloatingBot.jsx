import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Arr } from "./ui";
import mascotImg from "../../assets/mascot.png";

const INITIAL_MESSAGES = [
  {
    id: "m1",
    sender: "sunny",
    senderName: "SUNNY",
    text: "Love a well-fed team."
  },
  {
    id: "m2",
    sender: "tibby",
    senderName: "TIBBY",
    text: "Here’s something most people don’t know: You don’t need more bacteria. You need what healthy bacteria produce—postbiotics. Probiotics just send new workers and hope they survive the site."
  },
  {
    id: "m3",
    sender: "sunny",
    senderName: "SUNNY",
    text: "Ah. Like hiring an intern on a Friday evening."
  },
  {
    id: "m4",
    sender: "tibby",
    senderName: "TIBBY",
    text: "Postbiotics skip all that and deliver the finished brick. Biome Balance is the brick: butyrate, the fuel your gut already knows how to use."
  },
  {
    id: "m5",
    sender: "sunny",
    senderName: "SUNNY",
    text: "I have never been this excited about a brick."
  }
];

const PRESET_TOPICS = [
  {
    id: "q_secret",
    label: "What is a postbiotic?",
    question: "What is a postbiotic, and why don't most people know about it?",
    answer: "Here’s something most people don’t know: Probiotics (bacteria) must eat prebiotic fiber to create POSTBIOTICS (butyrate). Butyrate is the real compound that seals your gut lining, calms bloating, and fuels gut cells. We give you the pure postbiotic directly—no guessing."
  },
  {
    id: "q_fridge",
    label: "Do I need to refrigerate it?",
    question: "Do I need to keep Biome Balance in the fridge?",
    answer: "Nope. Unlike live probiotics that die in warm Indian summers, postbiotics are shelf-stable and heat-resistant. Toss it in your bag, travel with it, take it anywhere."
  },
  {
    id: "q_timing",
    label: "When is the best time to take it?",
    question: "When should I take my daily dose?",
    answer: "Take 2 capsules once a day, preferably with a morning meal or water. Consistency beats perfection—just take it around the same time daily."
  },
  {
    id: "q_results",
    label: "How soon do I feel a difference?",
    question: "How long until I notice changes?",
    answer: "Most users notice easing in bloating, gas, and digestion within 7 to 14 days. Deeper gut barrier repair, regular motility, and sustained energy compound over 4 to 8 weeks."
  },
  {
    id: "q_acid",
    label: "Does stomach acid destroy it?",
    question: "Can stomach acid kill butyrate?",
    answer: "Stomach acid wipes out over 90% of fragile probiotics. But Biome Balance delivers targeted, enteric-protected butyrate straight to the colon where your cells absorb it instantly."
  },
  {
    id: "q_antibiotics",
    label: "Can I take it with antibiotics?",
    question: "Can I take Biome Balance if I'm taking antibiotics or other medications?",
    answer: "Yes, absolutely! Unlike live probiotics that are wiped out by antibiotics, postbiotics are non-living bioactive metabolites. They safely protect your gut lining during and after antibiotic courses."
  },
  {
    id: "q_daily",
    label: "Is it safe for daily long-term use?",
    question: "Is Biome Balance safe to take every single day?",
    answer: "100% safe. Butyrate is the primary natural fuel your gut lining needs every day. It builds zero dependency and works continuously to maintain tight gut junctions and reduce inflammation."
  },
  {
    id: "q_bloat",
    label: "Will it cause gas or bloating?",
    question: "Will postbiotics cause initial gas or bloating like probiotics do?",
    answer: "No gas, no fermentation. Probiotics often cause temporary digestive storms because bacteria ferment in your gut. Postbiotics deliver the pure finished metabolite directly—zero fermentative bloating."
  },
  {
    id: "q_brain",
    label: "How does it help brain & energy?",
    question: "How does a gut postbiotic affect my mood, focus, and energy?",
    answer: "Your gut produces over 90% of your body's serotonin. Butyrate strengthens the gut-brain axis, helps calm neuro-inflammation, and steadies energy so you can say goodbye to the 3 PM brain fog slump."
  },
  {
    id: "q_dietary",
    label: "Is it vegan & gluten-free?",
    question: "What dietary standards does Biome Balance follow?",
    answer: "100% vegan, gluten-free, dairy-free, allergen-free, and non-GMO. Formulated in plant-based delayed-release capsules at a US FDA-registered, WHO-GMP certified facility."
  }
];

export const TibbyMascotAvatar = () => (
  <div className="gut-chat__avatar gut-chat__avatar--tibby-mascot" aria-hidden="true">
    <img src={mascotImg} alt="Tibby" className="gut-chat__mascot-img" />
  </div>
);

export const SunnyAvatar = () => (
  <div className="gut-chat__avatar gut-chat__avatar--sunny" aria-hidden="true">
    <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="18" fill="#f3c445" />
      <path d="M11 13.5C12.2 11.8 14.8 11.8 16 13.5" stroke="#2d2208" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M22 13.5C23.2 11.8 25.8 11.8 27 13.5" stroke="#2d2208" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M12 21.5C14.5 26.5 23.5 26.5 26 21.5" stroke="#2d2208" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

export default function TibbyFloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [usedTopics, setUsedTopics] = useState(new Set());
  const [showMoreTopics, setShowMoreTopics] = useState(false);
  const streamRef = useRef(null);

  const getTibbyAnswer = (query) => {
    const raw = query.trim();
    const q = raw.toLowerCase();

    // 1. GREETINGS & INTRODUCTIONS
    const isGreeting = /^(hi|hello|hey|hey\s*there|namaste|hola|good\s*morning|good\s*afternoon|good\s*evening|sup|yo|greetings)\b/i.test(q) ||
      q === "hi" || q === "hello" || q === "hey" || q === "who are you" || q === "what is this" || q === "what do you do" || q.includes("introduce yourself");

    if (isGreeting) {
      return "Hi there! I’m Tibby, your gut health guide at Third Biome. We are India’s 1st precision postbiotic brand, dedicated to direct cellular gut fueling with Biome Balance (pure GTB™ butyrate).\n\nYou can ask me about postbiotics, dosage, bloating, ingredients, or how our clinical research works!";
    }

    // 2. BRAND / WHO WE ARE
    if (q.includes("third biome") || q.includes("about your brand") || q.includes("about the brand") || q.includes("company") || q.includes("founder")) {
      return "Third Biome is India’s 1st precision postbiotic brand! We formulate clinically tested, doctor-designed postbiotic solutions (like Biome Balance with GTB™) manufactured in US FDA-registered, WHO-GMP certified facilities.";
    }

    // 3. STORAGE & REFRIGERATION
    if (q.includes("fridge") || q.includes("refrigerat") || q.includes("store") || q.includes("storage") || q.includes("temperature") || q.includes("heat") || q.includes("travel")) {
      return "No refrigeration needed! Unlike fragile live probiotics that degrade in warm weather, Biome Balance postbiotics are 100% shelf-stable and heat-resistant. Keep it in your bag, on your desk, or take it while traveling.";
    }

    // 4. DOSAGE & TIMING
    if (q.includes("when") || q.includes("time") || q.includes("morning") || q.includes("night") || q.includes("how to take") || q.includes("how many") || q.includes("dose") || q.includes("dosage") || q.includes("capsule")) {
      return "Take 2 capsules once a day, preferably in the morning with a glass of water or breakfast. Consistency is what yields the best long-term gut barrier repair!";
    }

    // 5. ANTIBIOTICS & MEDICATIONS
    if (q.includes("antibiotic") || q.includes("medicine") || q.includes("medication") || q.includes("drug") || q.includes("prescription")) {
      return "Yes, you can safely take Biome Balance with antibiotics! Live probiotics get wiped out by antibiotics, but postbiotics are non-living bioactive metabolites. They survive antibiotic courses and actively shield your gut lining.";
    }

    // 6. BLOATING, GAS & DIGESTION
    if (q.includes("bloat") || q.includes("gas") || q.includes("flatulence") || q.includes("cramp") || q.includes("digest") || q.includes("heavy") || q.includes("burp") || q.includes("balloon")) {
      return "Live probiotics often trigger gas and bloating because bacteria ferment in your gut. Biome Balance delivers pure finished butyrate directly—zero fermentation, calming bloating and gas from within.";
    }

    // 7. IBS, LEAKY GUT, ACIDITY, CONSTIPATION
    if (q.includes("ibs") || q.includes("leaky gut") || q.includes("acidity") || q.includes("constipat") || q.includes("diarrhea") || q.includes("gut barrier") || q.includes("lining") || q.includes("stomach pain")) {
      return "Biome Balance strengthens tight junctions in your gut lining, reducing intestinal permeability (leaky gut) and soothing inflammation. It helps normalize bowel regularity and eases chronic digestive sensitivity.";
    }

    // 8. TIMELINE & RESULTS
    if (q.includes("how long") || q.includes("result") || q.includes("soon") || q.includes("effect") || q.includes("work") || q.includes("when will") || q.includes("days") || q.includes("weeks")) {
      return "Most members notice easing in gas, bloating, and digestion within 7 to 14 days. Structural gut barrier repair, regular motility, and steady energy compound over 4 to 8 weeks of daily use.";
    }

    // 9. POSTBIOTIC VS PROBIOTIC VS PREBIOTIC
    if (q.includes("prebiotic") || q.includes("probiotic") || q.includes("postbiotic") || q.includes("difference") || q.includes("what is a postbiotic") || q.includes("what are postbiotics")) {
      return "Here’s how it works:\n• Prebiotics = Food for bacteria (fiber)\n• Probiotics = Live bacteria (easily killed by stomach acid)\n• Postbiotics (GTB™ Butyrate) = The actual healing fuel your gut cells need.\nWe deliver the pure postbiotic directly—no guessing, no fermentation!";
    }

    // 10. INGREDIENTS, VEGAN, GLUTEN, ALLERGENS & STANDARDS
    if (q.includes("vegan") || q.includes("gluten") || q.includes("dairy") || q.includes("allergen") || q.includes("ingredient") || q.includes("contain") || q.includes("safety") || q.includes("fssai") || q.includes("fda") || q.includes("gmp")) {
      return "Biome Balance is 100% vegan, gluten-free, dairy-free, allergen-free, and non-GMO. Formulated in plant-based delayed-release capsules at a US FDA-registered, WHO-GMP certified facility and approved by FSSAI.";
    }

    // 11. BRAIN FOG, MOOD & ENERGY
    if (q.includes("brain") || q.includes("mood") || q.includes("stress") || q.includes("energy") || q.includes("fog") || q.includes("tired") || q.includes("sleep") || q.includes("serotonin")) {
      return "Over 90% of your body’s serotonin is made in your gut! Butyrate fuels the gut lining to strengthen the gut-brain axis, soothing systemic inflammation and helping clear sluggish afternoon brain fog.";
    }

    // 12. SAFETY, SIDE EFFECTS & DEPENDENCY
    if (q.includes("safe") || q.includes("side effect") || q.includes("habit") || q.includes("depend") || q.includes("long term") || q.includes("daily")) {
      return "Biome Balance is 100% non-habit forming and safe for daily, continuous wellness. Butyrate is the primary natural fuel healthy colon cells consume every day.";
    }

    // 13. PRICING, BUY, ORDER, DISCOUNT & COUPON
    if (q.includes("price") || q.includes("cost") || q.includes("buy") || q.includes("order") || q.includes("discount") || q.includes("coupon") || q.includes("offer") || q.includes("rupee") || q.includes("₹") || q.includes("shipping")) {
      return "You can get Biome Balance on our product page in 1, 2, or 3-month bundles, with free shipping across India. Use discount code WELCOME200 at checkout for ₹200 off your first order!";
    }

    // 14. CLINICAL EVIDENCE / TRIALS
    if (q.includes("evidence") || q.includes("clinical") || q.includes("trial") || q.includes("study") || q.includes("science") || q.includes("rct") || q.includes("ctri")) {
      return "Third Biome is backed by a CTRI-registered, double-blinded randomized controlled trial (RCT) showing a +74% increase in stool butyrate in the GTB™ arm. We publish our limits, mechanisms, and findings openly.";
    }

    // 15. DOCTOR / MEDICAL ADVICE
    if (q.includes("doctor") || q.includes("pregnant") || q.includes("pregnancy") || q.includes("disease") || q.includes("cure")) {
      return "Tibby is a wellness guide, not a doctor. If you are pregnant, nursing, or managing a medical condition, we always recommend consulting your healthcare physician before beginning any new supplement.";
    }

    // 16. GENERAL GUT / HEALTH TERMS
    if (q.includes("gut") || q.includes("colon") || q.includes("microbiome") || q.includes("health") || q.includes("stomach") || q.includes("bowel") || q.includes("poop") || q.includes("stool") || q.includes("butyrate") || q.includes("gtb") || q.includes("balance")) {
      return "Biome Balance delivers targeted enteric postbiotics (GTB™ butyrate) directly to your lower gut to repair mucosal barriers and fuel colonocytes without gastric breakdown. What specific aspect of your gut health would you like to explore?";
    }

    // 17. OFF-TOPIC / UNRELATED / INVALID INPUT FALLBACK
    return "I’m specialized in gut health, postbiotics, and Third Biome!\n\nPlease ask a question related to Biome Balance, symptoms (like bloating, gas, energy), dosage, or how postbiotics work, and I'll be happy to help!";
  };

  const handleAskTopic = (topic) => {
    if (isTyping || usedTopics.has(topic.id)) return;

    setUsedTopics((prev) => new Set([...prev, topic.id]));

    // Add user question
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: "sunny",
      senderName: "YOU",
      text: topic.question
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `b_${Date.now()}`,
        sender: "tibby",
        senderName: "TIBBY",
        text: topic.answer
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: "sunny",
      senderName: "YOU",
      text: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const answer = getTibbyAnswer(text);

    setTimeout(() => {
      const botMsg = {
        id: `b_${Date.now()}`,
        sender: "tibby",
        senderName: "TIBBY",
        text: answer
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setUsedTopics(new Set());
    setIsTyping(false);
    if (streamRef.current) {
      streamRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (streamRef.current && isOpen) {
      streamRef.current.scrollTo({
        top: streamRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping, isOpen]);

  // Listen for manual trigger events to open chat from buttons
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("t3b:open-tibby-chat", handleOpenChat);
    return () => window.removeEventListener("t3b:open-tibby-chat", handleOpenChat);
  }, []);

  // Handle Escape key and body lock
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKeyDown = (e) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [isOpen]);

  const visibleTopics = showMoreTopics ? PRESET_TOPICS : PRESET_TOPICS.slice(0, 5);

  return (
    <>
      {/* Floating Bottom Right Button */}
      <div className="tibby-floating-trigger-wrap">
        <button
          type="button"
          className={`tibby-floating-trigger ${isOpen ? "is-active" : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Chat with Tibby"
        >
          <div className="tibby-floating-avatar">
            <img src={mascotImg} alt="Tibby Mascot" className="tibby-floating-img" />
            <span className="tibby-online-badge" />
          </div>
          <span className="tibby-floating-label">Ask Tibby</span>
        </button>
      </div>

      {/* Big Popup Modal in Front of Screen */}
      {isOpen && (
        <div
          className="tibby-popup-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="tibby-popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="tibby-popup-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Tibby Chat"
            >
              ✕
            </button>

            {/* Popup Header */}
            <div className="tibby-popup-header">
              <div className="tibby-popup-mascot-badge">
                <img src={mascotImg} alt="Tibby" className="tibby-popup-mascot-img" />
              </div>
              <div className="tibby-popup-title-wrap">
                <div className="tibby-popup-tag">
                  <span className="tibby-popup-dot" />
                  <span>MEET TIBBY · YOUR GUT BOT</span>
                </div>
                <h2>Why postbiotics skip the guesswork</h2>
                <p>A quick breakdown of how direct cellular fueling works.</p>
              </div>
            </div>

            {/* Scrollable Conversation Stream */}
            <div
              className="gut-chat__stream tibby-popup-stream"
              ref={streamRef}
              role="log"
              aria-live="polite"
            >
              {messages.map((msg) => {
                const isTibby = msg.sender === "tibby";
                return (
                  <div
                    key={msg.id}
                    className={`gut-chat__row gut-chat__row--${msg.sender}`}
                  >
                    <div className="gut-chat__sender-label">{msg.senderName}</div>
                    <div className="gut-chat__bubble-wrap">
                      {isTibby && <TibbyMascotAvatar />}
                      <div className={`gut-chat__bubble gut-chat__bubble--${msg.sender}`}>
                        {msg.text}
                      </div>
                      {!isTibby && <SunnyAvatar />}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="gut-chat__row gut-chat__row--tibby gut-chat__row--typing">
                  <div className="gut-chat__sender-label">TIBBY</div>
                  <div className="gut-chat__bubble-wrap">
                    <TibbyMascotAvatar />
                    <div className="gut-chat__bubble gut-chat__bubble--tibby gut-chat__bubble--dots">
                      <span className="gut-chat__dot-bounce" />
                      <span className="gut-chat__dot-bounce" />
                      <span className="gut-chat__dot-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Questions Footer */}
            <div className="gut-chat__footer tibby-popup-footer">
              <div className="gut-chat__prompts-label">
                <span>Ask Tibby anything:</span>
                {usedTopics.size > 0 && (
                  <button
                    type="button"
                    className="gut-chat__reset-btn"
                    onClick={handleReset}
                  >
                    Reset chat ↺
                  </button>
                )}
              </div>

              <div className="gut-chat__prompts">
                {visibleTopics.map((topic) => {
                  const isSelected = usedTopics.has(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`gut-chat__prompt-chip ${isSelected ? "is-used" : ""}`}
                      onClick={() => handleAskTopic(topic)}
                      disabled={isSelected || isTyping}
                    >
                      {topic.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="gut-chat__prompt-chip gut-chat__prompt-chip--more"
                  onClick={() => setShowMoreTopics((prev) => !prev)}
                >
                  {showMoreTopics ? "− Less" : "+ More"}
                </button>
              </div>

              {/* Disclaimer Note */}
              <p className="tibby-disclaimer-note">
                Tibby is a guide, not a doctor. For health worries, please see one.
              </p>

              {/* Chat Input Bar */}
              <form onSubmit={handleCustomSubmit} className="tibby-input-bar">
                <input
                  type="text"
                  className="tibby-input-field"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about pre, pro, postbiotics..."
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="tibby-send-btn"
                  disabled={!inputValue.trim() || isTyping}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
