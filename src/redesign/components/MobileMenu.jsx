import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { NAV_LINKS } from "./Nav";

const EXTRA = [
  { to: "/account", label: "Account" },
  { to: "/help", label: "Help" },
  { to: "/contact", label: "Contact" },
];

export function MobileMenu({ open, onClose }) {
  // lock scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`mmenu${open ? " open" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mmenu__panel">
        <button className="mmenu__close" aria-label="Close" onClick={onClose}>
          <Icon name="close" size={26} sw={2.2} />
        </button>
        <nav>
          {[...NAV_LINKS, ...EXTRA].map((l) => (
            <Link key={l.to} to={l.to} onClick={onClose}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          className="btn btn--lg"
          to="/shop"
          onClick={onClose}
          style={{ marginTop: 24, justifyContent: "center" }}
        >
          Shop Biome Balance
        </Link>
      </div>
    </div>
  );
}
