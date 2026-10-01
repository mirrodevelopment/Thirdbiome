import { Link } from "react-router-dom";
import { Botanicals } from "../components/Botanicals";

/**
 * Temporary page for routes still being built out in the redesign.
 * Uses the real page-hero chrome so navigation/preview feels complete.
 */
export default function Placeholder({ title }) {
  return (
    <main>
      <section className="phero">
        <Botanicals />
        <div className="wrap">
          <div className="kicker reveal">The Third Biome</div>
          <h1 className="reveal">
            {title} <span className="em">— coming together.</span>
          </h1>
          <p className="reveal">
            This page is being rebuilt in the new design system. The global
            chrome, cart, and Home are live — the rest land next.
          </p>
          <div className="phero__cta reveal">
            <Link className="btn btn--lg" to="/">
              Back to home
            </Link>
            <Link className="btn btn--ghost btn--lg" to="/shop">
              Shop Biome Balance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
