import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getBlogs } from "../../services/blogService";

const Blogs = () => {
  const [dynamicBlogs, setDynamicBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticBlogs = [
    {
      id: 2,
      title: "How Your Gut Talks to Your Brain: The Gut-Brain Axis & Mood",
      excerpt:
        "Discover how your gut and brain communicate, how the gut-brain axis impacts your mood, and why postbiotics like Thirdbiome GTB™ are a game-changer for emotional wellness.",
      topicSlug: "gut-brain-axis",
      readTime: "9 min read",
      category: "Microbiome",
      image:
        "https://ik.imagekit.io/starfiitstorage/pexels-nadezhda-moryak-9162030.jpg?updatedAt=1752573155097",
      author: "Dr. Sarah Johnson",
      date: "December 20, 2024",
      status: "Published",
    },
    {
      id: 3,
      title:
        "What Are SCFAs — And Why They’re the Missing Link in Your Health?",
      excerpt:
        "Discover the crucial role of short-chain fatty acids (SCFAs) in gut, brain, and metabolic health—and how postbiotics like Thirdbiome GTB™ can restore your microbiome's voice.",
      topicSlug: "scfa-health",
      readTime: "8 min read",
      category: "Microbiome",
      image:
        "https://ik.imagekit.io/starfiitstorage/pexels-shkrabaanthony-6823339%20(1).jpg?updatedAt=1752573306938",
      author: "Dr. Sarah Johnson",
      date: "December 27, 2024",
      status: "Published",
    },
    {
      id: 4,
      title: "Why Thirdbiome GTB Is the Super Molecule Your Gut Is Praying For",
      excerpt:
        "Discover why Thirdbiome GTB is the cornerstone of true digestive healing—the 'super molecule' your gut and entire body silently needs for optimal health.",
      topicSlug: "Thirdbiome GTB-super-molecule",
      readTime: "7 min read",
      category: "Microbiome",
      image:
        "https://ik.imagekit.io/starfiitstorage/pexels-edward-jenner-4031442.jpg",
      author: "Dr. Sarah Johnson",
      date: "January 3, 2025",
      status: "Published",
    },
    {
      id: 5,
      title:
        "What Does Microencapsulated TryThirdbiome GTB Do Inside Your Gut? A Deep Dive into Postbiotic Action",
      excerpt:
        "Discover how this next-gen postbiotic transforms your gut from the inside out—the science behind Microencapsulated TryThirdbiome GTB and its revolutionary impact on gut health.",
      topicSlug: "microencapsulated-tryThirdbiome GTB",
      readTime: "9 min read",
      category: "Postbiotics",
      image:
        "https://ik.imagekit.io/starfiitstorage/pexels-anntarazevich-7904415.jpg",
      author: "Dr. Sarah Johnson",
      date: "January 10, 2025",
      status: "Published",
    },
    {
      id: 6,
      title:
        "Curd, Buttermilk and Probiotics: Are They Enough for Modern Gut Health?",
      excerpt:
        "Explore why traditional Indian probiotics like curd and buttermilk may not be sufficient for modern gut health challenges—and how postbiotics bridge the gap.",
      topicSlug: "traditional-probiotics",
      readTime: "8 min read",
      category: "Traditional Foods",
      image:
        "https://ik.imagekit.io/starfiitstorage/pexels-jonathanborba-3622474.jpg",
      author: "Dr. Sarah Johnson",
      date: "January 17, 2025",
      status: "Published",
    },
    {
      id: 7,
      title: "What Your Poop Says About Your Health — And How to Fix It",
      excerpt:
        "Your poop is your body's daily health report. Learn to decode the Bristol Stool Chart and understand what your stool reveals about your gut health, mood, and overall wellness.",
      topicSlug: "poop-health-decoder",
      readTime: "10 min read",
      category: "Gut Health",
      image:
        "https://ik.imagekit.io/starfiitstorage/pexels-cottonbro-6805066.jpg",
      author: "Dr. Sarah Johnson",
      date: "January 24, 2025",
      status: "Published",
    },
  ];

  const featuredPost = {
    id: 1,
    title:
      "Postbiotics vs Probiotics vs Prebiotics: What's the Real Difference?",
    excerpt:
      "When it comes to gut health, the words probiotics, prebiotics, and postbiotics are often thrown around interchangeably. But they're not the same — and understanding the difference could change the way you approach your digestive health forever.",
    topicSlug: "postbiotics-vs-probiotics",
    readTime: "8 min read",
    category: "Microbiome",
    image:
      "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
    author: "Dr. Sarah Johnson",
    date: "December 15, 2024",
    status: "Published",
  };

  useEffect(() => {
    fetchDynamicBlogs();
  }, []);

  const fetchDynamicBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs();

      console.log("Blog API Response:", response);

      // Explicitly handle the structure from https://admin.thirdbiome.com/api/v1/blog
      // { success: true, data: { current_page: 1, data: [ ... ], ... } }
      let blogsArray = [];

      if (response && response.data && response.data.data && Array.isArray(response.data.data.data)) {
        // Match for Laravel paginated 'data.data.data' structure
        blogsArray = response.data.data.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        // Match for simple 'data.data' array
        blogsArray = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        // Match for simple 'data' array
        blogsArray = response.data;
      } else {
        // Fallback: search for any array in the response
        const findBlogArray = (obj) => {
          if (!obj || typeof obj !== "object") return null;
          if (Array.isArray(obj)) return obj;
          for (const key in obj) {
            if (typeof obj[key] === "object") {
              const found = findBlogArray(obj[key]);
              if (found) return found;
            }
          }
          return null;
        };
        blogsArray = findBlogArray(response) || [];
      }

      console.log("Extracted Blogs Array:", blogsArray);

      // Log each blog's key details in a table for easy debugging
      console.table(
        blogsArray.map((blog) => ({
          title: blog.title,
          slug: blog.slug,
          status: blog.status,
          date: blog.date || blog.created_at,
          category: blog.category,
        }))
      );

      // Only show blogs with status "Published"
      const publishedBlogs = blogsArray.filter(
        (blog) => blog.status && blog.status.toLowerCase() === "published"
      );
      console.log("Published Blogs (count: " + publishedBlogs.length + "):", publishedBlogs);
      setDynamicBlogs(publishedBlogs);
    } catch (error) {
      console.error("Failed to fetch dynamic blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out static blogs if they already exist in dynamicBlogs (by slug)
  const filteredStaticBlogs = staticBlogs.filter(
    (staticBlog) => !dynamicBlogs.some((dyn) => dyn.slug === staticBlog.topicSlug)
  );

  // Combine and sort by date (newest first)
  const allBlogs = [...dynamicBlogs, featuredPost, ...filteredStaticBlogs].sort(
    (a, b) => {
      const dateA = new Date(a.date || a.created_at || "2024-01-01");
      const dateB = new Date(b.date || b.created_at || "2024-01-01");
      return dateB - dateA;
    },
  );

  const displayFeatured = allBlogs[0];
  const displayGrid = allBlogs.slice(1);

  // Helper to neatly format raw backend dates like "2026-03-25T14:19:00.000000Z" to "March 25, 2026"
  const formatDateString = (rawDate) => {
    if (!rawDate) return "March 2025";
    try {
      // If it's an ISO string, we can split by 'T' and parse or directly parse
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return rawDate.toString().split("T")[0];
    } catch (e) {
      return rawDate;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Header Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br bg-[#034327] "></div>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
           Gut Feeling.
          </h1>

          <p className="text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Exploring the frontiers of microbiome science and gut health
            innovation.
          </p>
        </div>
      </div>

      {/* Featured Article - Glassmorphism */}
      {displayFeatured && (
        <div className="max-w-6xl mx-auto px-6 -mt-12 mb-20">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden shadow-emerald-900/10">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img
                  src={
                    displayFeatured.image ||
                    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200"
                  }
                  alt="Featured blog"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#114639] text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {displayFeatured.category || "Health"}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6 text-sm text-gray-500 font-medium tracking-wide">
                  <span>
                    {formatDateString(
                      displayFeatured.date || displayFeatured.created_at,
                    )}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{displayFeatured.readTime || "5 min read"}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {displayFeatured.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {displayFeatured.excerpt ||
                    displayFeatured.content?.substring(0, 150) + "..."}
                </p>
                <div>
                  <Link
                    to={
                      displayFeatured.topicSlug
                        ? `/blogs/${displayFeatured.topicSlug}`
                        : `/blogs/detail/${displayFeatured.slug || displayFeatured._id}`
                    }
                    className="group inline-flex items-center gap-2 bg-[#114639] text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-[#1a6b57] hover:shadow-lg hover:shadow-emerald-900/20"
                  >
                    Read Full Article
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold text-gray-900">Latest Insights</h3>
          <div className="h-0.5 flex-1 bg-gray-100 mx-8 hidden md:block"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#114639]"></div>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {displayGrid.map((post, index) => (
              <article
                key={post.slug || post._id || post.id || `blog-${index}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-900/5 flex flex-col h-full border border-gray-100"
              >
                <Link
                  to={
                    post.topicSlug
                      ? `/blogs/${post.topicSlug}`
                      : `/blogs/detail/${post.slug || post._id}`
                  }
                  className="relative aspect-[16/10] overflow-hidden block"
                >
                  <img
                    src={
                      post.image ||
                      post.image_url ||
                      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#114639] text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                      {post.category || "Microbiome"}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>
                      {formatDateString(post.date || post.created_at)}
                    </span>
                    {post.readTime && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>
                  <Link
                    to={
                      post.topicSlug
                        ? `/blogs/${post.topicSlug}`
                        : `/blogs/detail/${post.slug || post._id}`
                    }
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#114639] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt || post.content?.substring(0, 150) + "..."}
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={
                        post.topicSlug
                          ? `/blogs/${post.topicSlug}`
                          : `/blogs/detail/${post.slug || post._id}`
                      }
                      className="inline-flex items-center gap-2 text-[#114639] font-bold text-sm tracking-wide transition-all hover:gap-3"
                    >
                      READ ARTICLE
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
