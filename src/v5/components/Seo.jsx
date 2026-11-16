/* Dependency-free per-route SEO & Schema.org manager.
   Sets document.title, meta descriptions, canonical URLs, Open Graph,
   Robots directives, and dynamic Schema.org JSON-LD graphs on mount.
   React 19 safe, restores defaults on unmount without leaking tags. */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "Third Biome";
const ORIGIN = "https://thirdbiome.com";
const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const DEFAULT_IMAGE = `${ORIGIN}/biome_favicon.svg`;

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
  return el;
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(schemaId, schemaData) {
  let el = document.head.querySelector(`script#${schemaId}`);
  if (!schemaData) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("id", schemaId);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemaData);
}

export default function Seo({
  title,
  description,
  canonical,
  type = "website",
  image,
  article,
  schema,
  noindex = false,
}) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} · India's First Proprietary Postbiotic`;
  const url = canonical || ORIGIN + (pathname === "/" ? "" : pathname);
  const shareImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // 2. Canonical URL
    setCanonical(url);

    // 3. Meta Description & Social Previews
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:image"]', "content", shareImage);
    setMeta('meta[name="twitter:image"]', "content", shareImage);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    // 4. Article-specific Open Graph tags
    if (type === "article" && article) {
      if (article.publishedTime) {
        setMeta('meta[property="article:published_time"]', "content", article.publishedTime);
      }
      if (article.author) {
        setMeta('meta[property="article:author"]', "content", article.author);
      }
      if (article.section) {
        setMeta('meta[property="article:section"]', "content", article.section);
      }
    }

    // 5. Robots Directive (index/follow vs noindex/nofollow)
    if (noindex) {
      setMeta('meta[name="robots"]', "content", "noindex, nofollow");
      setMeta('meta[name="googlebot"]', "content", "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "content", DEFAULT_ROBOTS);
      setMeta('meta[name="googlebot"]', "content", "index, follow");
    }

    // 6. Dynamic JSON-LD Structured Data
    if (schema) {
      setJsonLd("dynamic-route-schema", schema);
    } else {
      setJsonLd("dynamic-route-schema", null);
    }

    // Cleanup on unmount or route change
    return () => {
      setJsonLd("dynamic-route-schema", null);
      setMeta('meta[name="robots"]', "content", DEFAULT_ROBOTS);
      setMeta('meta[name="googlebot"]', "content", "index, follow");
      setMeta('meta[property="og:type"]', "content", "website");
    };
  }, [fullTitle, description, url, type, shareImage, article, schema, noindex]);

  return null;
}
