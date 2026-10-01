/* Dependency-free per-route SEO. Sets document.title, meta description,
   canonical, and og:title/description on mount, React 19 safe, no library.
   Restores the document defaults on unmount so routes don't leak tags. */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "Third Biome";
const ORIGIN = "https://thirdbiome.com";

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

export default function Seo({ title, description, canonical }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title}, ${SITE}` : `${SITE}, India's First Proprietary Postbiotic`;
  const url = canonical || ORIGIN + (pathname === "/" ? "/" : pathname);

  useEffect(() => {
    document.title = fullTitle;
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setCanonical(url);
  }, [fullTitle, description, url]);

  return null;
}
