import { useState } from "react";
import { Link } from "react-router-dom";
import { Arr } from "../components/ui";
import Seo from "../components/Seo";
import contactService from "../../services/contactService";

const TOPICS = [
  "My order / delivery",
  "Product & ingredient question",
  "The science / evidence",
  "T3B Club membership",
  "Press / partnership",
  "Something else",
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await contactService.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: topic,
        message: message.trim(),
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.message ||
          (typeof err === "string" ? err : "Something went wrong. Please try again, or email support@thirdbiome.com.")
      );
    }
  };

  return (
    <>
      <Seo title="Contact" description="Questions about your gut, your order, or the science? A real person on the Third Biome support team replies within 24 hours." />
      <section className="sheet v5-page" data-screen-label="Contact">
        <div className="wrap">
          <span className="eyebrow">We're a real team</span>
          <h1>Talk to <em>us.</em></h1>
          <p>Questions about your gut, your order, or the science? A real person on our support team replies within 24 hours, no bots, no runaround.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body" data-screen-label="Contact channels & form"><div className="wrap">
        <div className="v5-2col">
          <div>
            <span className="eyebrow">Fastest ways to reach us</span>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", margin: "12px 0 22px" }}>Pick whatever's easiest.</h2>
            <div className="v5-chan">
              <a href="https://wa.me/910000000000" aria-label="Chat on WhatsApp">
                <span className="v5-chan__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z"/></svg></span>
                <span><span className="v5-chan__t">Chat on WhatsApp</span><span className="v5-chan__s">Placeholder, +91 00000 00000 · fastest, Mon-Sat 10am-7pm</span></span>
                <span className="v5-chan__go"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
              </a>
              <a href="mailto:support@thirdbiome.com" aria-label="Email support">
                <span className="v5-chan__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span>
                <span><span className="v5-chan__t">support@thirdbiome.com</span><span className="v5-chan__s">Placeholder address · replies within 24 hours</span></span>
                <span className="v5-chan__go"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
              </a>
              <Link to="/account" aria-label="Track your order">
                <span className="v5-chan__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 4v4"/></svg></span>
                <span><span className="v5-chan__t">Track your order</span><span className="v5-chan__s">See status & delivery estimate in your account</span></span>
                <span className="v5-chan__go"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
              </Link>
            </div>
            <div style={{ marginTop: "22px", display: "grid", gap: "6px", fontSize: ".9rem", color: "var(--ink-soft)" }}>
              <div><b style={{ color: "var(--ink)" }}>Registered office</b>, Peelamedu, Coimbatore - 641004, Tamil Nadu, India</div>
              <div><b style={{ color: "var(--ink)" }}>Support hours</b>, Mon-Sat, 10:00-19:00 IST</div>
              <div><b style={{ color: "var(--ink)" }}>Media & partnerships</b>, hello@thirdbiome.com (placeholder)</div>
            </div>
          </div>

          <div className="v5-formcard">
            {status !== "sent" && (
              <form id="contactForm" onSubmit={handleSubmit}>
                <span className="eyebrow">Send a message</span>
                <h2 style={{ fontSize: "clamp(1.5rem,2.6vw,2rem)", margin: "12px 0 20px" }}>Write to us directly.</h2>
                <div className="v5-2col" style={{ gap: "14px" }}>
                  <div className="v5-field"><label htmlFor="cf-name">Name</label><input className="v5-input" id="cf-name" type="text" placeholder="Your name" required value={name} onChange={(e) => setName(e.target.value)} disabled={status === "sending"} /></div>
                  <div className="v5-field"><label htmlFor="cf-email">Email</label><input className="v5-input" id="cf-email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "sending"} /></div>
                </div>
                <div className="v5-field"><label htmlFor="cf-topic">Topic</label>
                  <select className="v5-select" id="cf-topic" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={status === "sending"}>
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="v5-field"><label htmlFor="cf-msg">Message</label><textarea className="v5-textarea" id="cf-msg" placeholder="How can we help?" required value={message} onChange={(e) => setMessage(e.target.value)} disabled={status === "sending"}></textarea></div>
                <button className="btn btn--dark" type="submit" style={{ width: "100%" }} disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"} <Arr /></button>
                {status === "error" && (
                  <p style={{ fontSize: ".82rem", color: "#b3261e", marginTop: "12px", textAlign: "center" }}>{errorMsg}</p>
                )}
                <p style={{ fontFamily: "var(--mono)", fontSize: ".62rem", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: "12px", textAlign: "center" }}>No spam. A real person replies within 24 hours.</p>
              </form>
            )}
            {status === "sent" && (
              <div className="v5-form-ok on" id="contactOk"><h3>Message sent ✓</h3><p style={{ color: "var(--ink-soft)" }}>Thanks, we'll get back to you within 24 hours.</p></div>
            )}
          </div>
        </div>
      </div></section>

      <section className="sheet sheet--pad" style={{ textAlign: "center" }} data-screen-label="Contact CTA"><div className="wrap">
        <span className="eyebrow" style={{ justifyContent: "center" }}>Still deciding?</span>
        <h2 style={{ margin: "14px auto 18px", maxWidth: "20ch", fontSize: "clamp(1.8rem,3.6vw,2.8rem)" }}>Take the 30-second finder<br />and we'll point you to the right start.</h2>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
          <Link className="btn btn--dark" to="/quiz">Find your fit →</Link>
          <Link className="btn" to="/products/biome-balance">Shop Biome Balance</Link>
        </div>
      </div></section>
    </>
  );
}
