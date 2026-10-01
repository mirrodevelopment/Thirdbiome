import { useState } from "react";
import { Icon, Logo } from "../components/Icon";
import { useCart } from "../cart/CartContext";

export default function Account() {
  const { toast } = useCart();
  const [mode, setMode] = useState("login");

  const onSubmit = (e) => {
    e.preventDefault();
    toast(mode === "signup" ? "Account created (demo)" : "Signed in (demo)");
  };

  return (
    <main>
      <div className="acctwrap">
        <div className="acctcard">
          <div className="acctcard__head">
            <Logo size={34} />
            <h1>{mode === "signup" ? "Join The Third Biome" : "Welcome back"}</h1>
            <div className="accttabs">
              <button className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>
                Sign in
              </button>
              <button className={mode === "signup" ? "on" : ""} onClick={() => setMode("signup")}>
                Create account
              </button>
            </div>
          </div>

          <form className="form" onSubmit={onSubmit} noValidate>
            {mode === "signup" && (
              <label>
                Full name
                <input type="text" name="name" placeholder="Your name" autoComplete="name" />
              </label>
            )}
            <label>
              Email
              <input type="email" name="email" placeholder="you@email.com" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
            </label>
            {mode === "login" && (
              <a
                className="tlink"
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ border: "none", fontWeight: 500, fontSize: ".82rem", color: "var(--ink-soft)" }}
              >
                Forgot password?
              </a>
            )}
            <button className="btn btn--lg" type="submit">
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="acctperks">
            <div className="lbl">Member perks</div>
            <ul>
              <li>
                <Icon name="check" size={16} sw={2.4} /> Manage your subscription &amp; skip
                or pause anytime
              </li>
              <li>
                <Icon name="check" size={16} sw={2.4} /> Track orders &amp; your 90-day
                protocol
              </li>
              <li>
                <Icon name="check" size={16} sw={2.4} /> Early access to formulas in
                development
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
