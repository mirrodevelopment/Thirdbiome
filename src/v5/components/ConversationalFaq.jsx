import React, { useState, useRef, useEffect } from "react";
import mascotImg from "../../assets/mascot.png";

const FAQ_CONVERSATIONS = [
  {
    id: "probiotic",
    q: "Is this a probiotic?",
    tibby: "No. Probiotics are live bacteria that have to survive, settle in, then make the good stuff. Biome Balance is the good stuff: butyrate delivered directly to your colon.",
    sunny: "Skipping straight to the good part. Respect."
  },
  {
    id: "timing",
    q: "When will I notice something?",
    tibby: "Most people feel gas and bloating ease within the first 7 to 14 days. Deeper gut barrier repair, regular motility, and sustained energy compound over 4 to 8 weeks.",
    sunny: "So less afternoon ballooning by next week. Deal."
  },
  {
    id: "supplements",
    q: "Can I take it with my other supplements?",
    tibby: "Yes! Unlike live probiotics that antibiotics and supplements can wipe out, postbiotics are non-living bioactive metabolites. They safely protect your gut lining alongside your routine.",
    sunny: "Zero supplement drama. Love that."
  },
  {
    id: "efficacy",
    q: "What if it doesn't work for me?",
    tibby: "Every gut microbiome is unique. That's why our clinical formula is backed by real RCT human trial data showing a 74% increase in gut butyrate levels and significant symptom relief.",
    sunny: "Real data beats marketing promises every time."
  },
  {
    id: "fridge",
    q: "Do I need to refrigerate it?",
    tibby: "Nope. Unlike fragile live bacteria that spoil in warm Indian weather, Biome Balance is 100% shelf-stable and heat-resistant. Toss it in your bag and go.",
    sunny: "Finally, a supplement that doesn't melt in my bag."
  },
  {
    id: "dietary",
    q: "Is it vegan and allergen-free?",
    tibby: "100% vegan, gluten-free, dairy-free, allergen-free, and non-GMO. Encapsulated in plant-based delayed-release shells.",
    sunny: "My sensitive stomach just breathed a sigh of relief."
  }
];

export const FaqTibbyAvatar = () => (
  <div className="conv-faq__avatar conv-faq__avatar--tibby" aria-hidden="true">
    <img src={mascotImg} alt="Tibby" className="conv-faq__avatar-img" />
  </div>
);

export const FaqSunnyAvatar = () => (
  <div className="conv-faq__avatar conv-faq__avatar--sunny" aria-hidden="true">
    <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="18" fill="#f3c445" />
      <path d="M11 13.5C12.2 11.8 14.8 11.8 16 13.5" stroke="#2d2208" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M22 13.5C23.2 11.8 25.8 11.8 27 13.5" stroke="#2d2208" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M12 21.5C14.5 26.5 23.5 26.5 26 21.5" stroke="#2d2208" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

function ConvFaqItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);

  return (
    <div className={`conv-faq__item ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="conv-faq__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="conv-faq__q-text">{item.q}</span>
        <span className="conv-faq__icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        ref={contentRef}
        className="conv-faq__body-wrap"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 300}px` : "0px"
        }}
      >
        <div className="conv-faq__body">
          {/* Tibby Bubble */}
          <div className="conv-faq__msg conv-faq__msg--tibby">
            <span className="conv-faq__sender-label">TIBBY</span>
            <div className="conv-faq__bubble-row">
              <FaqTibbyAvatar />
              <div className="conv-faq__bubble conv-faq__bubble--tibby">
                {item.tibby}
              </div>
            </div>
          </div>

          {/* Sunny Bubble */}
          <div className="conv-faq__msg conv-faq__msg--sunny">
            <span className="conv-faq__sender-label">SUNNY</span>
            <div className="conv-faq__bubble-row">
              <div className="conv-faq__bubble conv-faq__bubble--sunny">
                {item.sunny}
              </div>
              <FaqSunnyAvatar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConversationalFaq() {
  const [openId, setOpenId] = useState("probiotic");

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="sheet conv-faq-section" id="faq" data-screen-label="FAQ">
      <div className="wrap" data-reveal="">
        <div className="conv-faq-container">
          <div className="conv-faq-header">
            <span className="conv-faq-eyebrow">Good Questions</span>
            <h2>Frequently Asked Questions About Third Biome & Postbiotics</h2>
          </div>

          <div className="conv-faq__list">
            {FAQ_CONVERSATIONS.map((item) => (
              <ConvFaqItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
