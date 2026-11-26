import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../../components/Seo";
import {
  fetchAllPublicationsAdmin,
  togglePublishStatus,
  deletePublication,
  getAdminSession,
  adminLogout,
} from "../../../services/publicationService";

export default function PublicationList() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
      } else {
        setUser(session);
        loadPapers();
      }
    });
  }, [navigate]);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPublicationsAdmin();
      setPapers(data || []);
    } catch (err) {
      console.error("Failed to load admin publications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  const handleToggle = async (paper) => {
    try {
      const updated = await togglePublishStatus(paper.id, paper.status);
      setPapers((prev) =>
        prev.map((p) => (p.id === paper.id ? { ...p, status: updated.status } : p))
      );
      showFlash(
        `Paper "${paper.title.slice(0, 32)}..." set to ${updated.status.toUpperCase()}.`
      );
    } catch (err) {
      alert("Error toggling publication status: " + err.message);
    }
  };

  const handleDelete = async (paper) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete publication:\n"${paper.title}"?\n\nThis cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deletePublication(paper.id);
      setPapers((prev) => prev.filter((p) => p.id !== paper.id));
      showFlash("Publication deleted successfully.");
    } catch (err) {
      alert("Error deleting publication: " + err.message);
    }
  };

  const showFlash = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 3500);
  };

  // Filter & Search logic
  const filteredPapers = papers.filter((p) => {
    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      p.title?.toLowerCase().includes(query) ||
      p.authors?.toLowerCase().includes(query) ||
      p.journal?.toLowerCase().includes(query) ||
      p.doi?.toLowerCase().includes(query) ||
      p.slug?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const totalCount = papers.length;
  const publishedCount = papers.filter((p) => p.status === "published").length;
  const draftCount = papers.filter((p) => p.status === "draft").length;

  return (
    <>
      <Seo
        title="Admin Publications CMS"
        description="Manage Third Biome scientific research papers."
        noindex={true}
      />

      <section className="sheet sheet--pad admin-dashboard-sheet">
        <div className="wrap">
          {/* Top Admin Navigation Bar */}
          <div className="admin-topbar">
            <div className="admin-topbar__left">
              <span className="eyebrow dot-dark">Administrative CMS</span>
              <h1 className="admin-topbar__title">Scientific Publications Repository</h1>
            </div>
            <div className="admin-topbar__right">
              <span className="admin-user-pill">
                👤 {user?.email || "Administrator"}
              </span>
              <button
                type="button"
                className="btn btn--glass admin-logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid var(--line)", paddingBottom: "12px", flexWrap: "wrap" }}>
            <Link
              to="/admin/publications"
              className="btn btn--dark"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              📄 Scientific Publications
            </Link>
            <Link
              to="/admin/checkout-settings"
              className="btn btn--ghost"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              💳 Checkout &amp; Payment Controls
            </Link>
            <Link
              to="/admin/orders"
              className="btn btn--ghost"
              style={{ fontSize: "0.88rem", padding: "8px 18px" }}
            >
              📦 Order Management
            </Link>
          </div>

          {actionMessage && (
            <div className="admin-flash-alert" role="status">
              <span>✓ {actionMessage}</span>
            </div>
          )}

          {/* Metrics Strip */}
          <div className="admin-metrics-row">
            <div className="admin-metric-card">
              <span className="admin-metric-card__val">{totalCount}</span>
              <span className="admin-metric-card__lbl">Total Records</span>
            </div>
            <div className="admin-metric-card admin-metric-card--published">
              <span className="admin-metric-card__val">{publishedCount}</span>
              <span className="admin-metric-card__lbl">Live on Website</span>
            </div>
            <div className="admin-metric-card admin-metric-card--draft">
              <span className="admin-metric-card__val">{draftCount}</span>
              <span className="admin-metric-card__lbl">Unpublished Drafts</span>
            </div>
            <div className="admin-metric-card admin-metric-card--action">
              <Link to="/admin/publications/new" className="btn btn--leaf admin-add-btn">
                + Add New Publication
              </Link>
            </div>
          </div>

          {/* Controls Bar: Search & Status Filters */}
          <div className="admin-controls-bar">
            <div className="admin-search-wrap">
              <input
                type="text"
                placeholder="Search by title, author, journal or DOI..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              {search && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="admin-filter-tabs">
              <button
                type="button"
                className={`admin-filter-tab ${
                  statusFilter === "all" ? "is-active" : ""
                }`}
                onClick={() => setStatusFilter("all")}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                className={`admin-filter-tab ${
                  statusFilter === "published" ? "is-active" : ""
                }`}
                onClick={() => setStatusFilter("published")}
              >
                Published ({publishedCount})
              </button>
              <button
                type="button"
                className={`admin-filter-tab ${
                  statusFilter === "draft" ? "is-active" : ""
                }`}
                onClick={() => setStatusFilter("draft")}
              >
                Drafts ({draftCount})
              </button>
            </div>
          </div>

          {/* Publications Table */}
          <div className="admin-table-container">
            {loading ? (
              <div className="admin-table-empty">
                <p>Loading publication records from database...</p>
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="admin-table-empty">
                <p>No publications match your criteria.</p>
                {search && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setSearch("")}
                    style={{ marginTop: 12 }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Paper #</th>
                    <th>Title &amp; Slug</th>
                    <th>Authors &amp; Journal</th>
                    <th>Official DOI</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.map((paper) => (
                    <tr key={paper.id}>
                      <td className="admin-cell-num">
                        <strong>#{paper.paperNumber}</strong>
                      </td>
                      <td className="admin-cell-title">
                        <strong className="admin-pub-title">{paper.title}</strong>
                        {paper.subtitle && (
                          <span className="admin-pub-sub">{paper.subtitle}</span>
                        )}
                        <span className="admin-pub-slug">
                          <code>/scientific-publications/{paper.slug}</code>
                        </span>
                      </td>
                      <td className="admin-cell-meta">
                        <span>{paper.authors}</span>
                        <small>{paper.journal} ({paper.year})</small>
                      </td>
                      <td className="admin-cell-doi">
                        <code>{paper.doi}</code>
                      </td>
                      <td className="admin-cell-status">
                        <span
                          className={`admin-status-badge admin-status-badge--${paper.status}`}
                        >
                          {paper.status === "published" ? "● Published" : "○ Draft"}
                        </span>
                      </td>
                      <td className="admin-cell-actions">
                        <div className="admin-actions-group">
                          {paper.status === "published" && (
                            <Link
                              to={`/scientific-publications/${paper.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-action-btn admin-action-btn--view"
                              title="View Live Page"
                            >
                              Live ↗
                            </Link>
                          )}
                          <Link
                            to={`/admin/publications/edit/${paper.id}`}
                            className="admin-action-btn admin-action-btn--edit"
                            title="Edit Publication"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn--toggle"
                            onClick={() => handleToggle(paper)}
                            title={
                              paper.status === "published"
                                ? "Unpublish (Save as Draft)"
                                : "Publish to Live Website"
                            }
                          >
                            {paper.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn--delete"
                            onClick={() => handleDelete(paper)}
                            title="Delete Record"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="admin-footer-strip">
            <Link to="/scientific-publications" className="admin-back-link">
              ← View Public Scientific Publications Directory
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

