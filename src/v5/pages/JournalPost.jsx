import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import Seo from "../components/Seo";
import { getBlogBySlug } from "../../services/blogService";

const monthDayYear = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};
const readLabel = (rt) => {
  const n = String(rt || "").match(/\d+/);
  return n ? `${n[0]} min read` : "";
};

export default function JournalPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);   // null = loading
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setFailed(false);
    getBlogBySlug(slug)
      .then((res) => { if (!cancelled) setPost(res?.data || null); })
      .catch(() => { if (!cancelled) setFailed(true); });
    window.scrollTo(0, 0);
    return () => { cancelled = true; };
  }, [slug]);

  if (failed) {
    return (
      <section className="sheet sheet--pad v5-page">
        <div className="wrap" style={{ textAlign: "center", padding: "60px 0" }}>
          <h1>Article not found.</h1>
          <p style={{ margin: "14px 0 26px" }}>It may have been moved or unpublished.</p>
          <Link className="btn btn--dark" to="/journal">Back to the Journal</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title={post ? post.title : "Journal"} description={post?.excerpt || ""} />

      <section className="sheet sheet--pad v5-page">
        <div className="wrap v5-article__head">
          <div style={{ marginBottom: 10 }}>
            <Link className="pdp__return" to="/journal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg> All articles
            </Link>
          </div>
          {post && (
            <>
              <span className="eyebrow" style={{ marginTop: 18 }}>{post.category}</span>
              <h1 className="v5-article__title">{post.title}</h1>
              <div className="v5-article__meta">
                <span>{post.author}</span>
                <span>·</span>
                <span>{monthDayYear(post.date)}</span>
                <span>·</span>
                <span>{readLabel(post.readTime)}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {post && (
        <section className="sheet sheet--pad v5-page-body">
          <div className="wrap">
            {post.image && (
              <div className="v5-article__hero">
                <img src={post.image} alt={post.title} />
              </div>
            )}
            <article
              className="v5-article"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }}
            />
            <div className="v5-article__foot">
              <Link className="btn btn--dark" to="/products/biome-balance">Shop Biome Balance →</Link>
              <Link className="btn btn--ghost" to="/journal">More articles</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
