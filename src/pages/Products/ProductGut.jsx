import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import productImg from "../../assets/imageTest.webp";
import { getProducts } from "../../services/productService";
import { addToCart, generateSessionId } from "../../services/cartService";
import { showToast } from "../../utils/toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { formatImageUrl } from "../../utils/urlUtils";

import "swiper/css";
import "swiper/css/pagination";

const ProductGut = () => {
  // Use index for selected variant
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const { categorySlug } = useParams();
  const navigate = useNavigate();

  // Define dummy product constant
  const DUMMY_PRODUCT = {
    _id: "dummy_gut_health",
    name: "Third Biome™ Gut",
    description:
      "Advanced postbiotic gut health formula with Thirdbiome GTB™, L-Glutamine, and botanical extracts.",
    images: [
      productImg,
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
    ],
    video: null, // Add a valid video URL if available
    variants: [
      { _id: "v1", name: "1 Month Supply", price: 1530, stock: 100 },
      { _id: "v2", name: "2 Month Supply", price: 2700, stock: 100 },
      { _id: "v3", name: "3 Month Supply", price: 6300, stock: 100 },
    ],
    status: "active",
  };

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch all products
        const response = await getProducts();

        let foundProduct = null;

        if (response.data) {
          // Handle both direct array and paginated response structure
          const productsList =
            response.data.data?.data || response.data.data || [];

          if (categorySlug) {
            const slugToMatch = categorySlug.toLowerCase();
            foundProduct = productsList.find((p) => {
              // Create a search-friendly name by stripping special characters and replacing spaces with hyphens
              const pName = p.name
                ? p.name
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                : "";
              return pName === slugToMatch || p.slug === slugToMatch;
            });
          } else if (productsList.length > 0) {
            // If no categorySlug, default to the first active product
            foundProduct =
              productsList.find((p) => p.status === "active") ||
              productsList[0];
          }
        }

        if (foundProduct) {
          // Normalize images - prefer imageUrls from API
          if (foundProduct.imageUrls && foundProduct.imageUrls.length > 0) {
            foundProduct.images = foundProduct.imageUrls;
          }
          // Normalize video - prefer videoUrl from API
          if (foundProduct.videoUrl) {
            foundProduct.video = foundProduct.videoUrl;
          }
          setProduct(foundProduct);
          setSelectedImage(0);
          setError(null);
        } else {
          console.warn("Product not found in API, using dummy data.");
          setProduct(DUMMY_PRODUCT);
          setSelectedImage(0);
        }
      } catch (err) {
        console.error("Failed to load product from API:", err);
        setError(
          "Failed to load product data. This might be due to a database connection issue.",
        );
        setProduct(DUMMY_PRODUCT);
        setSelectedImage(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [categorySlug]);

  // Update selectedVariantIndex when product loads or variants change
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      if (
        selectedVariantIndex < 0 ||
        selectedVariantIndex >= product.variants.length
      ) {
        setSelectedVariantIndex(0);
      }
    }
  }, [product, selectedVariantIndex]);

  // Stock checking removed - no stock API calls on product page

  const testimonials = [
    {
      heading: "Revolutionary gut healing approach",
      quote:
        "Third Biome Gut has transformed how I approach gut health with my patients. Unlike traditional probiotics, this postbiotic formula delivers immediate results. The Thirdbiome GTB™ technology really works - my patients report significant improvements in gut barrier function and overall digestive comfort within weeks.",
      name: "Dr. Anita Sharma",
      title: "Gastroenterologist, MD, MBBS, DNB",
      subtitle: "About Third Biome Gut",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    },

    {
      heading: "My go-to gut health recommendation",
      quote:
        "I've tried many gut health products with my clients, but Third Biome Gut stands out. The postbiotic approach makes so much sense - you're getting the benefits without the uncertainty of live bacteria. My clients love how gentle yet effective it is for their digestive issues.",
      name: "Ravi Kumar",
      title: "Certified Nutritionist & Wellness Coach",
      subtitle: "About Third Biome Gut",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    },

    {
      heading: "Remarkable results for IBS patients",
      quote:
        "Third Biome Gut has been a game-changer for my IBS patients. The combination of Thirdbiome GTB and L-Glutamine provides comprehensive gut healing. I've seen remarkable improvements in bloating, irregular bowel movements, and overall gut comfort. It's now my first-line recommendation.",
      name: "Dr. Mithun Joshi",
      title: "Internal Medicine Specialist, MD, MRCP",
      subtitle: "About Third Biome Gut",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    },

    {
      heading: "Start with your gut",
      quote:
        "Start with your gut not your sugar levels or weight. Healing begins there",
      name: "Dr. Jonathan",
      title: "Post graduate from Sri Ramachandra medical college",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Janarathanan.jpg.jpeg",
    },

    {
      heading: "Gut health impacts overall wellness",
      quote:
        "Gut health is not digestion. It’s link to fatigue, inflammation, skin and mood problem. Postbiotics can rebalance it.",
      name: "Dr. Keerthika",
      title: "MBBS, MD, Sri Ramchandra medical college",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Keerthika.jpg.jpeg",
    },

    {
      heading: "Science-backed formulation",
      quote:
        "So many products today are built on trends. Third biome is different. This is a formulation developed by clinicians grounded in butyrate science tailored for the Indian microbiome diversity and mapped to real patient outcomes",
      name: "Dr. Balaji",
      title: "MBBS, MD, Department of pharmacology from SRMC",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Balaji.jpg.jpeg",
    },

    {
      heading: "Smarter gut interventions",
      quote:
        "Patients don’t need more pills. They need smarter interventions and postbiotics are one!",
      name: "Dr. Ram Prabhakaran",
      title: "MBBS, MD, Sri Ramachandra medical college",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Dr. Ram Prabhakaran.jpg.jpeg",
    },

    {
      heading: "Foundation for metabolic health",
      quote:
        "Improving gut integrity is foundational to metabolic health. Postbiotic supports that without any side effects",
      name: "Dr. Raj Mohan",
      title: "MBBS, MD, Department of pharmacology from SRMC",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Raj Mohan.jpg.jpeg",
    },

    {
      heading: "Support for fatigue and PCOD",
      quote:
        "I recommend postbiotics to anyone dealing with fatigue, PCOD and digestive distress",
      name: "Dr. Sandeep",
      title: "MBBS, MD, Sri Ramachandra medical college",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Sandeep.jpg.jpeg",
    },

    {
      heading: "Tributyrin clinical efficiency",
      quote:
        "As pharmacologist, we appreciate esters like tributyrin it bypasses the upper GI and reaches the colon intact maximizing its clinical efficacy",
      name: "Dr.Nidharshan",
      title: "MBBS, MD, Sri Ramachandra medical college",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Nidhrshan.jpg.jpeg",
    },

    {
      heading: "Innovation in postbiotics",
      quote:
        "So today we take many pills, but we are not in need of pills. But we need more innovations and one such innovation is postbiotics. And I highly command the third biome on their innovations on Postbiotics",
      name: "Dr. Tejas",
      title: "MBBS, MD, Department of pharmacology from SRMC",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Tejas.jpg.jpeg",
    },

    {
      heading: "Postbiotics for chronic conditions",
      quote:
        "In India, there are many chronic patients with obesity, diabetes and PCOS. They have underlying gut issues that’s where Postbiotics help.",
      name: "Dr. Janarathanan",
      title: "MBBS, MD, SRMC",
      subtitle: "About Third Biome Gut",
      image: "/images/doctors/Jana.jpg.jpeg",
    },
  ];

  const faqData = [
    {
      question: "Who founded Third Biome?",
      answer:
        "Third biome is founder by Jayavardhini Biomedical (uk) & Dr .Ariarasudhan MD  PhD combining clinical expertise  and her physician co-founder in Chennai, India. The team brings pharmacology, biomedical science, and gut health specialization. The parent company, Aeobiome Healthcare, is DPIIT registered (2025) with a patent pending in India.",
    },
    {
      question: "What makes Third Biome different from other gut health brands in India?",
      answer:
        "Third Biome is India's first patented postbiotic brand. While other brands focus on probiotics(live bacteria) or prebiotics (dietary fibre), Third Biome delivers Thirdbiome GTB (microencapsulated glycerol tributyrate)—a butyrate postbiotic that acts directly on the gut lining without relying on bacterial colonization. No Indian brand has done this before.",
    },
    {
      question: "What is the T3B Club?",
      answer:
        "The T3B Club is Third Biome's membership-based, doctor-guided 30-day postbiotic protocol. Members receive Biome Balance sachets, a clinical gut protocol, weekly check-ins, the Gut Letter newsletters and access to our medical team. Cohort 4 opens in April 2026.",
    },
    {
      question: "Where is Third Biome available?",
      answer:
        "Third Biome's public launch is on July 1, 2026, at @thirdbiome.com. Prior to launch, products are available exclusively through the T3B Club cohort program. Join the waitlist now for early access.",
    },
    {
      question: "Is Third Biome's product clinically validated?",
      answer:
        "Yes. Third Biome has run four cohorts of the T3B Club, with over 300 members tracking symptoms using our Gut Feeling scoring system. The formulation is based on peer-reviewed postbiotic and butyrate research and has been developed with clinical oversight.",
    },
    {
      question:
        "What is Third Biome™ Gut, and how is it different from probiotics?",
      answer:
        "Third Biome™ Gut is a postbiotic gut health  powered by Thirdbiome GTB™ (Thirdbiome GTB), L-Glutamine, Peppermint, and Fennel extracts. Unlike probiotics (live bacteria), postbiotics are clinically active metabolites that directly support gut healing, inflammation control, and microbiome balance without the need for live organisms.",
    },
    {
      question: "What does Thirdbiome GTB™ do in my gut?",
      answer:
        "Thirdbiome GTB™ is a patented triglyceride form of Thirdbiome GTB, a short-chain fatty acid that fuels colon cells, repairs the gut lining, reduces inflammation, and regulates bowel movement and supports brain-gut health.",
    },
    {
      question: "How should I take Third Biome™ Gut?",
      answer:
        " Preferably after a Meal, mixed with water, buttermilk, or a smoothie. It's tasteless and odorless and requires no refrigeration.",
    },
    {
      question: "How soon will I start seeing results?",
      answer:
        "Most users report reduced bloating in 5–7 days, improved bowel movements in 2–3 weeks, and enhanced energy and gut-brain clarity in 4–6 weeks.",
    },
    {
      question: "Can I take it along with my probiotics?",
      answer:
        "Yes! In fact, postbiotics like Thirdbiome GTB™ enhance the effect of probiotics by improving the gut environment and nutrient absorption.",
    },
    {
      question: "Is Third Biome™ Gut safe for long-term use?",
      answer:
        "Absolutely. All ingredients are clinically tested, gut-friendly, and non-habit forming. It's suitable for long-term gut health management and prevention.",
    },
    {
      question: "Who should take Third Biome™ Gut?",
      answer:
        "Ideal for those with bloating, gas, indigestion; IBS, irregular stools, food sensitivities; leaky gut, chronic inflammation; PCOS-related gut dysfunction; low energy, brain fog, or mood swings.",
    },
    {
      question: "Is it suitable for vegetarians and vegans?",
      answer:
        "Yes. Third Biome™ Gut is 100% vegetarian, gluten-free, non-GMO, and dairy-free.",
    },
    {
      question: "Does it cause any side effects?",
      answer:
        "The formulation is well-tolerated, even in sensitive guts. Rarely, initial mild gas or stool changes may occur — a sign of microbiome modulation, which settles in a few days.",
    },
    {
      question: "Can it be taken during pregnancy or breastfeeding?",
      answer:
        "Please consult your healthcare provider before using any supplement during pregnancy or lactation, although ingredients like L-Glutamine and Thirdbiome GTB are generally regarded as safe.",
    },
    // {
    //   question: "What is the role of L-Glutamine in this formula?",
    //   answer:
    //     "L-Glutamine is a gut-healing amino acid that helps rebuild the intestinal barrier, reduce gut permeability, and restore healthy gut lining post-infection or inflammation.",
    // },
    {
      question: "How do peppermint and fennel extracts help?",
      answer:
        "These botanicals relax the gut muscles, reduce cramping, spasms, and bloating, and support smooth digestion without synthetic antacids or laxatives.",
    },
    {
      question: "Can I use this daily or only when I feel bloated?",
      answer:
        "Third Biome™ Gut is designed for daily use to reset and maintain gut health. Regular use provides cumulative benefits beyond occasional relief.",
    },
    {
      question: "How is this different from fiber or psyllium husk?",
      answer:
        "Fiber only feeds gut bacteria. Thirdbiome GTB™ delivers active Thirdbiome GTB, while L-Glutamine repairs the lining and botanicals relieve symptoms. It works at a deeper, cellular level than fiber supplements.",
    },
    {
      question: "Is it suitable for people with IBS or IBD?",
      answer:
        "Yes — the formulation is FODMAP-friendly and designed for sensitive guts. Thirdbiome GTB and L-Glutamine are clinically studied in IBS/IBD for reducing inflammation and improving stool quality.",
    },
  ];

  // Get variants
  const variants = product?.variants || [];
  const selectedVariant = variants[selectedVariantIndex] || {};

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Debug: Log the current state

  return (
    <div className=" bg-white">
      <Navbar />

      {/* Main Product Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Product Images */}
          <div className="flex flex-col">
            <div className="w-full aspect-square bg-[#F8FAFC] rounded-2xl flex items-center justify-center overflow-hidden relative border border-gray-100 shadow-sm">
              {selectedImage === "video" && product?.video ? (
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-contain"
                  poster={formatImageUrl(product.images?.[0])}
                >
                  <source
                    src={formatImageUrl(product.video)}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : product?.images &&
                product.images.length > 0 &&
                typeof selectedImage === "number" ? (
                imageErrors[selectedImage] ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={formatImageUrl(product.images[selectedImage])}
                    alt={product?.name || "Product"}
                    className="w-full h-full object-contain p-4"
                    onError={() => handleImageError(selectedImage)}
                  />
                )
              ) : (
                <img
                  src={productImg}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-contain p-4"
                />
              )}
            </div>

            {/* Thumbnail Images and Video */}
            <div className="flex gap-3 sm:gap-4 justify-start overflow-x-auto pb-2 mt-6 scrollbar-hide">
              {/* Image thumbnails */}
              {product?.images?.map((image, i) => (
                <button
                  key={i}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white border-2 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:border-[#004345] overflow-hidden ${
                    i === selectedImage
                      ? "border-[#004345] ring-2 ring-[#004345]/20 shadow-sm"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  {imageErrors[`thumb_${i}`] ? (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={formatImageUrl(image)}
                      alt={`Product view ${i + 1}`}
                      className="w-full h-full object-contain p-2"
                      onError={() => handleImageError(`thumb_${i}`)}
                    />
                  )}
                </button>
              ))}

              {/* Video thumbnail */}
              {product?.video && (
                <button
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-black border-2 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:border-[#004345] relative overflow-hidden ${
                    selectedImage === "video"
                      ? "border-[#004345] ring-2 ring-[#004345]/20 shadow-sm"
                      : "border-gray-800"
                  }`}
                  onClick={() => setSelectedImage("video")}
                >
                  <img
                    src={formatImageUrl(
                      product.video + "/ik-thumbnail.jpg?tr=so-1,w-300",
                    )}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                      e.target.src = productImg;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                      <span className="text-[#004345] text-xs ml-0.5">▶</span>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#034327] mb-3 sm:mb-4">
                {product?.name || "Third Biome™ Gut"}
              </h1>

              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                {product?.description}
              </p>

              <p className="text-gray-900 font-bold mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed">
                Key effects
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center bg-[#f5fffb] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#034327] rounded-full"></div>
                  <span className="text-gray-800 text-[13px] sm:text-[14px] font-medium">
                    Repairs intestinal barrier
                  </span>
                </div>
                <div className="flex items-center bg-[#f5fffb] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#034327] rounded-full"></div>
                  <span className="text-gray-800 text-[13px] sm:text-[14px] font-medium">
                    Calms gut-brain link
                  </span>
                </div>
                <div className="flex items-center bg-[#f5fffb] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#034327] rounded-full"></div>
                  <span className="text-gray-800 text-[13px] sm:text-[14px] font-medium">
                    Balances gut motility
                  </span>
                </div>
                <div className="flex items-center bg-[#f5fffb] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#034327] rounded-full"></div>
                  <span className="text-gray-800 text-[13px] sm:text-[14px] font-medium">
                    Mood & focus support
                  </span>
                </div>
              </div>

              {/* Pricing Options */}
              <div className="space-y-3 mb-6">
                {variants.map((variant, index) => (
                  <label
                    key={variant._id}
                    className={`flex items-center justify-between p-4 sm:p-5 border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedVariantIndex === index
                        ? "border-[#034327] bg-[#f5fffb]/30 ring-1 ring-[#034327]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="relative flex items-center mr-3 sm:mr-4">
                        <input
                          type="radio"
                          name="plan"
                          value={variant.name}
                          checked={selectedVariantIndex === index}
                          onChange={() => setSelectedVariantIndex(index)}
                          className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full checked:border-[#034327] transition-all"
                        />
                        <div className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#034327] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                          <span
                            className={`text-base sm:text-lg font-bold ${
                              selectedVariantIndex === index
                                ? "text-gray-900"
                                : "text-gray-800"
                            }`}
                          >
                            {variant.name}
                          </span>
                          {(index === 1 || variant.isPopular) && (
                            <span className="bg-[#ebf6f2] text-[#034327] text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                              Most Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <span className="text-xl sm:text-2xl font-black text-gray-900">
                        ₹{variant.price}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={async () => {
                  try {
                    const productId = product?._id || product?.id;
                    const variantId =
                      selectedVariant?._id ||
                      selectedVariant?.id ||
                      selectedVariant?.name;
                    if (!product || !productId) {
                      showToast.error("Product not loaded");
                      return;
                    }

                    setIsAddingToCart(true);

                    if (!localStorage.getItem("sessionId")) {
                      await generateSessionId();
                    }

                    const quantity = 1;
                    await addToCart(variantId, productId, quantity);

                    showToast.success("Added to cart successfully!");
                    setIsCartDrawerOpen(true);
                  } catch (err) {
                    console.error("Add to cart error:", err);
                    if (err.message && err.message.includes("stock")) {
                      showToast.error(err.message);
                    } else {
                      const errorMsg =
                        err.response?.data?.message ||
                        err.message ||
                        "Failed to add to cart";
                      showToast.error(errorMsg);
                    }
                  } finally {
                    setIsAddingToCart(false);
                  }
                }}
                disabled={isAddingToCart}
                className={`w-full font-bold py-4 sm:py-5 text-lg sm:text-xl transition-all duration-300 rounded-sm shadow-md ${
                  isAddingToCart
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#034327] hover:bg-[#02331d] text-white active:scale-[0.99]"
                }`}
              >
                {isAddingToCart
                  ? "Adding to cart..."
                  : `Add to cart - ₹${selectedVariant.price || 1530}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About the Product Section */}
      <div className="bg-gradient-to-br from-[#f5fffb] to-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#004345] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🧬</span>
              </div>
              <h2 className="text-3xl font-bold text-[#004345]">
                About the Product
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-left border border-[#ebf6f2] relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#004345]/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#004345]/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-r from-[#f5fffb] to-white rounded-lg p-6 mb-6 border border-[#ebf6f2]">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    <span className="font-semibold text-[#004345]">
                      Third Biome Gut
                    </span>{" "}
                    is not just another probiotic. It is India's{" "}
                    <span className="font-bold text-[#004345]">
                      first clinically-designed postbiotic sachet
                    </span>
                    created to directly deliver{" "}
                    <span className="font-semibold text-[#004345]">
                      Thirdbiome GTB™
                    </span>{" "}
                    — the key short-chain fatty acid (SCFA) responsible for
                    healing the gut lining and regulating the microbiome.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Unlike live probiotics that may not survive your stomach
                    acid, Third Biome Gut works deeper and smarter by:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-[#f5fffb] rounded-lg p-3 hover:bg-[#ebf6f2] transition-colors">
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🔋</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Fueling colon cells
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#f5fffb] rounded-lg p-3 hover:bg-[#ebf6f2] transition-colors">
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🛡️</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Tightening the gut barrier
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#f5fffb] rounded-lg p-3 hover:bg-[#ebf6f2] transition-colors">
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🔥</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Reducing inflammation
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#f5fffb] rounded-lg p-3 hover:bg-[#ebf6f2] transition-colors">
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">⚖️</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Easing bloating and motility issues
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#004345] to-[#003335] rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💊</span>
                    <h3 className="text-xl font-bold">
                      Your Daily Microbiome Support System
                    </h3>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    Simplified into a single sachet for optimal gut health
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Science Behind Third Biome™ Gut Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Clean Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#004345] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🔬</span>
              </div>
              <h2 className="text-4xl font-bold text-[#004345]">
                The Science Behind Third Biome™
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the revolutionary postbiotic technology that powers
              Third Biome™ Gut
            </p>
          </div>

          {/* Simple Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Traditional Probiotics */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Traditional Probiotics
                  </h3>
                  <p className="text-red-600 text-sm">Limited Effectiveness</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <p className="text-gray-700">
                    Live bacteria that may not survive stomach acid
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <p className="text-gray-700">
                    Unpredictable results and limited benefits
                  </p>
                </div>
              </div>
            </div>

            {/* Postbiotics */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#f5fffb] rounded-full flex items-center justify-center">
                  <span className="text-[#004345] text-xl">✅</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Postbiotics
                  </h3>
                  <p className="text-[#004345] text-sm">Advanced Technology</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#f5fffb] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#004345] text-xs">✓</span>
                  </div>
                  <p className="text-gray-700">
                    Deliver active metabolites directly to gut cells
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#f5fffb] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#004345] text-xs">✓</span>
                  </div>
                  <p className="text-gray-700">
                    Survive stomach acid and reach colon intact
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thirdbiome GTB™ Technology */}
          <div className="bg-gradient-to-r from-[#004345] to-[#003335] rounded-2xl p-12 text-white mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🧬</span>
                </div>
                <h3 className="text-3xl font-bold">
                  Thirdbiome GTB™ Technology
                </h3>
              </div>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                A triglyceride-bound Thirdbiome GTB that reaches your colon
                intact and delivers powerful healing benefits
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🛡️",
                  title: "Repairs Barrier",
                  desc: "Fixes leaky gut issues",
                },
                {
                  icon: "🧠",
                  title: "Calms Inflammation",
                  desc: "Reduces gut-brain inflammation",
                },
                {
                  icon: "⚖️",
                  title: "Balances Motility",
                  desc: "Improves digestive rhythm",
                },
                {
                  icon: "🎯",
                  title: "Brain-Gut Axis",
                  desc: "Enhances mood and focus",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">{benefit.icon}</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm opacity-90">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Statement */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-[#f5fffb] rounded-full px-8 py-4 border border-[#ebf6f2]">
              <div className="w-12 h-12 bg-[#004345] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">⚡</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-[#004345]">
                  Scientific Innovation
                </h3>
                <p className="text-sm text-gray-600">
                  Advanced postbiotic technology for optimal gut health
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Functions Section */}
      <div className="bg-gradient-to-br from-[#f5fffb] via-white to-[#f5fffb] py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with animated elements */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#004345] to-[#003335] rounded-full flex items-center justify-center shadow-2xl relative">
                <span className="text-white text-3xl">🧪</span>
                <div className="absolute inset-0 bg-gradient-to-br from-[#004345] to-[#003335] rounded-full animate-ping opacity-20"></div>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-[#004345] to-[#003335] bg-clip-text text-transparent leading-normal py-2">
                Ingredients Functions
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scientifically formulated ingredients that work together for
              optimal gut health
            </p>
          </div>

          {/* Interactive Ingredient Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Thirdbiome GTB™ */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#004345]/10 to-[#003335]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-[#ebf6f2] hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#004345] to-[#003335] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">🧪</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#004345]">
                      Thirdbiome GTB™
                    </h3>
                    <p className="text-lg text-[#004345] font-semibold">
                      500mg
                    </p>
                    <p className="text-sm text-gray-500">
                      Patented postbiotic, clinically backed
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Delivers Thirdbiome GTB directly to the colon",
                    "Heals intestinal lining and reduces inflammation",
                    "Modulates gut-brain signaling",
                    "Supports gut immunity and SCFA balance",
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-[#f5fffb] rounded-xl hover:bg-[#ebf6f2] transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* L-Glutamine */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#004345]/10 to-[#003335]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-[#ebf6f2] hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#004345] to-[#003335] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">🔧</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#004345]">
                      L-Glutamine
                    </h3>
                    <p className="text-lg text-[#004345] font-semibold">1g</p>
                    <p className="text-sm text-gray-500">
                      Backed by: Kim MH et al., J Clin Med, 2017
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Key amino acid for intestinal repair",
                    "Rebuilds tight junctions in gut barrier",
                    'Reduces permeability ("leaky gut")',
                    "Enhances mucosal immunity",
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-[#f5fffb] rounded-xl hover:bg-[#ebf6f2] transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peppermint Extract */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#004345]/10 to-[#003335]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-[#ebf6f2] hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#004345] to-[#003335] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">🌿</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#004345]">
                      Peppermint Extract
                    </h3>
                    <p className="text-lg text-[#004345] font-semibold">30mg</p>
                    <p className="text-sm text-gray-500">
                      Backed by: Cash BD et al., Digestive Diseases and
                      Sciences, 2016
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Smooth muscle relaxant",
                    "Reduces cramping, spasms, and bloating",
                    "Shown effective in IBS symptom relief",
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-[#f5fffb] rounded-xl hover:bg-[#ebf6f2] transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fennel Extract */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#004345]/10 to-[#003335]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-[#ebf6f2] hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#004345] to-[#003335] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-3xl">🌱</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#004345]">
                      Fennel Extract
                    </h3>
                    <p className="text-lg text-[#004345] font-semibold">50mg</p>
                    <p className="text-sm text-gray-500">
                      Backed by: Badgujar SB et al., BioMed Research
                      International, 2014
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "Natural carminative and antispasmodic",
                    "Reduces intestinal gas and discomfort",
                    "Promotes smoother digestion",
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-[#f5fffb] rounded-xl hover:bg-[#ebf6f2] transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA with floating design */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-white rounded-full px-10 py-6 shadow-2xl border border-[#ebf6f2] hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#004345] to-[#003335] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-[#004345]">
                  Scientifically Formulated
                </h3>
                <p className="text-gray-600">
                  Each ingredient carefully selected and clinically backed for
                  optimal gut health
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline: Symptoms vs. Improvements Section */}
      <div className="bg-gradient-to-br from-[#f5fffb] via-white to-[#f5fffb] py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#004345] to-[#003335] rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-3xl">📈</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-[#004345] to-[#003335] bg-clip-text text-transparent leading-normal py-2">
                Your Journey to Better Gut Health
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your progress as Third Biome™ Gut transforms your gut health
              week by week
            </p>
          </div>

          {/* Modern Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#004345] to-[#003335] hidden lg:block"></div>

            <div className="space-y-12">
              {[
                {
                  week: "Week 1",
                  improvement: "Reduced bloating, easier digestion",
                  icon: "🌱",
                  color: "from-green-400 to-green-600",
                },
                {
                  week: "Week 2",
                  improvement:
                    "More regular bowel movements, less gas/cramping",
                  icon: "⚡",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  week: "Week 3-4",
                  improvement: "Improved stool consistency, reduced urgency",
                  icon: "🛡️",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  week: "Week 5-6",
                  improvement: "Increased energy, better mood, sharper focus",
                  icon: "🧠",
                  color: "from-orange-400 to-orange-600",
                },
                {
                  week: "Week 6-8",
                  improvement: "Long-term gut resilience, stronger immunity",
                  icon: "🏆",
                  color: "from-[#004345] to-[#003335]",
                },
              ].map((timeline, index) => (
                <div
                  key={index}
                  className={`group relative ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-[#004345] rounded-full z-10 hidden lg:block">
                    <div className="w-4 h-4 bg-[#004345] rounded-full mx-auto mt-1"></div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`lg:w-5/12 ${
                      index % 2 === 0
                        ? "lg:mr-auto lg:pr-8"
                        : "lg:ml-auto lg:pl-8"
                    }`}
                  >
                    <div className="group relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${timeline.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                      ></div>
                      <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${timeline.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <span className="text-white text-2xl">
                              {timeline.icon}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[#004345]">
                              {timeline.week}
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-[#004345] to-[#003335] rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed font-medium">
                          {timeline.improvement}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-6 bg-white rounded-full px-10 py-6 shadow-2xl border border-[#ebf6f2] hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#004345] to-[#003335] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-[#004345]">
                  Start Your Journey
                </h3>
                <p className="text-gray-600">
                  Begin experiencing these improvements with Third Biome™ Gut
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 italic">
              Results may vary based on baseline gut health and lifestyle.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}

      <div className="bg-[#004345] py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Title */}

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">
              What customers and healthcare providers say
            </h2>
          </div>

          {/* Carousel */}

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="flex">
                <div className="bg-white rounded-xl p-7 shadow-md border border-[#ebf6f2] flex flex-col w-full min-h-[320px]">
                  {/* Heading */}

                  <h3 className="text-lg font-semibold text-[#004345] mb-4 min-h-[48px]">
                    {testimonial.heading}
                  </h3>

                  {/* Quote */}

                  <div className="flex-grow mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-5">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Author */}

                  <div className="flex items-center mt-auto">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[#ebf6f2] mr-4">
                      <img
                        src={formatImageUrl(testimonial.image)}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-[#004345] font-semibold text-sm">
                        {testimonial.name}
                      </h4>

                      <p className="text-xs text-gray-600">
                        {testimonial.title}
                      </p>

                      <p className="text-xs text-[#004345] font-medium">
                        {testimonial.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Video Grid */}

        {/* Doctor Video Testimonials */}

        <div className="mt-20 max-w-7xl mx-auto px-6">
          {/* Title */}

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Biome Stories</h2>
          </div>

          {/* Video Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Card */}

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ebf6f2]">
              <div className="aspect-[9/16] w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/PHX5KGMsbKs"
                  title="Doctor Testimonial"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Video Card */}

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ebf6f2]">
              <div className="aspect-[9/16] w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/By3wXaX8Mys"
                  title="Doctor Testimonial"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Video Card */}

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ebf6f2]">
              <div className="aspect-[9/16] w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/rKheM1scMmA"
                  title="Doctor Testimonial"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004345] mb-3">
              FAQ Questions
            </h2>
            <div className="w-24 h-1 bg-[#004345] mx-auto rounded-full"></div>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  expandedFAQ === index
                    ? "border-l-4 border-[#004345] shadow-md bg-[#f5fffb]"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <button
                  className="w-full text-left p-5 focus:outline-none"
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === index ? -1 : index)
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`text-base md:text-lg font-semibold ${
                        expandedFAQ === index
                          ? "text-[#004345]"
                          : "text-gray-800"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                        expandedFAQ === index
                          ? "bg-[#004345] text-white rotate-180"
                          : "bg-gray-100 text-[#004345]"
                      }`}
                    >
                      {expandedFAQ === index ? "−" : "+"}
                    </div>
                  </div>

                  {/* Answer */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedFAQ === index
                        ? "max-h-40 mt-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </div>
  );
};

export default ProductGut;
