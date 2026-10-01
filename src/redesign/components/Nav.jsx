import { Link, NavLink } from "react-router-dom";
import { Icon, Logo } from "./Icon";
import { useCart } from "../cart/CartContext";

export const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/science", label: "The science" },
  { to: "/quiz", label: "Gut quiz" },
  { to: "/about", label: "About" },
  { to: "/t3b-club", label: "T3B Club" },
];

export function Nav({ onBurger }) {
  const { count, openCart } = useCart();

  return (
    <header className="nav" id="nav">
      <div className="wrap nav__in">
        <Link className="nav__logo" to="/">
          <Logo />
          <span>
            The Third Biome<small>the postbiotic revolution</small>
          </span>
        </Link>
        <nav className="nav__links">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to}>
              {l.label}
            </NavLink>
          ))}
          <button className="nav__cart" onClick={openCart} aria-label="Open cart">
            <Icon name="cart" size={18} sw={2} />
            <span>{count}</span>
          </button>
        </nav>
        <button className="nav__burger" aria-label="Menu" onClick={onBurger}>
          <Icon name="menu" size={26} sw={2.2} />
        </button>
      </div>
    </header>
  );
}
