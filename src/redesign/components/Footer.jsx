import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <div className="display">The Third Biome</div>
            <p>
              Trust the gut. Question the noise. The postbiotic revolution for
              modern guts.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/products/biome-balance">Biome Balance</Link>
            <Link to="/shop">Shop all</Link>
            <Link to="/t3b-club">T3B Club</Link>
            <Link to="/quiz">Find your formula</Link>
          </div>
          <div>
            <h4>Learn</h4>
            <Link to="/science">The science</Link>
            <Link to="/science#evidence">Our evidence</Link>
            <Link to="/help">Help &amp; FAQ</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About &amp; founders</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/account">Account</Link>
          </div>
        </div>
        <p className="foot__legal">
          Thirdbiome GTB™ is a patent-pending, micro-encapsulated glyceryl
          tributyrate that delivers butyrate to the colon. Manufactured in a US
          FDA-registered, WHO-GMP, ISO, HACCP &amp; Halal-certified facility;
          butyric acid / tributyrin hold GRAS status. Our randomised,
          double-blind trial is registered with the Clinical Trials Registry –
          India (CTRI/2025/09/094597). These statements describe ingredient
          mechanisms and have not been evaluated by a regulatory authority to
          diagnose, treat, cure or prevent any disease.
        </p>
        <div className="foot__bot">
          <span>© 2026 The Third Biome. All rights reserved.</span>
          <span>Made for modern guts · India</span>
        </div>
      </div>
    </footer>
  );
}
