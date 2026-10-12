import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IMG } from "../data/content";
import gutMotionVideo from "../assets/gut-motion.mp4";
import biomeProductVideo from "../assets/biome-product-video.mp4";

const STORIES = [
  {
    id: "routine-oval",
    type: "oval",
    img: IMG.lifestyle,
    alt: "Morning gut health routine",
    tag: "Morning ritual",
    title: "Sinkside routine",
    desc: "1 capsule with water every morning before breakfast.",
  },
  {
    id: "capsule-video",
    type: "video-pure",
    img: IMG.blogCapsules,
    video: biomeProductVideo,
    alt: "Third Biome capsules in hand",
    badge: "500 mg active GTB™",
  },
  {
    id: "scientist-video",
    type: "video-portrait",
    img: IMG.tileClinical,
    video: gutMotionVideo,
    alt: "Clinical science and postbiotic research",
    badge: "Clinical Science",
    title: "Clinical Formulation",
    role: "Physician & Pharmacology Team",
    quote: "“Postbiotics don't need to colonise. They deliver active butyrate directly to the colon.”",
  },
  {
    id: "split-editorial",
    type: "split-quote",
    topImg: IMG.duo,
    topAlt: "Third Biome bottle on wellness counter",
    quote: "“Pushing the boundaries on what microbial metabolisms and pathways are capable of is where their interests and their passions lie.”",
    sourceName: "FAST COMPANY",
    sourceSubtitle: "Innovation in Gut Biotechnology",
    link: "/science",
  },
  {
    id: "jar-detail-video",
    type: "video-portrait",
    img: IMG.hero,
    video: biomeProductVideo,
    alt: "Third Biome green glass jar detail",
    badge: "Targeted Release",
    title: "Micro-encapsulation",
    role: "Formulation Science",
    quote: "“Protective lipid matrix ensures 100% bypass of harsh stomach acid.”",
  },
  {
    id: "member-story",
    type: "video-portrait",
    img: IMG.rweCalmer,
    video: gutMotionVideo,
    alt: "Member sharing daily gut transformation",
    badge: "Cohort 3 Member",
    title: "T3B Club Protocol",
    role: "Bangalore · 30-Day Gut Cohort",
    quote: "“Finally, a gut protocol that has real scientific backing instead of marketing hype.”",
  },
];

export default function StoriesSection() {
  const trackRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);

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
          {STORIES.map((story) => {
            if (story.type === "oval") {
              return (
                <article className="v5-story-card v5-story-card--oval" key={story.id}>
                  <div className="v5-story-card__oval-frame">
                    <img src={story.img} alt={story.alt} loading="lazy" />
                    <div className="v5-story-card__overlay">
                      <span className="v5-story-card__pill-tag">{story.tag}</span>
                      <h4>{story.title}</h4>
                      <p>{story.desc}</p>
                    </div>
                  </div>
                </article>
              );
            }

            if (story.type === "split-quote") {
              return (
                <article className="v5-story-card v5-story-card--split" key={story.id}>
                  <div className="v5-story-card__split-top">
                    <img src={story.topImg} alt={story.topAlt} loading="lazy" />
                  </div>
                  <div className="v5-story-card__split-bottom">
                    <div className="v5-story-card__quote-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="v5-story-card__quote-text">{story.quote}</p>
                    <div className="v5-story-card__quote-foot">
                      <div>
                        <strong className="v5-story-card__source">{story.sourceName}</strong>
                        <span className="v5-story-card__source-sub">{story.sourceSubtitle}</span>
                      </div>
                      <Link to={story.link} className="v5-story-card__link-btn" aria-label="Read clinical evidence">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            }

            if (story.type === "video-pure") {
              return (
                <article
                  className="v5-story-card v5-story-card--pure"
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveStory(story); }}
                >
                  <div className="v5-story-card__pure-media">
                    <img src={story.img} alt={story.alt} loading="lazy" />
                    <button
                      type="button"
                      className="v5-story-card__play-badge"
                      aria-label="Play story video"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                    {story.badge && <span className="v5-story-card__badge">{story.badge}</span>}
                  </div>
                </article>
              );
            }

            return (
              <article
                className="v5-story-card v5-story-card--video"
                key={story.id}
                onClick={() => setActiveStory(story)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveStory(story); }}
              >
                <div className="v5-story-card__media">
                  <img src={story.img} alt={story.alt} loading="lazy" />
                  <button
                    type="button"
                    className="v5-story-card__play-badge"
                    aria-label={`Play story by ${story.title}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                  <span className="v5-story-card__badge">{story.badge}</span>
                </div>
                <div className="v5-story-card__content">
                  <h3 className="v5-story-card__name">{story.title}</h3>
                  <span className="v5-story-card__role">{story.role}</span>
                  <p className="v5-story-card__preview-quote">{story.quote}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Video Modal Preview */}
      {activeStory && (
        <div className="v5-story-modal-scrim" onClick={() => setActiveStory(null)}>
          <div className="v5-story-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="v5-story-modal__close"
              onClick={() => setActiveStory(null)}
              aria-label="Close story video"
            >
              ✕
            </button>
            <div className="v5-story-modal__video-wrap">
              {activeStory.video ? (
                <video
                  src={activeStory.video}
                  autoPlay
                  controls
                  playsInline
                  className="v5-story-modal__video"
                  poster={activeStory.img}
                />
              ) : (
                <img src={activeStory.img} alt={activeStory.alt} className="v5-story-modal__fallback-img" />
              )}
            </div>
            <div className="v5-story-modal__info">
              <span className="v5-story-card__badge">{activeStory.badge}</span>
              <h3>{activeStory.title}</h3>
              <p className="v5-story-modal__role">{activeStory.role}</p>
              <p className="v5-story-modal__quote">{activeStory.quote}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
