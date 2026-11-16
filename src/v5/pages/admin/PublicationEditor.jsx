import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Seo from "../../components/Seo";
import {
  fetchPublicationByIdAdmin,
  savePublication,
  getAdminSession,
} from "../../../services/publicationService";

export default function PublicationEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    paperNumber: "04",
    title: "",
    subtitle: "",
    slug: "",
    articleType: "Review Article",
    badge: "Review Article",
    peerReviewed: true,
    authors: "",
    journal: "",
    publisher: "SAS Publishers",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    year: String(new Date().getFullYear()),
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    doiUrl: "",
    publisherUrl: "",
    pdfUrl: "",
    topic: "",
    category: "antibiotics",
    abstract: "",
    overview: "",
    keyFindings: [""],
    citation: "",
    status: "draft",
  });

  // Authentication & Prepopulation
  useEffect(() => {
    getAdminSession().then((session) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }

      if (isEditing) {
        fetchPublicationByIdAdmin(id)
          .then((pub) => {
            if (pub) {
              setFormData({
                ...pub,
                keyFindings:
                  pub.keyFindings && pub.keyFindings.length > 0
                    ? pub.keyFindings
                    : [""],
              });
            } else {
              setError("Publication not found with ID: " + id);
            }
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      }
    });
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Generate slug from title
  const handleGenerateSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  // Generate APA citation from metadata
  const handleGenerateCitation = () => {
    const authors = formData.authors || "Authors";
    const year = formData.year || "2026";
    const title = formData.title || "Title";
    const subtitle = formData.subtitle ? `: ${formData.subtitle}` : "";
    const journal = formData.journal || "Journal";
    const vol = formData.volume ? formData.volume : "";
    const issue = formData.issue ? `(${formData.issue})` : "";
    const pages = formData.pages ? `, ${formData.pages}` : "";
    const doi = formData.doi ? ` https://doi.org/${formData.doi}` : "";

    const generated = `${authors} (${year}). ${title}${subtitle}. ${journal}${vol ? `, ${vol}` : ""}${issue}${pages}.${doi}`;
    setFormData((prev) => ({ ...prev, citation: generated }));
  };

  // Key findings dynamic list handlers
  const handleFindingChange = (index, value) => {
    const updated = [...formData.keyFindings];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, keyFindings: updated }));
  };

  const handleAddFinding = () => {
    setFormData((prev) => ({
      ...prev,
      keyFindings: [...prev.keyFindings, ""],
    }));
  };

  const handleRemoveFinding = (index) => {
    const updated = formData.keyFindings.filter((_, idx) => idx !== index);
    setFormData((prev) => ({
      ...prev,
      keyFindings: updated.length > 0 ? updated : [""],
    }));
  };

  const handleSubmit = async (targetStatus) => {
    setError("");

    // Basic validation
    if (!formData.title.trim()) {
      setError("Please provide a publication title.");
      return;
    }
    if (!formData.slug.trim()) {
      setError("Please provide a URL slug (e.g., 'postbiotic-strategies').");
      return;
    }
    if (!formData.authors.trim()) {
      setError("Please provide author names.");
      return;
    }
    if (!formData.journal.trim()) {
      setError("Please enter the scientific journal name.");
      return;
    }
    if (!formData.doi.trim()) {
      setError("Please provide the official DOI identifier.");
      return;
    }
    if (!formData.abstract.trim()) {
      setError("Please provide the official journal abstract.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: targetStatus,
        keyFindings: formData.keyFindings.filter((f) => f.trim().length > 0),
        doiUrl:
          formData.doiUrl ||
          (formData.doi.startsWith("http")
            ? formData.doi
            : `https://doi.org/${formData.doi}`),
      };

      await savePublication(payload);
      navigate("/admin/publications");
    } catch (err) {
      setError(err.message || "Failed to save publication.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="sheet sheet--pad">
        <div className="wrap" style={{ textAlign: "center", padding: "60px 0" }}>
          <p>Loading publication data...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={`${isEditing ? "Edit" : "New"} Publication · Admin CMS`}
        description="Scientific Publication Editor."
        noindex={true}
      />

      <section className="sheet sheet--pad admin-editor-sheet">
        <div className="wrap" style={{ maxWidth: "980px", margin: "0 auto" }}>
          {/* Top Breadcrumb & Heading */}
          <div className="admin-editor-head">
            <Link to="/admin/publications" className="admin-back-link">
              ← Back to All Publications
            </Link>
            <div style={{ marginTop: 12 }}>
              <span className="eyebrow dot-dark">
                {isEditing ? `Editing Paper #${formData.paperNumber}` : "New Research Record"}
              </span>
              <h1 style={{ marginTop: 8 }}>
                {isEditing ? "Edit Scientific Publication" : "Add New Scientific Publication"}
              </h1>
            </div>
          </div>

          {error && (
            <div className="admin-error-box" role="alert" style={{ margin: "20px 0" }}>
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="admin-form-container">
            {/* SECTION 1: CORE ARTICLE IDENTITY */}
            <section className="admin-form-section">
              <div className="admin-form-section__header">
                <span className="admin-section-badge">01 · Article Identification &amp; URL</span>
              </div>

              <div className="admin-form-grid admin-form-grid--2">
                <div className="admin-form-group">
                  <label htmlFor="paperNumber">Paper Number Sequence *</label>
                  <input
                    id="paperNumber"
                    name="paperNumber"
                    type="text"
                    required
                    placeholder="e.g. 04"
                    value={formData.paperNumber}
                    onChange={handleChange}
                  />
                  <small>Displayed as "PAPER 01", "PAPER 02", etc.</small>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="articleType">Article Category *</label>
                  <select
                    id="articleType"
                    name="articleType"
                    value={formData.articleType}
                    onChange={handleChange}
                  >
                    <option value="Review Article">Review Article</option>
                    <option value="Research Article">Research Article</option>
                    <option value="Clinical Study">Clinical Study</option>
                    <option value="Systematic Review">Systematic Review</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="title">Complete Research Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g., Postbiotic Strategies after Antibiotic Exposure..."
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="subtitle">Subtitle / Research Angle</label>
                <input
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  placeholder="e.g., The Antibiotic Paradox, Butyrate-Producing Bacteria and Microbiome Recovery"
                  value={formData.subtitle}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="slug">Unique Webpage URL Slug *</label>
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="admin-inline-btn"
                  >
                    Auto-generate from Title
                  </button>
                </div>
                <div className="admin-slug-input-wrap">
                  <span className="admin-slug-prefix">/scientific-publications/</span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    placeholder="postbiotic-strategies-antibiotic-exposure"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>
                <small>This forms the permanent, canonical URL of this publication.</small>
              </div>

              <div className="admin-form-grid admin-form-grid--2">
                <div className="admin-form-group">
                  <label htmlFor="topic">Topic / Research Discipline</label>
                  <input
                    id="topic"
                    name="topic"
                    type="text"
                    placeholder="e.g., Antibiotic Disruption & Gut-Bladder Axis"
                    value={formData.topic}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="category">Category Filter Tag</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="antibiotics">Antibiotic Disruption</option>
                    <option value="pcos">Adolescent PCOS</option>
                    <option value="indian-phenotype">Indian Phenotype</option>
                    <option value="gastroenterology">Gastroenterology</option>
                    <option value="general">General Science</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2: BIBLIOGRAPHIC DETAILS */}
            <section className="admin-form-section">
              <div className="admin-form-section__header">
                <span className="admin-section-badge">02 · Official Publication &amp; DOI Details</span>
              </div>

              <div className="admin-form-group">
                <label htmlFor="authors">Official Authors *</label>
                <input
                  id="authors"
                  name="authors"
                  type="text"
                  required
                  placeholder="e.g., V. Ariarasudhan, Jayavardhini S."
                  value={formData.authors}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-grid admin-form-grid--2">
                <div className="admin-form-group">
                  <label htmlFor="journal">Journal Name *</label>
                  <input
                    id="journal"
                    name="journal"
                    type="text"
                    required
                    placeholder="e.g., Scholars Academic Journal of Biosciences"
                    value={formData.journal}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="publisher">Publisher</label>
                  <input
                    id="publisher"
                    name="publisher"
                    type="text"
                    placeholder="e.g., SAS Publishers"
                    value={formData.publisher}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-form-grid admin-form-grid--4">
                <div className="admin-form-group">
                  <label htmlFor="year">Year *</label>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    required
                    placeholder="2026"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="volume">Volume</label>
                  <input
                    id="volume"
                    name="volume"
                    type="text"
                    placeholder="14"
                    value={formData.volume}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="issue">Issue</label>
                  <input
                    id="issue"
                    name="issue"
                    type="text"
                    placeholder="10"
                    value={formData.issue}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="pages">Page Range</label>
                  <input
                    id="pages"
                    name="pages"
                    type="text"
                    placeholder="673–680"
                    value={formData.pages}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="date">Publication Date Display</label>
                <input
                  id="date"
                  name="date"
                  type="text"
                  placeholder="October 14, 2026"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-grid admin-form-grid--2">
                <div className="admin-form-group">
                  <label htmlFor="doi">Digital Object Identifier (DOI) *</label>
                  <input
                    id="doi"
                    name="doi"
                    type="text"
                    required
                    placeholder="10.36347/sajb.2026.v14i10.004"
                    value={formData.doi}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="publisherUrl">Publisher Article URL *</label>
                  <input
                    id="publisherUrl"
                    name="publisherUrl"
                    type="url"
                    required
                    placeholder="https://saspublishers.com/article/24991/"
                    value={formData.publisherUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: ABSTRACT & THIRD BIOME OVERVIEW */}
            <section className="admin-form-section">
              <div className="admin-form-section__header">
                <span className="admin-section-badge">03 · Official Abstract &amp; Third Biome Synthesis</span>
              </div>

              <div className="admin-form-group">
                <label htmlFor="abstract">
                  Official Abstract (From Publisher) *
                </label>
                <textarea
                  id="abstract"
                  name="abstract"
                  rows={6}
                  required
                  placeholder="Paste the official abstract verbatim as published in the scientific journal..."
                  value={formData.abstract}
                  onChange={handleChange}
                />
                <small>Always quote the verbatim abstract without marketing modifications.</small>
              </div>

              <div className="admin-form-group">
                <label htmlFor="overview">
                  Third Biome Research Overview (Plain English) *
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  rows={4}
                  required
                  placeholder="Explain the physiological context and relevance in accessible language..."
                  value={formData.overview}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Key Scientific Takeaways (Bullet Points)</label>
                {formData.keyFindings.map((finding, idx) => (
                  <div key={idx} className="admin-finding-row">
                    <input
                      type="text"
                      placeholder={`Finding ${idx + 1}: e.g. Colonization resistance breakdown...`}
                      value={finding}
                      onChange={(e) => handleFindingChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-remove-btn"
                      onClick={() => handleRemoveFinding(idx)}
                      title="Remove takeaway"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn--white admin-add-sub-btn"
                  onClick={handleAddFinding}
                >
                  + Add Takeaway Point
                </button>
              </div>

              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="citation">Academic Citation (APA Format) *</label>
                  <button
                    type="button"
                    onClick={handleGenerateCitation}
                    className="admin-inline-btn"
                  >
                    Auto-generate from Fields
                  </button>
                </div>
                <textarea
                  id="citation"
                  name="citation"
                  rows={3}
                  required
                  placeholder="V. Ariarasudhan and Jayavardhini S. (2026). Postbiotic Strategies..."
                  value={formData.citation}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* ACTION BUTTONS & STATUS CONTROLS */}
            <div className="admin-submit-bar">
              <div className="admin-submit-left">
                <button
                  type="button"
                  className="btn btn--white"
                  onClick={() => navigate("/admin/publications")}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>

              <div className="admin-submit-right">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => handleSubmit("draft")}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save as Draft"}
                </button>

                <button
                  type="button"
                  className="btn btn--leaf"
                  onClick={() => handleSubmit("published")}
                  disabled={saving}
                >
                  {saving ? "Publishing..." : "Publish to Website →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

