import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { PUBLICATIONS_DATA } from "../v5/data/publications";

const LOCAL_STORAGE_KEY = "t3b_publications_override";
const ADMIN_SESSION_KEY = "t3b_admin_session";

// Transform database snake_case row into frontend camelCase object
const formatPublication = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    paperNumber: row.paper_number || "01",
    slug: row.slug,
    badge: row.badge || "Review Article",
    title: row.title,
    subtitle: row.subtitle || "",
    authors: row.authors,
    journal: row.journal_name || row.journal,
    publisher: row.publisher || "SAS Publishers",
    year: String(row.publication_year || row.year || "2026"),
    date: row.publication_date || row.date || "October 14, 2026",
    volume: String(row.volume || ""),
    issue: String(row.issue || ""),
    pages: row.page_range || row.pages || "",
    articleType: row.article_type || "Review Article",
    peerReviewed: row.peer_reviewed ?? true,
    doi: row.doi,
    doiUrl: row.doi_url || `https://doi.org/${row.doi}`,
    publisherUrl: row.publisher_url || "https://saspublishers.com",
    pdfUrl: row.pdf_url || null,
    topic: row.topic || "Microbiome Science",
    category: row.category || "all",
    abstract: row.abstract,
    overview: row.summary || row.overview || "",
    keyFindings: Array.isArray(row.key_findings) ? row.key_findings : row.keyFindings || [],
    highlights: Array.isArray(row.key_findings) ? row.key_findings : row.highlights || [],
    citation: row.citation,
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.subtitle,
    status: row.status || "published",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// Transform frontend object into database snake_case row
const formatRowForDB = (pub) => {
  return {
    paper_number: pub.paperNumber,
    slug: pub.slug,
    title: pub.title,
    subtitle: pub.subtitle,
    article_type: pub.articleType || "Review Article",
    badge: pub.badge || "Review Article",
    peer_reviewed: pub.peerReviewed ?? true,
    authors: pub.authors,
    journal_name: pub.journal,
    publisher: pub.publisher || "SAS Publishers",
    publication_date: pub.date,
    publication_year: String(pub.year),
    volume: String(pub.volume),
    issue: String(pub.issue),
    page_range: pub.pages,
    doi: pub.doi,
    doi_url: pub.doiUrl || `https://doi.org/${pub.doi}`,
    publisher_url: pub.publisherUrl,
    pdf_url: pub.pdfUrl || null,
    topic: pub.topic,
    category: pub.category,
    abstract: pub.abstract,
    summary: pub.overview,
    key_findings: pub.keyFindings || pub.highlights || [],
    citation: pub.citation,
    seo_title: pub.seoTitle || pub.title,
    seo_description: pub.seoDescription || pub.subtitle,
    status: pub.status || "published",
    updated_at: new Date().toISOString(),
  };
};

// Local storage fallback helpers
const getLocalOverrides = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setLocalOverrides = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to persist local publication overrides:", err);
  }
};

const getInitialLocalData = () => {
  const local = getLocalOverrides();
  if (local && Array.isArray(local) && local.length > 0) {
    return local;
  }
  return PUBLICATIONS_DATA.map((p) => ({ ...p, status: "published" }));
};

// =========================================================================
// PUBLIC API METHODS
// =========================================================================

/**
 * Fetch all published publications
 */
export const fetchPublishedPublications = async (category = "all") => {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("publications")
        .select("*")
        .eq("status", "published")
        .order("paper_number", { ascending: true });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(formatPublication);
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local dataset:", err);
    }
  }

  // Resilient Local Fallback
  const dataset = getInitialLocalData();
  const publishedOnly = dataset.filter((p) => p.status === "published");
  if (category && category !== "all") {
    return publishedOnly.filter((p) => p.category === category);
  }
  return publishedOnly;
};

/**
 * Fetch single publication by its unique URL slug
 */
export const fetchPublicationBySlug = async (slug) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!error && data) {
        return formatPublication(data);
      }
    } catch (err) {
      console.warn("Supabase slug fetch failed, falling back to local dataset:", err);
    }
  }

  // Local fallback
  const dataset = getInitialLocalData();
  const found = dataset.find((p) => p.slug === slug && p.status === "published");
  return found ? formatPublication(found) : null;
};

/**
 * Fetch related publications excluding current slug
 */
export const fetchRelatedPublications = async (currentSlug) => {
  const all = await fetchPublishedPublications();
  return all.filter((p) => p.slug !== currentSlug);
};

// =========================================================================
// ADMIN API METHODS
// =========================================================================

/**
 * Fetch all publications for the Admin CMS (includes drafts, published, archived)
 */
export const fetchAllPublicationsAdmin = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map(formatPublication);
      }
    } catch (err) {
      console.warn("Supabase admin fetch failed, falling back to local dataset:", err);
    }
  }

  return getInitialLocalData().map(formatPublication);
};

/**
 * Fetch single publication by ID for Admin Editor
 */
export const fetchPublicationByIdAdmin = async (id) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return formatPublication(data);
      }
    } catch (err) {
      console.warn("Supabase id fetch failed, falling back to local dataset:", err);
    }
  }

  const dataset = getInitialLocalData();
  const match = dataset.find((p) => p.id === id || p.slug === id);
  return match ? formatPublication(match) : null;
};

/**
 * Create or Update a Publication
 */
export const savePublication = async (pub) => {
  const dbPayload = formatRowForDB(pub);

  if (isSupabaseConfigured && supabase) {
    try {
      if (pub.id && !pub.id.startsWith("paper-")) {
        // Update existing database record
        const { data, error } = await supabase
          .from("publications")
          .update(dbPayload)
          .eq("id", pub.id)
          .select()
          .single();

        if (error) throw error;
        return formatPublication(data);
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("publications")
          .insert([dbPayload])
          .select()
          .single();

        if (error) throw error;
        return formatPublication(data);
      }
    } catch (err) {
      console.error("Supabase save failed:", err);
      throw err;
    }
  }

  // Local fallback save
  const dataset = getInitialLocalData();
  const idToUse = pub.id || `paper-${Date.now()}`;
  const existingIdx = dataset.findIndex((p) => p.id === idToUse || p.slug === pub.slug);

  const formattedNew = {
    ...pub,
    id: idToUse,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    dataset[existingIdx] = formattedNew;
  } else {
    formattedNew.createdAt = new Date().toISOString();
    dataset.unshift(formattedNew);
  }

  setLocalOverrides(dataset);
  return formattedNew;
};

/**
 * Toggle publication status between 'draft' and 'published'
 */
export const togglePublishStatus = async (id, currentStatus) => {
  const nextStatus = currentStatus === "published" ? "draft" : "published";

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("publications")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return formatPublication(data);
    } catch (err) {
      console.error("Supabase toggle failed:", err);
      throw err;
    }
  }

  const dataset = getInitialLocalData();
  const idx = dataset.findIndex((p) => p.id === id || p.slug === id);
  if (idx >= 0) {
    dataset[idx].status = nextStatus;
    dataset[idx].updatedAt = new Date().toISOString();
    setLocalOverrides(dataset);
    return formatPublication(dataset[idx]);
  }
  throw new Error("Publication not found to toggle");
};

/**
 * Delete a publication
 */
export const deletePublication = async (id) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("publications").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase delete failed:", err);
      throw err;
    }
  }

  const dataset = getInitialLocalData();
  const filtered = dataset.filter((p) => p.id !== id && p.slug !== id);
  setLocalOverrides(filtered);
  return true;
};

// =========================================================================
// ADMIN AUTHENTICATION HELPERS
// =========================================================================

export const adminLogin = async (email, password) => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  // Fallback / standard credentials for verification
  if (
    (email === "admin@thirdbiome.com" || email === "research@thirdbiome.com") &&
    password === "Thirdbiome@2026"
  ) {
    const mockUser = {
      email,
      role: "publication_admin",
      name: "Third Biome Research Administrator",
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(mockUser));
    return mockUser;
  }

  throw new Error("Invalid administrator credentials. Please check your email and password.");
};

export const adminLogout = async () => {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const getAdminSession = async () => {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      return data.session.user;
    }
  }

  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

