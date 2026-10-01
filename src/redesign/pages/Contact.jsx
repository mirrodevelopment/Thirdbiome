import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Botanicals } from "../components/Botanicals";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">Contact</div>
          <h1 className="reveal">
            Ask us <span className="em">anything.</span>
          </h1>
          <p className="reveal">
            Real questions get real answers — including the inconvenient ones about
            evidence and limits. We’d rather earn your trust than dodge.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap contactgrid">
          <div className="reveal">
            {!sent ? (
              <form
                className="form"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="cf-row">
                  <label>
                    First name
                    <input type="text" name="first" placeholder="First name" required />
                  </label>
                  <label>
                    Last name
                    <input type="text" name="last" placeholder="Last name" />
                  </label>
                </div>
                <div className="cf-row">
                  <label>
                    Email
                    <input type="email" name="email" placeholder="you@email.com" required />
                  </label>
                  <label>
                    Topic
                    <select name="topic">
                      <option>My order</option>
                      <option>Subscription &amp; T3B Club</option>
                      <option>The science / evidence</option>
                      <option>Press &amp; partnerships</option>
                      <option>Something else</option>
                    </select>
                  </label>
                </div>
                <label>
                  Message
                  <textarea name="message" placeholder="How can we help?" required />
                </label>
                <button className="btn btn--lg" type="submit">
                  Send message
                </button>
              </form>
            ) : (
              <div className="formsuccess">
                <div className="ic">
                  <Icon name="check" size={26} sw={2.2} />
                </div>
                <h3>Message sent</h3>
                <p>Thanks — we’ll get back to you within one business day.</p>
              </div>
            )}
          </div>

          <aside className="contactinfo reveal">
            <div className="ciblock">
              <span className="lbl">Email</span>
              <a className="big tlink" href="mailto:hello@thirdbiome.in" style={{ border: "none" }}>
                hello@thirdbiome.in
              </a>
              <p>For orders, subscriptions and the science.</p>
            </div>
            <hr className="divider" />
            <div className="ciblock">
              <span className="lbl">WhatsApp</span>
              <div className="big">+91 90000 30000</div>
              <p>Mon–Sat, 10am–7pm IST.</p>
            </div>
            <hr className="divider" />
            <div className="ciblock">
              <span className="lbl">Based in</span>
              <div style={{ fontWeight: 500 }}>India · Made for modern guts</div>
              <p>DPIIT-registered startup · FSSAI-compliant.</p>
            </div>
            <hr className="divider" />
            <div className="ciblock">
              <span className="lbl">Looking for answers?</span>
              <p style={{ marginTop: 2 }}>
                <Link className="tlink" to="/help">
                  Browse the Help &amp; FAQ
                </Link>{" "}
                — most questions are covered there.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
