import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../cart/CartProvider";
import { NAV_LINKS, IMG } from "../data/content";
import { Arr } from "./ui";

/* active link helper */
const isLinkActive = (to, currentPath) => {
  if (to === "/") return currentPath === "/" || currentPath === "/home-v5";
  if (to === "/products/biome-balance") {
    return currentPath === "/products/biome-balance" || currentPath.startsWith("/products");
  }
  if (to === "/science") {
    return (
      currentPath === "/science" ||
      currentPath.startsWith("/science/") ||
      currentPath === "/scientific-publications" ||
      currentPath.startsWith("/scientific-publications/") ||
      currentPath.startsWith("/publications")
    );
  }
  return currentPath === to || currentPath.startsWith(`${to}/`);
};

const NavLink = ({ to, children, onClick, onMouseEnter, onMouseLeave, currentPath }) => {
  const active = isLinkActive(to, currentPath);
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={active ? "is-active" : undefined}
    >
      {children}
    </Link>
  );
};

export default function Nav() {
  const { count, openDrawer } = useCart();
  const [open, setOpen] = useState(false);
  const [scienceHover, setScienceHover] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const { pathname, hash } = useLocation();

  const handleScienceEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setScienceHover(true);
  };

  const handleScienceLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setScienceHover(false);
    }, 240);
  };

  useEffect(() => {
    setOpen(false);
    setScienceHover(false);
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 820) setOpen(false);
      if (window.innerWidth <= 980) setScienceHover(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setScienceHover(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <header className="nav">
        <div className="wrap nav__in">
          <Link className="nav__brand" to="/">
            <img className="nav__logo" src={IMG.logo} alt="Third Biome" /> Third Biome
          </Link>
          <nav className="nav__links">
            {NAV_LINKS.map(([to, label]) => (
              <NavLink
                key={label}
                to={to}
                currentPath={pathname}
                onMouseEnter={label === "Science" ? handleScienceEnter : undefined}
                onMouseLeave={label === "Science" ? handleScienceLeave : undefined}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav__right">
            <button className="nav__pill" onClick={openDrawer}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6 5 2H2" /><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></svg>
              Cart <sup>{count}</sup>
            </button>
            <button
              className={`nav__burger${open ? " on" : ""}`}
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            ><i></i><i></i><i></i></button>
          </div>
        </div>

        {/* HORIZONTAL SCIENCE MEGA MENU (Desktop Cursor Hover) */}
        <div
          className={`nav-mega-menu ${scienceHover ? "is-visible" : ""}`}
          onMouseEnter={handleScienceEnter}
          onMouseLeave={handleScienceLeave}
          role="region"
          aria-label="Science and Research Directory"
        >
          <div className="nav-mega-menu__inner">
            {/* COLUMN 1: OUR SCIENCE (Visual Cards with Thumbnails) */}
            <div className="nav-mega-menu__col">
              <span className="nav-mega-menu__eyebrow">OUR SCIENCE</span>
              <div className="nav-mega-menu__items">
                <Link
                  to="/science#mechanism"
                  className="nav-mega-menu__card-link"
                  onClick={() => setScienceHover(false)}
                >
                  <div className="nav-mega-menu__thumb">
                    <img src={IMG.microbes} alt="Microbiome science" />
                  </div>
                  <div>
                    <strong className="nav-mega-menu__title">Microbiome Science</strong>
                    <p className="nav-mega-menu__desc">Postbiotic biology & epithelial health.</p>
                  </div>
                </Link>

                <Link
                  to="/science#mechanism"
                  className="nav-mega-menu__card-link"
                  onClick={() => setScienceHover(false)}
                >
                  <div className="nav-mega-menu__thumb">
                    <img src={IMG.blogCapsules} alt="GTB Technology" />
                  </div>
                  <div>
                    <strong className="nav-mega-menu__title">Our Technology</strong>
                    <p className="nav-mega-menu__desc">Micro-encapsulated 100% colonic release.</p>
                  </div>
                </Link>

                <Link
                  to="/science#comparison"
                  className="nav-mega-menu__card-link"
                  onClick={() => setScienceHover(false)}
                >
                  <div className="nav-mega-menu__thumb">
                    <img src={IMG.blogLeaf} alt="Scientific Approach" />
                  </div>
                  <div>
                    <strong className="nav-mega-menu__title">Scientific Approach</strong>
                    <p className="nav-mega-menu__desc">Metabolite-first, precision physiology.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* COLUMN 2: RESEARCH & CLINICAL STUDIES */}
            <div className="nav-mega-menu__col">
              <span className="nav-mega-menu__eyebrow">RESEARCH</span>
              <div className="nav-mega-menu__text-links">
                <Link
                  to="/evidence"
                  className="nav-mega-menu__text-link"
                  onClick={() => setScienceHover(false)}
                >
                  <span className="nav-mega-menu__link-title">
                    Published Research <span aria-hidden="true">→</span>
                  </span>
                  <span className="nav-mega-menu__link-sub">Overview of research findings &amp; study results.</span>
                </Link>

                <Link
                  to="/evidence#clinical-trial"
                  className="nav-mega-menu__text-link"
                  onClick={() => setScienceHover(false)}
                >
                  <span className="nav-mega-menu__link-title">
                    Clinical Studies <span aria-hidden="true">→</span>
                  </span>
                  <span className="nav-mega-menu__link-sub">CTRI-registered clinical trial &amp; endpoints.</span>
                </Link>

                <Link
                  to="/scientific-publications"
                  className="nav-mega-menu__text-link"
                  onClick={() => setScienceHover(false)}
                >
                  <span className="nav-mega-menu__link-title">
                    Scientific Publications <span aria-hidden="true">→</span>
                  </span>
                  <span className="nav-mega-menu__link-sub">Peer-reviewed literature reviews &amp; open-access DOIs.</span>
                </Link>
              </div>

              {/* Reference Registry Strip */}
              <div className="nav-mega-menu__ref-block">
                <span className="nav-mega-menu__ref-head">CLINICAL REFERENCE REGISTRY</span>
                <div className="nav-mega-menu__ref-list">
                  <span>CTRI/2025/09/094597 · Randomised RCT</span>
                  <span>GTB™ 500 mg · Defined Daily Molecule</span>
                  <span>Gastric pH 1.5–3.5 Protected Matrix</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: FEATURED EXPLORE RESEARCH CARD */}
            <div className="nav-mega-menu__col nav-mega-menu__col--featured">
              <div className="nav-mega-menu__feat-card">
                <div className="nav-mega-menu__feat-top">
                  <span className="nav-mega-menu__feat-pill">Public Research Resource</span>
                  <h4 className="nav-mega-menu__feat-heading">Explore Our Research</h4>
                  <p className="nav-mega-menu__feat-lead">
                    Discover the scientific studies and published clinical research behind Third Biome.
                  </p>
                </div>

                <div className="nav-mega-menu__feat-bottom">
                  <Link
                    to="/scientific-publications"
                    className="nav-mega-menu__feat-btn"
                    onClick={() => setScienceHover(false)}
                  >
                    Explore Publications <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    to="/evidence"
                    className="nav-mega-menu__feat-secondary"
                    onClick={() => setScienceHover(false)}
                  >
                    View Evidence Dossier →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* menu drops in just below the pill, aligned to its edges (anchored inside
            the sticky nav so it tracks the pill at any scroll position) */}
        <div className={`navmenu${open ? " on" : ""}`} aria-hidden={!open}>
          <nav className="navmenu__links">
            {NAV_LINKS.map(([to, label]) => {
              if (label === "Science") {
                return (
                  <div key={label} className="navmenu__group">
                    <NavLink to={to} currentPath={pathname} onClick={() => setOpen(false)}>
                      {label}
                    </NavLink>
                    <div className="navmenu__sublinks">
                      <Link to="/evidence" onClick={() => setOpen(false)}>
                        • Published Research (Overview &amp; Results)
                      </Link>
                      <Link to="/evidence#clinical-trial" onClick={() => setOpen(false)}>
                        • Clinical Studies (CTRI-Registered Trial)
                      </Link>
                      <Link to="/scientific-publications" onClick={() => setOpen(false)}>
                        • Scientific Publications (Review Articles)
                      </Link>
                      <Link to="/science#mechanism" onClick={() => setOpen(false)}>
                        • GTB™ Delivery Technology
                      </Link>
                    </div>
                  </div>
                );
              }
              return (
                <NavLink key={label} to={to} currentPath={pathname} onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              );
            })}
            <NavLink to="/account" currentPath={pathname} onClick={() => setOpen(false)}>Account</NavLink>
          </nav>
          <Link className="btn btn--dark navmenu__cta" to="/products/biome-balance" onClick={() => setOpen(false)}>
            Shop Biome Balance <Arr />
          </Link>
        </div>
      </header>

      <div className={`navmenu-scrim${open ? " on" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
}
