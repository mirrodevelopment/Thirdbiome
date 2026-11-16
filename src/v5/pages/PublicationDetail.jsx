import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Seo from "../components/Seo";
import { fetchPublicationBySlug, fetchRelatedPublications } from "../../services/publicationService";

export default function PublicationDetail() {
  const { slug } = useParams();
  const [paper, setPaper] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  // Fetch paper and related publications on slug change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);
    window.scrollTo(0, 0);

    fetchPublicationBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setPaper(data);
        return fetchRelatedPublications(data.slug);
      })
      .then((relData) => {
        if (!isMounted || !relData) return;
        setRelated(relData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading publication detail:", err);
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <article className="sheet sheet--pad pub-dossier" style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="wrap" style={{ textAlign: "center", color: "var(--ink-soft)" }}>
          <p>Loading research publication dossier...</p>
        </div>
      </article>
    );
  }

  if (notFound || !paper) {
    return <Navigate to="/scientific-publications" replace />;
  }

  const handleCopyAPA = () => {
    navigator.clipboard.writeText(paper.citation).then(() => {
      setCopiedType("apa");
      setTimeout(() => setCopiedType(null), 2400);
    });
  };

  const handleCopyBibTeX = () => {
    const bibtex = `@article{${paper.slug},
  author    = {${paper.authors.replace(", ", " and ")}},
  title     = {${paper.title}: ${paper.subtitle}},
  journal   = {${paper.journal}},
  year      = {${paper.year}},
  volume    = {${paper.volume}},
  number    = {${paper.issue}},
  pages     = {${paper.pages}},
  doi       = {${paper.doi}},
  publisher = {${paper.publisher}}
}`;
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopiedType("bibtex");
      setTimeout(() => setCopiedType(null), 2400);
    });
  };

  // Structured Data (Schema.org ScholarlyArticle & BreadcrumbList JSON-LD)
  const authorsArray = (paper.authors || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      "@type": "Person",
      name,
    }));

  const pageParts = (paper.pages || "").split(/[-–—]/).map((p) => p.trim());
  const pageStart = pageParts[0] || undefined;
  const pageEnd = pageParts[1] || undefined;

  // Dynamic ISO Publication Date for Schema.org and Open Graph
  let isoDate = "2026-10-14";
  try {
    const parsed = new Date(paper.date || paper.year);
    if (!isNaN(parsed.getTime())) {
      isoDate = parsed.toISOString().split("T")[0];
    }
  } catch {
    isoDate = `${paper.year || 2026}-10-14`;
  }

  const scholarlyArticleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        "@id": `https://thirdbiome.com/scientific-publications/${paper.slug}#article`,
        headline: paper.title,
        name: `${paper.title}: ${paper.subtitle}`,
        description: paper.overview || paper.abstract,
        inLanguage: "en",
        author: authorsArray,
        publisher: {
          "@type": "Organization",
          name: paper.publisher || "SAS Publishers",
          url: paper.publisherUrl || "https://saspublishers.com",
        },
        isPartOf: {
          "@type": "Periodical",
          name: paper.journal,
        },
        volumeNumber: paper.volume,
        issueNumber: paper.issue,
        pageStart,
        pageEnd,
        datePublished: isoDate,
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "doi",
            value: paper.doi,
          },
        ],
        sameAs: paper.doiUrl || `https://doi.org/${paper.doi}`,
        url: `https://thirdbiome.com/scientific-publications/${paper.slug}`,
        isAccessibleForFree: true,
        about: [
          {
            "@type": "Thing",
            name: "Gut Microbiome",
          },
          {
            "@type": "Thing",
            name: "Butyrate",
          },
          {
            "@type": "Thing",
            name: "Postbiotics",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://thirdbiome.com/scientific-publications/${paper.slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://thirdbiome.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Science",
            item: "https://thirdbiome.com/science",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Scientific Publications",
            item: "https://thirdbiome.com/scientific-publications",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `Paper ${paper.paperNumber}`,
            item: `https://thirdbiome.com/scientific-publications/${paper.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Seo
        title={`${paper.title} · Paper ${paper.paperNumber}`}
        description={`Explore this published review article on ${paper.title}: ${paper.subtitle}. Authors: ${paper.authors}. Published in ${paper.journal}, Vol. ${paper.volume}, Issue ${paper.issue}. DOI: ${paper.doi}.`}
        canonical={`https://thirdbiome.com/scientific-publications/${paper.slug}`}
        type="article"
        article={{
          publishedTime: `${isoDate}T00:00:00Z`,
          author: paper.authors,
          section: paper.topic || "Microbiome Science",
        }}
        schema={scholarlyArticleSchema}
      />

      {/* UNIFIED RESEARCH PUBLICATION DOSSIER */}
      <article className="sheet sheet--pad pub-dossier">
        <div className="wrap">
          {/* 01 · BREADCRUMB */}
          <nav className="pub-dossier__breadcrumb" aria-label="Breadcrumb">
            <ol className="pub-breadcrumb-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/science">Science</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/scientific-publications">Scientific Publications</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="is-current" aria-current="page">
                Paper {paper.paperNumber}
              </li>
            </ol>
          </nav>

          {/* 02, 03, 04 · ARTICLE HEADER & HERO */}
          <header className="pub-dossier__head">
            <div className="pub-dossier__badges">
              <span className="pub-badge pub-badge--num">PAPER {paper.paperNumber}</span>
              <span className="pub-badge pub-badge--review">{paper.articleType}</span>
              <span className="pub-badge pub-badge--peer">Peer-Reviewed</span>
              <span className="pub-badge pub-badge--open">Open Access DOI</span>
            </div>

            <h1 className="pub-dossier__title">{paper.title}</h1>
            <p className="pub-dossier__subtitle">{paper.subtitle}</p>

            <div className="pub-dossier__authors-row">
              <div className="pub-author-info">
                <span className="pub-author-lbl">Authors</span>
                <strong className="pub-author-names">{paper.authors}</strong>
              </div>
              <div className="pub-author-meta">
                <span>
                  Published online: <strong>{paper.date}</strong>
                </span>
                <span>
                  Category: <strong>{paper.topic}</strong>
                </span>
              </div>
            </div>
          </header>

          <hr className="pub-dossier__divider" />

          {/* 05, 06 · PUBLICATION INFORMATION & DOI BAR */}
          <section className="pub-dossier__meta-section" aria-label="Publication details and identifiers">
            <div className="pub-meta-grid">
              {/* Publication Information Table */}
              <div className="pub-meta-card">
                <div className="pub-meta-card__head">
                  <span className="pub-card-eyebrow">Bibliographic Record</span>
                  <h2 className="pub-meta-card__heading">Publication Information</h2>
                </div>
                <div className="pub-meta-table-wrap">
                  <table className="pub-meta-table">
                    <thead>
                      <tr>
                        <th>Detail</th>
                        <th>Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Authors</strong>
                        </td>
                        <td>{paper.authors}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Journal</strong>
                        </td>
                        <td>
                          <em>{paper.journal}</em>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Publisher</strong>
                        </td>
                        <td>{paper.publisher}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Publication Year</strong>
                        </td>
                        <td>{paper.year}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Volume</strong>
                        </td>
                        <td>{paper.volume}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Issue</strong>
                        </td>
                        <td>{paper.issue}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Pages</strong>
                        </td>
                        <td>{paper.pages}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Article Type</strong>
                        </td>
                        <td>
                          <span className="pub-tag-review">{paper.articleType}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital Object Identifier (DOI) Card */}
              <div className="pub-doi-card">
                <div>
                  <div className="pub-doi-card__head">
                    <span className="pub-doi-card__badge">Permanent Record</span>
                    <h3>Digital Object Identifier (DOI)</h3>
                  </div>

                  <div className="pub-doi-card__box">
                    <span className="pub-doi-code">{paper.doi}</span>
                    <p className="pub-doi-desc">Official publication identifier registered with CrossRef</p>
                  </div>
                </div>

                <div className="pub-doi-card__actions">
                  <a
                    href={paper.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--leaf pub-doi-btn"
                  >
                    Open Official DOI Record <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href={paper.publisherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--white pub-doi-btn"
                  >
                    Read on SAS Publishers <span aria-hidden="true">↗</span>
                  </a>
                </div>

                <div className="pub-doi-card__notice">
                  <small>
                    Identified as a peer-reviewed review article examining published literature. Distinct from
                    Third Biome’s registered clinical trial endpoints.
                  </small>
                </div>
              </div>
            </div>
          </section>

          <hr className="pub-dossier__divider" />

          {/* 07 · OFFICIAL ABSTRACT */}
          <section className="pub-dossier__section" id="abstract" aria-label="Official Abstract">
            <div className="pub-dossier__section-head">
              <span className="eyebrow dot-dark">Journal Document</span>
              <h2 className="pub-dossier__section-title">Official Abstract</h2>
              <span className="pub-dossier__source">Published in {paper.journal}</span>
            </div>

            <blockquote className="pub-dossier__abstract-quote">
              <p>{paper.abstract}</p>
            </blockquote>
          </section>

          <hr className="pub-dossier__divider" />

          {/* 08 · RESEARCH OVERVIEW & KEY TAKEAWAYS */}
          <section className="pub-dossier__section" id="overview" aria-label="Research Overview">
            <div className="pub-dossier__section-head">
              <span className="eyebrow">Scientific Synthesis</span>
              <h2 className="pub-dossier__section-title">Research Overview &amp; Clinical Context</h2>
              <p className="pub-dossier__lead-sub">
                Third Biome research summary translating peer-reviewed literature findings into physiological
                mechanisms.
              </p>
            </div>

            <div className="pub-dossier__overview-body">
              <p className="pub-dossier__overview-text">{paper.overview}</p>

              <div className="pub-findings-block">
                <h3 className="pub-findings-title">Key Scientific Takeaways:</h3>
                <div className="pub-findings-list">
                  {(paper.keyFindings || paper.highlights || []).map((finding, idx) => (
                    <div key={idx} className="pub-finding-item">
                      <span className="pub-finding-check" aria-hidden="true">
                        ✓
                      </span>
                      <div>
                        <p>{finding}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <hr className="pub-dossier__divider" />

          {/* 09, 10 · PUBLICATION REFERENCE & ACTIONS */}
          <section className="pub-dossier__citation-wrapper" id="citation" aria-label="Academic Reference">
            <div className="pub-citation-card">
              <div className="pub-citation-card__head">
                <span className="eyebrow" style={{ color: "var(--leaf)" }}>
                  Academic Reference
                </span>
                <h2>Publication Reference</h2>
                <p>Use the standard citation below when referencing this research in academic or clinical literature.</p>
              </div>

              <div className="pub-citation-text-box">
                <code>{paper.citation}</code>
              </div>

              <div className="pub-citation-actions">
                <button
                  type="button"
                  className="btn btn--leaf pub-cite-copy-btn"
                  onClick={handleCopyAPA}
                  aria-label="Copy APA reference to clipboard"
                >
                  {copiedType === "apa" ? "✓ APA Citation Copied!" : "Copy APA Reference"}
                </button>

                <button
                  type="button"
                  className="btn btn--white pub-cite-copy-btn"
                  onClick={handleCopyBibTeX}
                  aria-label="Copy BibTeX code to clipboard"
                >
                  {copiedType === "bibtex" ? "✓ BibTeX Copied!" : "Copy BibTeX Code"}
                </button>

                <a
                  href={paper.publisherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--dark pub-cite-copy-btn"
                >
                  Read Original Research Paper →
                </a>
              </div>
            </div>
          </section>
        </div>
      </article>

      {/* 11 · RELATED PUBLICATIONS (CROSS-LINKING) */}
      <section className="sheet sheet--pad pub-dossier-related">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Explore Publications</span>
              <h2 style={{ marginTop: 12 }}>Related Research Articles.</h2>
            </div>
            <p>Explore complementary peer-reviewed reviews on butyrate, short-chain fatty acids, and microbiome health.</p>
          </div>

          <div className="pub-related-grid">
            {related.map((relPaper) => (
              <article key={relPaper.slug} className="pub-related-card">
                <div className="pub-related-card__head">
                  <span className="pub-badge pub-badge--num">PAPER {relPaper.paperNumber}</span>
                  <span className="pub-badge pub-badge--review">{relPaper.articleType}</span>
                </div>
                <h3 className="pub-related-card__title">
                  <Link to={`/scientific-publications/${relPaper.slug}`}>{relPaper.title}</Link>
                </h3>
                <p className="pub-related-card__journal">
                  {relPaper.journal} · {relPaper.year}
                </p>
                <p className="pub-related-card__overview">{relPaper.overview}</p>
                <div className="pub-related-card__foot">
                  <Link to={`/scientific-publications/${relPaper.slug}`} className="pub-related-link">
                    Read Research Dossier →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="pub-back-hub">
            <Link to="/scientific-publications" className="btn btn--dark">
              ← Back to All Scientific Publications
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
