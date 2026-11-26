import { useRef, useState, useEffect } from "react";
import { IMG } from "../data/content";

const INFLUENCER_STORIES = [
  {
    id: "pooja-gowda",
    title: "Pooja Gowda",
    role: "Wellness & Lifestyle Creator",
    badge: "Creator Story",
    video: encodeURI("/assets/Influencers Video/Pooja gowda - reel.mp4"),
    quote: "“Adding Biome Balance to my daily wellness routine made an immediate difference in bloating and daily energy.”",
    alt: "Pooja Gowda daily gut wellness reel",
  },
  {
    id: "chakradhar",
    title: "Chakradhar",
    role: "T3B Member · 60-Day Story",
    badge: "Member Story",
    video: encodeURI("/assets/Influencers Video/Chakradhar.mp4"),
    poster: IMG.patChakradhar,
    quote: "“Within 3 weeks, bloating and post-meal sluggishness completely disappeared. My energy levels are back.”",
    alt: "Chakradhar gut transformation story",
  },
  {
    id: "shwetha-jain",
    title: "Shwetha Jain",
    role: "Nutritionist & Wellness Advocate",
    badge: "Nutrition Expert",
    video: encodeURI("/assets/Influencers Video/Shwetha Jain.mp4"),
    poster: IMG.patShweta,
    quote: "“Biome Balance has become the non-negotiable anchor in my morning gut ritual. The clinical backing speaks for itself.”",
    alt: "Shwetha Jain daily morning gut ritual video",
  },
  {
    id: "shriya-jain",
    title: "Shriya Jain",
    role: "Holistic Health Creator",
    badge: "Creator Story",
    video: encodeURI("/assets/Influencers Video/Shriya Jain.mp4"),
    quote: "“No more trial-and-error with random gut supplements. This actually works with the microbiome’s natural rhythm.”",
    alt: "Shriya Jain microbiome journey video",
  },
  {
    id: "nimish",
    title: "Nimish",
    role: "Biohacker & Athlete",
    badge: "Performance",
    video: encodeURI("/assets/Influencers Video/Nimish.mp4"),
    quote: "“Recovery starts in the gut. Adding postbiotic butyrate improved my metabolic stamina and daily digestion.”",
    alt: "Nimish athlete gut recovery video",
  },
  {
    id: "saakshi",
    title: "Saakshi",
    role: "Community Member · 30-Day Cohort",
    badge: "T3B Cohort",
    video: encodeURI("/assets/Influencers Video/Saakshi.mp4"),
    quote: "“The difference in my digestion and skin clarity within a month was night and day. Truly science-backed.”",
    alt: "Saakshi 30-day cohort experience video",
  },
];

function ReelCard({ story, onSelect }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Browser autoplay policy might restrict, safe to ignore
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article
      className="v5-story-card v5-story-card--reel"
      key={story.id}
      onClick={() => onSelect(story)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(story);
        }
      }}
      aria-label={`Watch story by ${story.title}`}
    >
      <div className="v5-story-card__reel-media">
        <video
          ref={videoRef}
          src={`${story.video}#t=0.001`}
          poster={story.poster}
          muted
          playsInline
          loop
          preload="none"
          className="v5-story-card__reel-video"
        />

        {/* Gradient scrim for text readability */}
        <div className="v5-story-card__reel-scrim" />

        {/* Circular play button at top right */}
        <button
          type="button"
          className="v5-story-card__play-badge"
          aria-label={`Play story by ${story.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>

        {/* Pill badge at top left */}
        {story.badge && (
          <span className="v5-story-card__badge">{story.badge}</span>
        )}

        {/* Overlay info at bottom */}
        <div className="v5-story-card__reel-overlay">
          <h3 className="v5-story-card__name">{story.title}</h3>
          <span className="v5-story-card__role">{story.role}</span>
          {story.quote && (
            <p className="v5-story-card__preview-quote">{story.quote}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function StoriesSection() {
  const trackRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveStory(null);
      }
    };
    if (activeStory) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStory]);

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = trackRef.current.offsetWidth * 0.75 * direction;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="sheet sheet--pad v5-stories-section" data-screen-label="Member Stories & Videos">
      <div className="wrap">
        <div className="v5-stories__header">
          <div>
            <span className="eyebrow">Community & Clinical Evidence</span>
            <h2 className="v5-stories__title">
              Stories from scientists, innovators, and members like you.
            </h2>
          </div>
          <div className="v5-stories__nav">
            <button
              type="button"
              className="v5-stories__nav-btn"
              onClick={() => scrollTrack(-1)}
              aria-label="Previous story"
            >
              ←
            </button>
            <button
              type="button"
              className="v5-stories__nav-btn"
              onClick={() => scrollTrack(1)}
              aria-label="Next story"
            >
              →
            </button>
          </div>
        </div>

        <div className="v5-stories__track" ref={trackRef}>
          {INFLUENCER_STORIES.map((story) => (
            <ReelCard
              key={story.id}
              story={story}
              onSelect={setActiveStory}
            />
          ))}
        </div>
      </div>

      {/* Video Modal Preview */}
      {activeStory && (
        <div className="v5-story-modal-scrim" onClick={() => setActiveStory(null)}>
          <div className="v5-story-modal v5-story-modal--reel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="v5-story-modal__close"
              onClick={() => setActiveStory(null)}
              aria-label="Close story video"
            >
              ✕
            </button>
            <div className="v5-story-modal__video-wrap v5-story-modal__video-wrap--reel">
              <video
                src={activeStory.video}
                autoPlay
                controls
                playsInline
                className="v5-story-modal__video"
                poster={activeStory.poster}
              />
            </div>
            <div className="v5-story-modal__info">
              {activeStory.badge && (
                <span className="v5-story-card__badge">{activeStory.badge}</span>
              )}
              <h3>{activeStory.title}</h3>
              <p className="v5-story-modal__role">{activeStory.role}</p>
              {activeStory.quote && (
                <p className="v5-story-modal__quote">{activeStory.quote}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
