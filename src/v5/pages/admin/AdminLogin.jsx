import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Seo from "../../components/Seo";
import { adminLogin, getAdminSession } from "../../../services/publicationService";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminSession().then((session) => {
      if (session) {
        navigate("/admin/publications", { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate("/admin/publications");
    } catch (err) {
      setError(err.message || "Failed to log in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Research Administrator Portal"
        description="Admin portal for Third Biome scientific publications."
        noindex={true}
      />
      <section className="sheet sheet--pad admin-login-sheet">
        <div className="wrap" style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div className="admin-login-card">
            <div className="admin-login-head">
              <span className="eyebrow dot-dark">Administrative Portal</span>
              <h1>Scientific Publications CMS</h1>
              <p>Sign in to manage published research, review drafts, and configure academic DOIs.</p>
            </div>

            {error && (
              <div className="admin-error-box" role="alert">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="admin-form-group">
                <label htmlFor="email">Admin Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@thirdbiome.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn btn--leaf admin-login-btn" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In to Publication CMS →"}
              </button>
            </form>

            <div className="admin-login-hint">
              <small>
                Default research administrator credentials available for local evaluation. Check system configuration.
              </small>
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Link to="/scientific-publications" style={{ fontSize: "0.84rem", color: "var(--ink-soft)" }}>
                ← Return to Public Research Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

