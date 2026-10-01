import { Link } from "react-router-dom";
import { FOOT_COLS, IMG } from "../data/content";
import { Arr } from "./ui";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__top">
        <div>
          <div className="foot__brand">
            <img className="foot__logo" src={IMG.logo} alt="Third Biome" /> Third Biome
          </div>
          <p className="foot__tag">
            Trust the gut. Question the noise. India's first proprietary
            postbiotic, one honest ingredient, clinically studied.
          </p>
          <div style={{ marginTop: 22 }}>
            <Link className="btn btn--white" to="/products/biome-balance">
              Start your protocol <Arr />
            </Link>
          </div>
        </div>
        {FOOT_COLS.map(([head, links]) => (
          <div key={head}>
            <h4>{head}</h4>
            <ul>
              {links.map(([to, label], i) => (
                <li key={label + i}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="foot__bar">
        <span>© 2026 Third Biome · Made in India</span>
        <span>
          <Link to="/privacy-policy">Privacy</Link> · <Link to="/terms-of-service">Terms</Link> ·{" "}
          <a className="foot__calibr" href="https://calibrstudios.com" target="_blank" rel="noopener noreferrer">
            Built by Calibr
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" /><path d="M8 7h9v9" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
}
