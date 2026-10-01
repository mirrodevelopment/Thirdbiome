import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Botanicals } from "../components/Botanicals";
import { AccordionItem } from "../components/Accordion";

const TOPICS = [
  ["shield", "The product", "How it works, how to take it", "#product"],
  ["bag", "Orders & shipping", "Delivery, returns, COD", "#orders"],
  ["refresh", "Subscription & Club", "Skip, pause, cancel", "#subs"],
];

export default function Help() {
  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">Help &amp; FAQ</div>
          <h1 className="reveal">
            Straight answers,
            <br />
            <span className="em">no asterisks.</span>
          </h1>
          <p className="reveal">
            Everything about the product, the science, your order and your
            membership — answered plainly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="helptopics">
            {TOPICS.map(([ic, title, sub, href]) => (
              <a className="helptopic" href={href} key={title}>
                <span className="ic">
                  <Icon name={ic} size={20} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </span>
              </a>
            ))}
          </div>

          <div className="faqwrap">
            <div className="acc">
              <div className="head reveal" style={{ marginBottom: 8 }}>
                <div className="eyebrow" id="product">
                  The product
                </div>
              </div>
              <AccordionItem title="What exactly is Biome Balance?" defaultOpen>
                <p>
                  A postbiotic formula led by Thirdbiome GTB™ — a patent-pending,
                  pH-targeted, micro-encapsulated glyceryl tributyrate at 500 mg —
                  alongside L-Glutamine, peppermint and fennel. It carries butyrate
                  past the stomach and releases it at the colon — no live bacteria,
                  no filler.
                </p>
              </AccordionItem>
              <AccordionItem title="How is a postbiotic different from a probiotic?">
                <p>
                  Probiotics are live bacteria you hope will survive and colonise. A
                  postbiotic is the finished compound those bacteria would produce —
                  so it works on arrival, at a defined dose, without relying on your
                  existing microbiome. Some probiotic strains do help; this is
                  simply a more direct tool for the gut lining.
                </p>
              </AccordionItem>
              <AccordionItem title="How do I take it, and when will I notice?">
                <p>
                  One capsule a day, with or without food. Most members give it a
                  full 30 days. In our case studies, gas and bloating tend to ease
                  first (44–71%), with regularity improving in every case. These are
                  self-reported, and we say so.
                </p>
              </AccordionItem>
              <AccordionItem title="Is it safe? Any certifications?">
                <p>
                  Made in a US FDA-registered, WHO-GMP, ISO, HACCP &amp;
                  Halal-certified facility. Butyric acid / tributyrin hold GRAS
                  status. It’s vegetarian and clean-label. If you’re pregnant,
                  nursing or managing a condition, check with your doctor first — as
                  with any supplement.
                </p>
              </AccordionItem>

              <div className="head reveal" style={{ margin: "34px 0 8px" }}>
                <div className="eyebrow" id="orders">
                  Orders &amp; shipping
                </div>
              </div>
              <AccordionItem title="How fast do orders ship?">
                <p>
                  Orders ship within 24 hours, with 2–5 day delivery across India.
                  Free shipping over ₹999. COD is available.
                </p>
              </AccordionItem>
              <AccordionItem title="What's your returns policy?">
                <p>
                  We back every order with a 30-day promise. If something’s wrong
                  with your order, reach out and we’ll make it right.
                </p>
              </AccordionItem>

              <div className="head reveal" style={{ margin: "34px 0 8px" }}>
                <div className="eyebrow" id="subs">
                  Subscription &amp; T3B Club
                </div>
              </div>
              <AccordionItem title="Can I skip, pause or cancel?">
                <p>
                  Anytime, from your account. No lock-in, no phone calls, no guilt.
                  Membership is a commitment to your gut, not a contract you can’t
                  leave.
                </p>
              </AccordionItem>
              <AccordionItem title="What does the T3B Club add over a plain subscription?">
                <p>
                  A doctor-guided 90-day protocol, weekly check-ins with the science
                  in plain English, and direct access to our medical team — plus 20%
                  savings.{" "}
                  <Link className="tlink" to="/t3b-club">
                    See the Club
                  </Link>
                  .
                </p>
              </AccordionItem>
            </div>

            <div className="center" style={{ marginTop: 44 }}>
              <p style={{ color: "var(--ink-soft)" }}>Didn’t find your answer?</p>
              <Link className="btn" to="/contact" style={{ marginTop: 12 }}>
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
