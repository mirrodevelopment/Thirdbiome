import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://thirdbiome.com";
const OUTPUT_FILE = path.resolve(__dirname, "../public/sitemap.xml");

// Core static routes with priorities and update frequencies
const CORE_ROUTES = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/science", changefreq: "monthly", priority: "0.9" },
  { url: "/evidence", changefreq: "monthly", priority: "0.9" },
  { url: "/scientific-publications", changefreq: "weekly", priority: "0.95" },
  { url: "/products/biome-balance", changefreq: "weekly", priority: "0.9" },
  { url: "/quiz", changefreq: "monthly", priority: "0.8" },
  { url: "/about", changefreq: "monthly", priority: "0.7" },
  { url: "/journal", changefreq: "weekly", priority: "0.8" },
];

async function generateSitemap() {
  console.log("Generating XML Sitemap for Third Biome...");

  // Import published scientific publications
  const publicationsModule = await import("../src/v5/data/publications.js");
  const publications = publicationsModule.PUBLICATIONS_DATA || [];

  // Filter to published records only
  const publishedPapers = publications.filter((p) => p.status !== "draft");

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Core Website Routes -->
`;

  for (const route of CORE_ROUTES) {
    xml += `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
  }

  xml += `\n  <!-- Published Scientific Research Library (Dynamic) -->\n`;

  for (const paper of publishedPapers) {
    xml += `  <url>
    <loc>${BASE_URL}/scientific-publications/${paper.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(OUTPUT_FILE, xml, "utf-8");
  console.log(`✓ Sitemap successfully generated at ${OUTPUT_FILE} (${CORE_ROUTES.length + publishedPapers.length} URLs included).`);
}

generateSitemap().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});

