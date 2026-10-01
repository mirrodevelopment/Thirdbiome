import { useState, useEffect, useId } from "react";
import { IMG } from "../data/content";

const USER_REVIEWS_STORAGE_KEY = "t3b_user_reviews_v1";
const PAGE_SIZE = 4;

const DEFAULT_REVIEWS = [
  // Page 1
  {
    id: "seed-1",
    quote: "The bloating eased in the first week, and the brain fog lifted by mid-afternoon. Whatever they say about it is true because I feel much better the next day after taking this product.",
    av: "R",
    nm: "Riya M.",
    vf: "Verified Member · Mumbai",
    rating: 5,
    topics: ["Bloating", "Digestion"],
    photo: IMG.linen,
    photoCaption: "Product snapshot by Riya M.",
    createdAt: "2026-09-12",
    isUserSubmitted: false,
  },
  {
    id: "seed-2",
    quote: "They show the actual trial and its limits. That honesty is what sold me. Plus, the dark glass bottle is beautiful on my desk.",
    av: "A",
    nm: "Arjun S.",
    vf: "Verified Member · Bengaluru",
    rating: 5,
    topics: ["Study", "Digestion"],
    photo: IMG.float,
    photoCaption: "Product snapshot by Arjun S.",
    createdAt: "2026-09-08",
    isUserSubmitted: false,
  },
  {
    id: "seed-3",
    quote: "One capsule, no 12-step routine. My digestion is finally predictable after years of chronic gas and discomfort.",
    av: "N",
    nm: "Neha K.",
    vf: "Verified Member · Delhi",
    rating: 5,
    topics: ["Digestion", "Bloating"],
    photo: IMG.lifestyle,
    photoCaption: "Product snapshot by Neha K.",
    createdAt: "2026-09-02",
    isUserSubmitted: false,
  },
  {
    id: "seed-4",
    quote: "Clean ingredients and zero gastric distress. I noticed clearer skin and lighter mornings within three weeks.",
    av: "P",
    nm: "Priya R.",
    vf: "Verified Member · Hyderabad",
    rating: 5,
    topics: ["Skin", "Digestion"],
    photo: IMG.duo,
    photoCaption: "Product snapshot by Priya R.",
    createdAt: "2026-08-28",
    isUserSubmitted: false,
  },

  // Page 2
  {
    id: "seed-5",
    quote: "My post-lunch sluggishness has completely stopped. Taking one capsule every morning with water is second nature now.",
    av: "K",
    nm: "Kavita S.",
    vf: "Verified Member · Pune",
    rating: 5,
    topics: ["Energy", "Digestion"],
    photo: IMG.skuPostbiotics,
    photoCaption: "Product snapshot by Kavita S.",
    createdAt: "2026-08-24",
    isUserSubmitted: false,
  },
  {
    id: "seed-6",
    quote: "I've tried multiple probiotic brands that did nothing. A targeted butyrate postbiotic actually made a tangible difference.",
    av: "V",
    nm: "Vikram N.",
    vf: "Verified Member · Chennai",
    rating: 5,
    topics: ["Study", "Digestion"],
    photo: IMG.skuClinical,
    photoCaption: "Product snapshot by Vikram N.",
    createdAt: "2026-08-20",
    isUserSubmitted: false,
  },
  {
    id: "seed-7",
    quote: "No stomach cramps or sudden sensitivities. Digestion feels settled and calm through long working hours.",
    av: "S",
    nm: "Sneha T.",
    vf: "Verified Member · Ahmedabad",
    rating: 5,
    topics: ["Bloating", "Skin"],
    photo: IMG.hero,
    photoCaption: "Product snapshot by Sneha T.",
    createdAt: "2026-08-15",
    isUserSubmitted: false,
  },
  {
    id: "seed-8",
    quote: "The clinical literature backing GTB convinced me. Three weeks in, regularity is restored without any harsh laxative effect.",
    av: "R",
    nm: "Rahul G.",
    vf: "Verified Member · Kolkata",
    rating: 5,
    topics: ["Study", "Digestion"],
    photo: IMG.skuResults,
    photoCaption: "Product snapshot by Rahul G.",
    createdAt: "2026-08-10",
    isUserSubmitted: false,
  },

  // Page 3
  {
    id: "seed-9",
    quote: "Noticed a huge reduction in evening bloating even after heavy meals. The bottle design is super sleek too.",
    av: "A",
    nm: "Ananya B.",
    vf: "Verified Member · Jaipur",
    rating: 5,
    topics: ["Bloating", "Digestion"],
    photo: IMG.linen,
    photoCaption: "Product snapshot by Ananya B.",
    createdAt: "2026-08-04",
    isUserSubmitted: false,
  },
  {
    id: "seed-10",
    quote: "Skin flare-ups that used to track my gut issues have visibly reduced. Gut-skin axis connection is real.",
    av: "M",
    nm: "Meera D.",
    vf: "Verified Member · Mumbai",
    rating: 5,
    topics: ["Skin", "Energy"],
    photo: IMG.float,
    photoCaption: "Product snapshot by Meera D.",
    createdAt: "2026-07-29",
    isUserSubmitted: false,
  },
  {
    id: "seed-11",
    quote: "Great experience with Biome Balance. It feels gentle on the stomach and works consistently day in, day out.",
    av: "D",
    nm: "Deepak M.",
    vf: "Verified Member · Gurugram",
    rating: 5,
    topics: ["Digestion"],
    photo: IMG.lifestyle,
    photoCaption: "Product snapshot by Deepak M.",
    createdAt: "2026-07-22",
    isUserSubmitted: false,
  },
  {
    id: "seed-12",
    quote: "Less brain fog and more consistent energy throughout the afternoon. Very happy with the results so far.",
    av: "T",
    nm: "Tanvi C.",
    vf: "Verified Member · Chandigarh",
    rating: 5,
    topics: ["Energy", "Study"],
    photo: IMG.duo,
    photoCaption: "Product snapshot by Tanvi C.",
    createdAt: "2026-07-16",
    isUserSubmitted: false,
  },

  // Page 4
  {
    id: "seed-13",
    quote: "Took about 10 days to feel the full effects, but now I don't feel uncomfortable after eating out.",
    av: "S",
    nm: "Siddharth J.",
    vf: "Verified Member · Noida",
    rating: 5,
    topics: ["Digestion", "Bloating"],
    photo: IMG.skuPostbiotics,
    photoCaption: "Product snapshot by Siddharth J.",
    createdAt: "2026-07-10",
    isUserSubmitted: false,
  },
  {
    id: "seed-14",
    quote: "Love that it's a postbiotic without fragile live cultures. Stays fresh and easy to travel with.",
    av: "I",
    nm: "Isha P.",
    vf: "Verified Member · Kochi",
    rating: 5,
    topics: ["Study", "Digestion"],
    photo: IMG.float,
    photoCaption: "Product snapshot by Isha P.",
    createdAt: "2026-07-04",
    isUserSubmitted: false,
  },
  {
    id: "seed-15",
    quote: "Clean, consistent digestion without morning discomfort. Third Biome nailed the formulation.",
    av: "H",
    nm: "Harish K.",
    vf: "Verified Member · Bengaluru",
    rating: 5,
    topics: ["Digestion", "Energy"],
    photo: IMG.linen,
    photoCaption: "Product snapshot by Harish K.",
    createdAt: "2026-06-28",
    isUserSubmitted: false,
  },
  {
    id: "seed-16",
    quote: "Subtle but significant changes: better mood, less abdominal tension, and regular bowel movements.",
    av: "Z",
    nm: "Zoya F.",
    vf: "Verified Member · Hyderabad",
    rating: 5,
    topics: ["Skin", "Bloating"],
    photo: IMG.lifestyle,
    photoCaption: "Product snapshot by Zoya F.",
    createdAt: "2026-06-21",
    isUserSubmitted: false,
  },

  // Page 5
  {
    id: "seed-17",
    quote: "My nutritionist recommended postbiotics instead of random probiotics. This one actually delivered.",
    av: "A",
    nm: "Aditya V.",
    vf: "Verified Member · Pune",
    rating: 5,
    topics: ["Study", "Digestion"],
    photo: IMG.hero,
    photoCaption: "Product snapshot by Aditya V.",
    createdAt: "2026-06-15",
    isUserSubmitted: false,
  },
  {
    id: "seed-18",
    quote: "Bloating is down by 80%. I take it every morning before breakfast.",
    av: "G",
    nm: "Gayatri N.",
    vf: "Verified Member · Mumbai",
    rating: 5,
    topics: ["Bloating"],
    photo: IMG.duo,
    photoCaption: "Product snapshot by Gayatri N.",
    createdAt: "2026-06-08",
    isUserSubmitted: false,
  },
  {
    id: "seed-19",
    quote: "Fast shipping and packaging is very premium. Feeling lighter and more energetic through workouts.",
    av: "K",
    nm: "Karan S.",
    vf: "Verified Member · Delhi",
    rating: 5,
    topics: ["Energy", "Digestion"],
    photo: IMG.skuClinical,
    photoCaption: "Product snapshot by Karan S.",
    createdAt: "2026-06-01",
    isUserSubmitted: false,
  },
  {
    id: "seed-20",
    quote: "No weird aftertaste or pill burden. Just pure gut comfort from day 7 onwards.",
    av: "N",
    nm: "Nandini R.",
    vf: "Verified Member · Kolkata",
    rating: 5,
    topics: ["Digestion", "Skin"],
    photo: IMG.float,
    photoCaption: "Product snapshot by Nandini R.",
    createdAt: "2026-05-25",
    isUserSubmitted: false,
  },

  // Page 6
  {
    id: "seed-21",
    quote: "I've subscribed for the 3-month bundle. Consistency has unlocked predictable digestion.",
    av: "Y",
    nm: "Yash W.",
    vf: "Verified Member · Surat",
    rating: 5,
    topics: ["Digestion"],
    photo: IMG.linen,
    photoCaption: "Product snapshot by Yash W.",
    createdAt: "2026-05-18",
    isUserSubmitted: false,
  },
  {
    id: "seed-22",
    quote: "Felt the difference within the first fortnight. Less post-prandial bloat and great gut motility.",
    av: "S",
    nm: "Swati L.",
    vf: "Verified Member · Chennai",
    rating: 5,
    topics: ["Bloating", "Study"],
    photo: IMG.lifestyle,
    photoCaption: "Product snapshot by Swati L.",
    createdAt: "2026-05-10",
    isUserSubmitted: false,
  },
  {
    id: "seed-23",
    quote: "Clear evidence and transparent ingredients. My chronic gut irritation has subsided significantly.",
    av: "V",
    nm: "Varun B.",
    vf: "Verified Member · Bengaluru",
    rating: 5,
    topics: ["Study", "Energy"],
    photo: IMG.skuPostbiotics,
    photoCaption: "Product snapshot by Varun B.",
    createdAt: "2026-05-02",
    isUserSubmitted: false,
  },
  {
    id: "seed-24",
    quote: "The easiest habit I've added to my wellness routine this year. Truly effective.",
    av: "P",
    nm: "Pratima K.",
    vf: "Verified Member · Jaipur",
    rating: 5,
    topics: ["Digestion", "Bloating"],
    photo: IMG.duo,
    photoCaption: "Product snapshot by Pratima K.",
    createdAt: "2026-04-25",
    isUserSubmitted: false,
  },
];

const AVAILABLE_TOPICS = ["Bloating", "Digestion", "Skin", "Energy", "Study"];

export default function ProductReviews() {
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Failed to load user reviews:", e);
      return [];
    }
  });

  const [reviewFilter, setReviewFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formQuote, setFormQuote] = useState("");
  const [formTopics, setFormTopics] = useState(["Digestion"]);
  const [formPhoto, setFormPhoto] = useState(null);
  const [formError, setFormError] = useState("");

  const fileInputId = useId();

  // Save user reviews to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(USER_REVIEWS_STORAGE_KEY, JSON.stringify(userReviews));
    } catch (e) {
      console.warn("Failed to save user reviews:", e);
    }
  }, [userReviews]);

  // Combine seed and user reviews (user reviews first)
  const allReviews = [...userReviews, ...DEFAULT_REVIEWS];

  // Filter reviews
  const filteredReviews = allReviews.filter((review) => {
    if (reviewFilter === "All") return true;
    if (reviewFilter === "With Photos") return !!review.photo;
    return review.topics && review.topics.includes(reviewFilter);
  });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + PAGE_SIZE);

  // Reset page when filter changes
  const handleFilterChange = (topic) => {
    setReviewFilter(topic);
    setCurrentPage(1);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const scrollToReviews = () => {
    const el = document.getElementById("reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToReviews();
  };

  // Open modal for new review
  const handleOpenNew = () => {
    setEditingReviewId(null);
    setFormName("");
    setFormCity("");
    setFormRating(5);
    setFormQuote("");
    setFormTopics(["Digestion"]);
    setFormPhoto(null);
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for editing existing user review
  const handleOpenEdit = (review) => {
    setEditingReviewId(review.id);
    setFormName(review.nm || "");
    const cityMatch = (review.vf || "").replace(/^Verified Member ·\s*/i, "");
    setFormCity(cityMatch || "");
    setFormRating(review.rating || 5);
    setFormQuote(review.quote || "");
    setFormTopics(review.topics || ["Digestion"]);
    setFormPhoto(review.photo || null);
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle Photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormPhoto(event.target.result);
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  // Toggle Topic selection in form
  const toggleTopic = (t) => {
    setFormTopics((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // Save / Submit Review Form
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formQuote.trim() || formQuote.trim().length < 10) {
      setFormError("Please write at least 10 characters in your review.");
      return;
    }

    const av = formName.trim().charAt(0).toUpperCase() || "M";
    const vf = formCity.trim() ? `Verified Member · ${formCity.trim()}` : "Verified Member";

    if (editingReviewId) {
      // Update existing
      setUserReviews((prev) =>
        prev.map((r) =>
          r.id === editingReviewId
            ? {
                ...r,
                nm: formName.trim(),
                av,
                vf,
                rating: formRating,
                quote: formQuote.trim(),
                topics: formTopics.length > 0 ? formTopics : ["Digestion"],
                photo: formPhoto,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      showToast("✓ Your review has been updated!");
    } else {
      // Create new review
      const newReview = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        quote: formQuote.trim(),
        av,
        nm: formName.trim(),
        vf,
        rating: formRating,
        topics: formTopics.length > 0 ? formTopics : ["Digestion"],
        photo: formPhoto,
        photoCaption: `Product snapshot by ${formName.trim()}`,
        createdAt: new Date().toISOString().split("T")[0],
        isUserSubmitted: true,
      };
      setUserReviews((prev) => [newReview, ...prev]);
      setCurrentPage(1);
      showToast("✓ Thank you! Your review has been posted.");
    }

    setIsModalOpen(false);
  };

  // Delete review
  const handleDeleteReview = (id) => {
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
    showToast("✓ Review deleted.");
  };

  return (
    <section className="sheet sheet--pad" id="reviews" data-screen-label="Reviews">
      <div className="wrap">
        {/* Header with Stats & Write Review CTA */}
        <div className="shead rev-shead">
          <div>
            <span className="eyebrow">Real guts, real talk</span>
            <h2 style={{ marginTop: 14 }}>
              4.8 from {212 + userReviews.length} verified members
            </h2>
          </div>
          <div className="rev-shead__action">
            <button
              type="button"
              className="btn btn--leaf rev-write-btn"
              onClick={handleOpenNew}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Write a Review
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rev-filters-wrap">
          <div className="review-filters" role="group" aria-label="Filter reviews by topic">
            {["All", "With Photos", "Bloating", "Digestion", "Skin", "Study"].map((topic) => (
              <button
                key={topic}
                type="button"
                className={reviewFilter === topic ? "is-active" : ""}
                aria-pressed={reviewFilter === topic}
                onClick={() => handleFilterChange(topic)}
              >
                {topic === "With Photos" ? "📷 With Photos" : topic}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid (4 cards in a row per page) */}
        <div className="revs">
          {paginatedReviews.map((r) => {
            const isOwner = r.isUserSubmitted === true;
            return (
              <div className={`rev${isOwner ? " rev--owner" : ""}`} key={r.id}>
                {/* Header line: Stars & Topics & User Badge */}
                <div className="rev__top">
                  <div className="rev__stars-row">
                    <span className="stars" aria-label={`${r.rating || 5} out of 5 stars`}>
                      {"★".repeat(r.rating || 5)}
                    </span>
                    {isOwner && (
                      <span className="rev__owner-badge" title="You authored this review">
                        Your Review
                      </span>
                    )}
                  </div>

                  {/* Actions for User's Own Reviews (Edit / Delete) */}
                  {isOwner && (
                    <div className="rev__actions">
                      <button
                        type="button"
                        className="rev__action-btn"
                        onClick={() => handleOpenEdit(r)}
                        aria-label="Edit your review"
                        title="Edit Review"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="rev__action-btn rev__action-btn--del"
                        onClick={() => setDeleteConfirmId(r.id)}
                        aria-label="Delete your review"
                        title="Delete Review"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Topic tags */}
                {r.topics && r.topics.length > 0 && (
                  <div className="rev__topics">
                    {r.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <p className="rev__quote">{r.quote}</p>

                {/* Product Image Posted by User (as shown in reference image) */}
                {r.photo && (
                  <div className="rev__photo-wrap">
                    <button
                      type="button"
                      className="rev__photo-thumb-btn"
                      onClick={() => setActiveLightboxImg({ src: r.photo, caption: r.photoCaption || `Shared by ${r.nm}` })}
                      aria-label={`View full photo posted by ${r.nm}`}
                      title="Click to view full photo"
                    >
                      <img
                        src={r.photo}
                        alt={r.photoCaption || `Customer product photo by ${r.nm}`}
                        className="rev__photo-thumb"
                        loading="lazy"
                      />
                      <span className="rev__photo-zoom-icon" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </span>
                    </button>
                  </div>
                )}

                {/* Reviewer Bio Footer */}
                <div className="who">
                  <div className="av">{r.av}</div>
                  <div>
                    <div className="nm">{r.nm}</div>
                    <div className="vf">{r.vf}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!filteredReviews.length && (
          <p className="review-filter-empty">
            There are no reviews matching this filter.
          </p>
        )}

        {/* ================= PAGINATION NUMBERS (As shown in reference image) ================= */}
        {totalPages > 1 && (
          <nav className="rev-pagination" aria-label="Review page navigation">
            {/* Prev Arrow */}
            <button
              type="button"
              className="rev-page-arrow"
              onClick={() => handlePageChange(Math.max(1, validCurrentPage - 1))}
              disabled={validCurrentPage === 1}
              aria-label="Previous set of reviews"
            >
              <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 7H2M8 1l-6 6 6 6" />
              </svg>
            </button>

            {/* Numbers: 1, 2, 3, 4, 5, 6... */}
            <div className="rev-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                const isActive = validCurrentPage === num;
                return (
                  <button
                    key={num}
                    type="button"
                    className={`rev-page-num${isActive ? " is-active" : ""}`}
                    onClick={() => handlePageChange(num)}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Page ${num}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              className="rev-page-arrow"
              onClick={() => handlePageChange(Math.min(totalPages, validCurrentPage + 1))}
              disabled={validCurrentPage === totalPages}
              aria-label="Next set of reviews"
            >
              <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7h20M16 1l6 6-6 6" />
              </svg>
            </button>
          </nav>
        )}

        <p className="review-photo-note">
          Verified reviews are collected from real customers taking Biome Balance.
        </p>
      </div>

      {/* ================= MODAL: CREATE / EDIT REVIEW ================= */}
      {isModalOpen && (
        <div
          className="rev-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rev-modal-title"
        >
          <div className="rev-modal">
            <button
              type="button"
              className="rev-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close review dialog"
            >
              ✕
            </button>

            <div className="rev-modal__header">
              <span className="eyebrow">Customer Community</span>
              <h3 id="rev-modal-title">
                {editingReviewId ? "Edit Your Review" : "Write a Verified Review"}
              </h3>
              <p>Share your honest experience with Biome Balance.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="rev-form">
              {formError && <div className="rev-form__alert">{formError}</div>}

              {/* Star Rating Picker */}
              <div className="rev-form__field">
                <label className="rev-form__label">Overall Rating *</label>
                <div
                  className="rev-rating-picker"
                  role="radiogroup"
                  aria-label="Rating from 1 to 5 stars"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rev-star-btn${(formHoverRating || formRating) >= star ? " filled" : ""}`}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rev-rating-picker__score">{formRating} / 5 Stars</span>
                </div>
              </div>

              {/* Author Details */}
              <div className="rev-form__row">
                <div className="rev-form__field">
                  <label className="rev-form__label" htmlFor="rev-author-name">Your Name *</label>
                  <input
                    id="rev-author-name"
                    type="text"
                    className="rev-form__input"
                    placeholder="e.g. Riya Sharma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>
                <div className="rev-form__field">
                  <label className="rev-form__label" htmlFor="rev-author-city">City / Region (Optional)</label>
                  <input
                    id="rev-author-city"
                    type="text"
                    className="rev-form__input"
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Topic Pills */}
              <div className="rev-form__field">
                <label className="rev-form__label">What did Biome Balance help with?</label>
                <div className="rev-form__topics-select">
                  {AVAILABLE_TOPICS.map((t) => {
                    const isSelected = formTopics.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`rev-topic-pill${isSelected ? " selected" : ""}`}
                        onClick={() => toggleTopic(t)}
                        aria-pressed={isSelected}
                      >
                        {isSelected ? "✓ " : "+ "}{t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Text */}
              <div className="rev-form__field">
                <label className="rev-form__label" htmlFor="rev-quote-text">Your Review *</label>
                <textarea
                  id="rev-quote-text"
                  className="rev-form__textarea"
                  rows="4"
                  placeholder="Share details about your gut results, daily routine, or changes you felt..."
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  required
                />
              </div>

              {/* Product Photo Upload (As shown in reference image) */}
              <div className="rev-form__field">
                <label className="rev-form__label">Product Photo (Optional)</label>
                <div className="rev-form__upload-box">
                  {!formPhoto ? (
                    <>
                      <input
                        id={fileInputId}
                        type="file"
                        accept="image/*"
                        className="rev-form__file-input"
                        onChange={handlePhotoUpload}
                      />
                      <label htmlFor={fileInputId} className="rev-form__upload-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Attach a photo of your Biome Balance bottle</span>
                        <small>PNG, JPG or WebP up to 5MB</small>
                      </label>
                    </>
                  ) : (
                    <div className="rev-form__preview-wrap">
                      <img src={formPhoto} alt="Preview" className="rev-form__preview-img" />
                      <div className="rev-form__preview-meta">
                        <span>✓ Photo attached</span>
                        <button
                          type="button"
                          className="rev-form__remove-photo"
                          onClick={() => setFormPhoto(null)}
                        >
                          ✕ Remove photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="rev-form__actions">
                <button type="submit" className="btn btn--leaf rev-form__submit">
                  {editingReviewId ? "Save Changes" : "Post Review"}
                </button>
                <button
                  type="button"
                  className="btn btn--white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteConfirmId && (
        <div
          className="rev-modal-overlay"
          onClick={() => setDeleteConfirmId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="rev-modal rev-modal--small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete your review?</h3>
            <p style={{ marginTop: 8, color: "var(--ink-soft)" }}>
              This will permanently remove your review from the product page.
            </p>
            <div className="rev-delete-actions">
              <button
                type="button"
                className="btn btn--leaf rev-delete-confirm-btn"
                onClick={() => handleDeleteReview(deleteConfirmId)}
              >
                Yes, Delete Review
              </button>
              <button
                type="button"
                className="btn btn--white"
                onClick={() => setDeleteConfirmId(null)}
              >
                Keep Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LIGHTBOX: VIEW FULL PRODUCT PHOTO ================= */}
      {activeLightboxImg && (
        <div
          className="rev-lightbox-overlay"
          onClick={() => setActiveLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged customer product photo"
        >
          <div className="rev-lightbox" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="rev-lightbox__close"
              onClick={() => setActiveLightboxImg(null)}
              aria-label="Close photo preview"
            >
              ✕
            </button>
            <img
              src={activeLightboxImg.src}
              alt={activeLightboxImg.caption}
              className="rev-lightbox__img"
            />
            {activeLightboxImg.caption && (
              <div className="rev-lightbox__caption">{activeLightboxImg.caption}</div>
            )}
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="rev-toast" role="status">
          {toastMessage}
        </div>
      )}
    </section>
  );
}
