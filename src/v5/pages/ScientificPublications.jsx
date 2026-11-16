import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { IMG } from "../data/content";
import { fetchPublishedPublications } from "../../services/publicationService";

const RESEARCH_PILLARS = [
  {
    num: "01",
    title: "Butyrate & Short-Chain Fatty Acids",
    desc: "Exploring the role of short-chain fatty acids, particularly butyrate, in microbial metabolism, intestinal function and host–microbiome interactions.",
    tag: "Metabolic Signaling",
  },
  {
    num: "02",
    title: "Gut Microbiome & Microbial Balance",
    desc: "Understanding the relationship between microbial diversity, beneficial bacteria and changes in the intestinal microbial ecosystem.",
    tag: "Ecosystem Diversity",
  },
  {
    num: "03",
    title: "Postbiotic Research",
    desc: "Investigating microbial metabolites and postbiotic approaches as an area of emerging scientific interest in microbiome research.",
    tag: "Metabolite Biology",
  },
  {
    num: "04",
    title: "Targeted Delivery Technology",
    desc: "Exploring formulation and delivery strategies designed to support the targeted release of active ingredients within the digestive system.",
    tag: "Pharmacokinetics",
  },
];

export default function ScientificPublications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchPublishedPublications(activeFilter)
      .then((data) => {
        if (isMounted) {
          setPapers(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading publications:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  const handleCopyCitation = (paper) => {
    const citation = `${paper.authors} (2026). ${paper.title}. ${paper.journal}, ${paper.volume}(${paper.issue}), ${paper.pages}. https://doi.org/${paper.doi}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(paper.id || paper.slug);
      setTimeout(() => setCopiedId(null), 2400);
    });
  };

  return (
    <>
      <Seo
        title="Scientific Publications &amp; Research Library"
        description="Explore Third Biome's peer-reviewed literature reviews, published research on butyrate, short-chain fatty acids, microbiome recovery, and postbiotic delivery."
        canonical="https://thirdbiome.com/scientific-publications"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": "https://thirdbiome.com/scientific-publications#collection",
              name: "Third Biome Scientific Publications & Research Library",
              description:
                "Public scientific repository of peer-reviewed reviews, butyrate metabolism, and microbiome research.",
              url: "https://thirdbiome.com/scientific-publications",
              isPartOf: {
                "@type": "WebSite",
                name: "Third Biome",
                url: "https://thirdbiome.com",
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://thirdbiome.com/scientific-publications#breadcrumb",
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
              ],
            },
          ],
        }}
      />

      {/* 01 · HERO & REPOSITORY MISSION */}
      <section className="sheet sheet--pad sci-pub-hero">
        <div className="wrap">
          <div className="sci-pub-hero__top">
            <span className="eyebrow dot-dark">Scientific Publications · Peer-Reviewed Repository</span>
            <span className="sci-pub-hero__badge">Open Science Initiative</span>
          </div>

          <h1 className="sci-pub-hero__title">
            Advancing Microbiome Science<br />
            <em>Through Peer-Reviewed Research.</em>
          </h1>

          <p className="sci-pub-hero__lead">
            At Third Biome, we believe that a deeper understanding of the human microbiome begins with scientific
            exploration. Our research focuses on the relationship between gut microorganisms, microbial
            metabolites, butyrate, and human health.
          </p>

          <p className="sci-pub-hero__sublead">
            Through scientific literature, microbiome research, and emerging postbiotic strategies, we explore how
            microbial activity and targeted delivery approaches contribute to intestinal health. Explore our published
            research and discover the science behind our approach.
          </p>

          {/* Quick Metrics Bar */}
          <div className="sci-pub-metrics">
            <div className="sci-pub-metric">
              <span className="sci-pub-metric__val">3</span>
              <span className="sci-pub-metric__lbl">Peer-Reviewed Reviews</span>
            </div>
            <div className="sci-pub-metric">
              <span className="sci-pub-metric__val">100%</span>
              <span className="sci-pub-metric__lbl">Open Access DOI Verified</span>
            </div>
            <div className="sci-pub-metric">
              <span className="sci-pub-metric__val">45 Days</span>
              <span className="sci-pub-metric__lbl">Registered Human RCT Protocol</span>
            </div>
            <div className="sci-pub-metric">
              <span className="sci-pub-metric__val">CTRI</span>
              <span className="sci-pub-metric__lbl">Clinical Registry India Indexed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · RESEARCH PILLARS */}
      <section className="sheet sheet--pad sci-pub-pillars-section" id="research-areas">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Our Research</span>
              <h2 style={{ marginTop: 14 }}>Exploring the Science Behind the Microbiome.</h2>
            </div>
            <p>
              The gut microbiome is a complex ecosystem of microorganisms that plays an essential role in human
              physiology. Our research interests explore several interconnected areas of microbiome science.
            </p>
          </div>

          <div className="sci-pub-pillars-grid">
            {RESEARCH_PILLARS.map((pillar) => (
              <article key={pillar.num} className="sci-pub-pillar-card">
                <div className="sci-pub-pillar-card__top">
                  <span className="sci-pub-pillar-card__num">{pillar.num}</span>
                  <span className="sci-pub-pillar-card__tag">{pillar.tag}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · PUBLISHED SCIENTIFIC LITERATURE */}
      <section className="sheet sheet--pad sci-pub-papers-section" id="publications">
        <div className="wrap">
          <div className="sci-pub-papers-head">
            <div>
              <span className="eyebrow">Published Research</span>
              <h2 style={{ marginTop: 14 }}>Scientific Literature &amp; Publications.</h2>
              <p className="sci-pub-papers-lead">
                Explore published scientific literature examining the relationship between butyrate, postbiotic
                strategies, gut microbiome composition, and human health.
              </p>
            </div>

            {/* Topic Filter Pills */}
            <div className="sci-pub-filters" role="tablist" aria-label="Filter publications by topic">
              <button
                type="button"
                className={`sci-pub-filter-btn ${activeFilter === "all" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Papers
              </button>
              <button
                type="button"
                className={`sci-pub-filter-btn ${activeFilter === "antibiotics" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("antibiotics")}
              >
                Antibiotic Disruption
              </button>
              <button
                type="button"
                className={`sci-pub-filter-btn ${activeFilter === "pcos" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("pcos")}
              >
                Adolescent PCOS
              </button>
              <button
                type="button"
                className={`sci-pub-filter-btn ${activeFilter === "indian-phenotype" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("indian-phenotype")}
              >
                Indian Phenotype
              </button>
            </div>
          </div>

          {/* Academic Paper Cards */}
          <div className="sci-pub-papers-list">
            {loading ? (
              <div className="sci-pub-loading-state" style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-soft)" }}>
                Loading scientific publications...
              </div>
            ) : papers.length === 0 ? (
              <div className="sci-pub-empty-state" style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-soft)" }}>
                No publications found under this category.
              </div>
            ) : (
              papers.map((paper) => (
                <article key={paper.id || paper.slug} className="sci-pub-paper-card">
                {/* Header Metadata Bar */}
                <div className="sci-pub-paper-card__head">
                  <div className="sci-pub-paper-card__badges">
                    <span className="sci-pub-badge sci-pub-badge--num">PAPER {paper.paperNumber}</span>
                    <span className="sci-pub-badge sci-pub-badge--type">{paper.articleType}</span>
                    <span className="sci-pub-badge sci-pub-badge--peer">Peer-Reviewed</span>
                  </div>
                  <span className="sci-pub-paper-card__date">{paper.date}</span>
                </div>

                {/* Paper Title */}
                <h3 className="sci-pub-paper-card__title">
                  <Link to={`/scientific-publications/${paper.slug}`} className="sci-pub-title-link">
                    {paper.title}
                  </Link>
                </h3>

                {/* Author byline */}
                <div className="sci-pub-paper-card__authors">
                  <strong>Authors:</strong> <span>{paper.authors}</span>
                </div>

                {/* Journal & Citation Grid */}
                <div className="sci-pub-citation-grid">
                  <div className="sci-pub-cite-item">
                    <span className="sci-pub-cite-lbl">Journal</span>
                    <b>{paper.journal}</b>
                  </div>
                  <div className="sci-pub-cite-item">
                    <span className="sci-pub-cite-lbl">Volume &amp; Issue</span>
                    <b>Vol. {paper.volume} | Issue {paper.issue}</b>
                  </div>
                  <div className="sci-pub-cite-item">
                    <span className="sci-pub-cite-lbl">Pages</span>
                    <b>pp. {paper.pages}</b>
                  </div>
                  <div className="sci-pub-cite-item sci-pub-cite-item--doi">
                    <span className="sci-pub-cite-lbl">DOI</span>
                    <a
                      href={paper.doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sci-pub-doi-link"
                    >
                      {paper.doi} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>

                {/* Research Overview */}
                <div className="sci-pub-overview-box">
                  <span className="sci-pub-overview-title">Research Overview:</span>
                  <p>{paper.overview}</p>

                  <div className="sci-pub-highlights">
                    {(paper.highlights || paper.keyFindings || []).map((item, idx) => (
                      <div key={idx} className="sci-pub-highlight-row">
                        <span className="sci-pub-highlight-dot">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Bar: Direct Publisher Link + Copy Citation */}
                <div className="sci-pub-paper-card__actions">
                  <Link
                    to={`/scientific-publications/${paper.slug}`}
                    className="btn btn--leaf sci-pub-action-btn"
                  >
                    Read Research Dossier <span aria-hidden="true">→</span>
                  </Link>

                  <a
                    href={paper.publisherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--dark sci-pub-action-btn"
                  >
                    Original Publication <span aria-hidden="true">↗</span>
                  </a>

                  <a
                    href={paper.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--glass sci-pub-action-btn"
                  >
                    DOI Record <span aria-hidden="true">↗</span>
                  </a>

                  <button
                    type="button"
                    className="sci-pub-copy-btn"
                    onClick={() => handleCopyCitation(paper)}
                    aria-label="Copy APA citation to clipboard"
                  >
                    {copiedId === (paper.id || paper.slug) ? (
                      <>
                        <span style={{ color: "var(--green-d)" }}>✓ Citation Copied</span>
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy Citation (APA)
                      </>
                    )}
                  </button>
                </div>
              </article>
            )))}
          </div>
        </div>
      </section>

      {/* 04 · CLINICAL RESEARCH & SCIENTIFIC EVIDENCE DEMARCATION */}
      <section className="sheet sheet--pad sci-pub-evidence-framework" id="clinical-evidence">
        <div className="wrap">
          <div className="sci-pub-demarcation-card">
            <div className="sci-pub-demarcation-card__header">
              <span className="eyebrow" style={{ color: "var(--leaf)" }}>Scientific Integrity &amp; Transparency</span>
              <h2>Clinical Research &amp; Scientific Evidence</h2>
              <p>
                Scientific research provides an evolving understanding of the relationship between the gut microbiome,
                microbial metabolites, and human health. To maintain the highest standard of scientific integrity,
                Third Biome distinguishes between <strong>published literature reviews</strong> and{" "}
                <strong>original human clinical trial endpoints</strong>.
              </p>
            </div>

            <div className="sci-pub-demarcation-grid">
              <div className="sci-pub-demarcation-col">
                <span className="sci-pub-col-badge">Published Scientific Literature</span>
                <h4>Peer-Reviewed Review Articles</h4>
                <p>
                  Comprehensive academic syntheses published in scientific journals analyzing microbial pathways,
                  antibiotic recovery paradigms, and population-specific phenotypes.
                </p>
                <ul className="sci-pub-checklist">
                  <li>Literature analysis across hundreds of cited microbiological studies.</li>
                  <li>Theoretical frameworks including the Capacity-Substrate Mismatch Hypothesis.</li>
                  <li>Publicly accessible via independent publisher DOI registries.</li>
                </ul>
              </div>

              <div className="sci-pub-demarcation-col sci-pub-demarcation-col--trial">
                <span className="sci-pub-col-badge sci-pub-col-badge--trial">Original Clinical Trial</span>
                <h4>CTRI-Registered Human Trial</h4>
                <p>
                  Our 45-day randomised, double-blind clinical trial evaluating the daily GTB™ protocol.
                  Registered with the Clinical Trials Registry - India.
                </p>
                <ul className="sci-pub-checklist">
                  <li><strong>Trial Registration:</strong> CTRI/2025/09/094597</li>
                  <li><strong>Primary Biomarker:</strong> +74% Stool Butyrate increase in GTB arm.</li>
                  <li><strong>Endpoints:</strong> Statistically significant improvement in digestive, energy, and sleep domains.</li>
                </ul>
                <div style={{ marginTop: 18 }}>
                  <Link to="/evidence#clinical-trial" className="btn btn--leaf" style={{ fontSize: "0.84rem" }}>
                    View Clinical Trial Dossier <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Scope of Scientific Interest */}
            <div className="sci-pub-interest-strip">
              <span className="sci-pub-interest-title">Core Areas of Scientific Inquiry:</span>
              <div className="sci-pub-interest-chips">
                <span>Microbial diversity &amp; ecosystem balance</span>
                <span>Butyrate production &amp; SCFA metabolism</span>
                <span>Microbiome recovery post-antibiotics</span>
                <span>Targeted ingredient delivery &amp; lipid matrices</span>
                <span>Gut-brain &amp; gut-endocrine physiological axes</span>
              </div>
            </div>

            <p className="sci-pub-disclaimer">
              We aim to make relevant scientific literature and research information accessible to healthcare
              professionals, researchers, and individuals interested in microbiome science. These publications are
              educational scientific resources and do not establish medical advice or promises to treat, cure, or
              diagnose disease.
            </p>
          </div>
        </div>
      </section>

      {/* 05 · EXPLORE OUR SCIENCE NAVIGATION */}
      <section className="sheet sheet--pad sci-pub-explore-section">
        <div className="wrap">
          <div className="shead" style={{ textAlign: "center", marginInline: "auto" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Explore Our Science</span>
            <h2 style={{ marginTop: 14 }}>Discover More About the Microbiome.</h2>
            <p style={{ marginInline: "auto" }}>
              Explore how rigorous microbiome science informs our approach to targeted gut health and human vitality.
            </p>
          </div>

          <div className="sci-pub-explore-grid">
            <Link to="/science" className="sci-pub-explore-card">
              <div className="sci-pub-explore-card__thumb">
                <img src={IMG.microbes} alt="Microbiome science" />
              </div>
              <div className="sci-pub-explore-card__body">
                <h3>Microbiome Science</h3>
                <p>Understand the microbial ecosystem and its fundamental relationship with human physiology.</p>
                <span className="sci-pub-explore-card__cta">Explore Science →</span>
              </div>
            </Link>

            <Link to="/science#mechanism" className="sci-pub-explore-card">
              <div className="sci-pub-explore-card__thumb">
                <img src={IMG.blogCapsules} alt="Targeted delivery technology" />
              </div>
              <div className="sci-pub-explore-card__body">
                <h3>Our Technology</h3>
                <p>Discover our precision approach to microencapsulation and 100% targeted colonic release.</p>
                <span className="sci-pub-explore-card__cta">How It Works →</span>
              </div>
            </Link>

            <Link to="/science#comparison" className="sci-pub-explore-card">
              <div className="sci-pub-explore-card__thumb">
                <img src={IMG.tileClinical} alt="Scientific approach" />
              </div>
              <div className="sci-pub-explore-card__body">
                <h3>Scientific Approach</h3>
                <p>Explore the scientific principles, physiological evidence, and clinical stewardship guiding Third Biome.</p>
                <span className="sci-pub-explore-card__cta">Our Approach →</span>
              </div>
            </Link>
          </div>

          <div className="sci-pub-bottom-cta">
            <div className="sci-pub-bottom-cta__inner">
              <div>
                <h3>Explore Third Biome</h3>
                <p>Discover how microbiome science informs our flagship formulation, Biome Balance.</p>
              </div>
              <Link to="/products/biome-balance" className="btn btn--dark">
                Shop Biome Balance <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

