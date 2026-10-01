import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import contactService from "../../services/contactService";
import { getBlogs } from "../../services/blogService";
import { IMG } from "../data/content";

/* Posts come from the backend (admin.thirdbiome.com blog CMS); this
   hard-coded set is only the fallback if the API is unreachable. */
const FALLBACK_POSTS = [
  {
    thumbStyle: { backgroundImage: `url(${IMG.blogLeaf})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "130px" },
    tag: "Comparison · Honest take",
    title: "Probiotics vs Postbiotics, the comparison the industry doesn't want you to see.",
    desc: "Survival rates, colonisation timelines, consistency of effect. Side by side, with sources.",
    read: "6 min",
    date: "June 2026",
  },
  {
    thumbStyle: { backgroundImage: `url(${IMG.blogTexture})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "130px" },
    tag: "Gut-brain · Science",
    title: "The gut produces 90% of your serotonin. Here's what that actually means.",
    desc: "The gut-brain axis is a bidirectional highway, and butyrate is one of the key signals.",
    read: "8 min",
    date: "May 2026",
  },
  {
    thumbStyle: { backgroundImage: `url(${IMG.blogCapsules})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "130px" },
    tag: "Protocol · 30 days",
    title: "30 days on Biome Balance, what to expect, week by week.",
    desc: "A realistic timeline based on our stewardship cohort data.",
    read: "5 min",
    date: "April 2026",
  },
];

const monthYear = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};
const readLabel = (rt) => {
  const n = String(rt || "").match(/\d+/);
  return n ? `${n[0]} min` : "";
};

export default function Journal() {
  const [posts, setPosts] = useState(null); // null = loading, [] = api failed
  const [subEmail, setSubEmail] = useState("");
  const [subSent, setSubSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getBlogs()
      .then((res) => {
        if (cancelled) return;
        const list = (res?.data || [])
          .filter((p) => p.status === "published")
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(list);
      })
      .catch(() => { if (!cancelled) setPosts([]); });
    return () => { cancelled = true; };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = subEmail.trim();
    if (email) {
      try {
        await contactService.submitContact({
          name: "",
          email,
          subject: "Journal newsletter",
          message: "Newsletter signup + Beginner's Guide to Postbiotics request from the Journal.",
        });
      } catch (err) {
        /* non-blocking */
      }
    }
    setSubSent(true);
  };

  const live = Array.isArray(posts) && posts.length > 0;
  const featured = live ? posts[0] : null;
  const grid = live ? posts.slice(1) : null;

  return (
    <>
      <Seo title="Journal" description="Plain-English gut science, honest takes on the supplement industry, and real stories from the T3B community." />
      <section className="sheet sheet--pad v5-page">
        <div className="wrap">
          <span className="eyebrow">Gut science, plainly</span>
          <h1>The Third Biome <em>Journal.</em></h1>
          <p>Plain-English gut science, honest takes on the supplement industry, and real stories from the T3B community. Published when we have something worth saying.</p>
        </div>
      </section>

      <section className="sheet sheet--pad v5-page-body"><div className="wrap">

        {/* Featured (latest post) */}
        {featured && (
          <Link className="v5-blog-feat" to={`/journal/${featured.slug}`}>
            <div className="v5-blog-feat__img" style={{ backgroundImage: `url(${featured.image})`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end", padding: "24px" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: ".64rem", letterSpacing: ".1em", textTransform: "uppercase", background: "rgba(255,255,255,.15)", color: "#fff", padding: ".4em .7em", borderRadius: "999px" }}>{featured.category}</span>
            </div>
            <div className="v5-blog-feat__body">
              <span className="v5-blog-feat__tag">Latest · {monthYear(featured.date)}</span>
              <h2>{featured.title}</h2>
              <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginBottom: "18px", flex: 1 }}>{featured.excerpt}</p>
              <span className="btn btn--dark">Read the article →</span>
            </div>
          </Link>
        )}

        {/* Grid: live posts, or the fallback set if the API is unreachable */}
        <div className="v5-blog-grid">
          {grid && grid.map((p) => (
            <Link className="v5-blogcard" to={`/journal/${p.slug}`} key={p.slug}>
              <div className="v5-blogcard__thumb" style={{ backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "130px" }} />
              <div className="v5-blogcard__body">
                <div className="v5-blogcard__tag">{p.category}</div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="v5-blogcard__meta"><span>{readLabel(p.readTime)}</span><span>{monthYear(p.date)}</span></div>
              </div>
            </Link>
          ))}
          {posts !== null && !live && FALLBACK_POSTS.map((p) => (
            <span className="v5-blogcard" key={p.title} style={{ cursor: "default" }}>
              <div className="v5-blogcard__thumb" style={p.thumbStyle}>{p.thumbContent || null}</div>
              <div className="v5-blogcard__body">
                <div className="v5-blogcard__tag">{p.tag}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="v5-blogcard__meta"><span>{p.read}</span><span>{p.date}</span></div>
              </div>
            </span>
          ))}
        </div>

      </div></section>

      {/* Subscribe */}
      <section className="sheet sheet--pad"><div className="wrap">
        <div className="v5-subfree">
          <div>
            <span className="eyebrow">Free guide + monthly letter</span>
            <h2>Get The Beginner's Guide to <em>Postbiotics</em>, free.</h2>
            <p>Plain-English gut science, the GTB™ mechanism explained, and a 30-day protocol starter.</p>
            <div className="v5-freebie" style={{ marginTop: "18px" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><div><b>Free: The Beginner's Guide to Postbiotics</b><span>PDF · 18 pages · plain English</span></div></div>
          </div>
          <div>
            {!subSent && (
              <>
                <form className="v5-subfree__form" id="subfreeForm" onSubmit={handleSubscribe}>
                  <input type="email" placeholder="you@example.com" required value={subEmail} onChange={(e) => setSubEmail(e.target.value)} />
                  <button className="btn btn--dark" type="submit">Get it free →</button>
                </form>
              </>
            )}
            <div className={"v5-subfree__success" + (subSent ? " on" : "")} id="subfreeSucc"><h3 style={{ color: "var(--leaf)", fontSize: "1.3rem", marginBottom: "8px" }}>You're on the list ✓</h3><p style={{ color: "rgba(255,255,255,.65)" }}>You're on the list, we'll be in touch.</p></div>
          </div>
        </div>
      </div></section>
    </>
  );
}
