import { useState, useEffect } from "react";
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
  return currentPath === to || currentPath.startsWith(`${to}/`);
};

const NavLink = ({ to, children, onClick, currentPath }) => {
  const active = isLinkActive(to, currentPath);
  return (
    <Link to={to} onClick={onClick} className={active ? "is-active" : undefined}>
      {children}
    </Link>
  );
};

export default function Nav() {
  const { count, openDrawer } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname, hash]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 820) setOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
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
              <NavLink key={label} to={to} currentPath={pathname}>
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

        {/* menu drops in just below the pill, aligned to its edges (anchored inside
            the sticky nav so it tracks the pill at any scroll position) */}
        <div className={`navmenu${open ? " on" : ""}`} aria-hidden={!open}>
          <nav className="navmenu__links">
            {NAV_LINKS.map(([to, label]) => (
              <NavLink key={label} to={to} currentPath={pathname} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
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
