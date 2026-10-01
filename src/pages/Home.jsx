import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import hero from "../assets/testing.webp";
import Footer from "../components/Footer";
import BestSeller from "../components/BestSeller";
import productImg from "../assets/imageTest.webp";
import waveSvg from "../assets/wave.svg";
import scienceWave from "../assets/ScienceWave.svg";
import thirdLogo from "../assets/T3BLogo.svg";
import gutBanner from "../assets/gutBanner.jpg";
import getApiClient from "../axios/axios";
import { showToast } from "../utils/toast";
import bannerService from "../services/bannerService";
import { formatImageUrl } from "../utils/urlUtils";

const Home = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isT3BModalOpen, setIsT3BModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [t3bFormData, setT3bFormData] = useState({
    name: "",
    age: "",
    sex: "",
    occupation: "",
    whatsappNumber: "",
    email: "",
  });
  const [t3bErrors, setT3bErrors] = useState({});
  const [isSubmittingT3B, setIsSubmittingT3B] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselIntervalRef = useRef(null);

  const contentData = {
    hospital: {
      title: "Hospitals",
      subtitle: "Traditional Healthcare Approach",
      points: [
        "Treat the disease, not the disruption.",
        "Focus on labs and diagnosis, not daily patterns.",
        "You leave with a prescription, not a plan to change.",
      ],
      color: "from-red-500 to-red-600",
    },
    trackers: {
      title: "Trackers & Wearables",
      subtitle: "Data Without Context",
      points: [
        "Record steps, heartbeats — but not why your body reacts.",
        "Miss the deep bio-signals behind cravings, cycles, and gut shifts.",
        "No real-time intelligence. No habit loop. Just data dump.",
      ],
      color: "from-blue-500 to-blue-600",
    },
    supplements: {
      title: "Generic Supplements",
      subtitle: "One-Size-Fits-All Solutions",
      points: [
        "Just isolated actives, shipped and slapped with a label.",
        "Zero testing for Indian microbiomes or long-term effect.",
        "No personalization, no synergy — just guesswork in a capsule.",
      ],
      color: "from-yellow-500 to-yellow-600",
    },
  };

  const faqData = [
    {
      question: "Who founded Third Biome?",
      answer:
        "Third Biome was co-founded by Jayavardhini and her physician co-founder in Chennai, India. The team brings pharmacology, biomedical science, and gut health specialization. The parent company, Aeobiome Healthcare, is DPIIT registered (2025) with a patent pending in India.",
    },
    {
      question:
        "What makes Third Biome different from other gut health brands in India?",
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
        "Third Biome™ Gut is a postbiotic gut health sachet powered by Thirdbiome GTB™ (Thirdbiome GTB), L-Glutamine, Peppermint, and Fennel extracts. Unlike probiotics (live bacteria), postbiotics are clinically active metabolites that directly support gut healing, inflammation control, and microbiome balance without the need for live organisms.",
    },
    {
      question: "What does Thirdbiome GTB™ do in my gut?",
      answer:
        "Thirdbiome GTB™ is a patented triglyceride form of Thirdbiome GTB, a short-chain fatty acid that fuels colon cells, repairs the gut lining, reduces inflammation, and regulates bowel movement and supports brain-gut health.",
    },
    {
      question: "How should I take Third Biome™ Gut?",
      answer:
        "Take 1 sachet daily, preferably after a meal, mixed with water, buttermilk, or a smoothie. It's tasteless and odorless and requires no refrigeration.",
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
    {
      question: "What is the role of L-Glutamine in this formula?",
      answer:
        "L-Glutamine is a gut-healing amino acid that helps rebuild the intestinal barrier, reduce gut permeability, and restore healthy gut lining post-infection or inflammation.",
    },
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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission here (e.g., API call)
    console.log("Form submitted:", formData);

    // Reset form and close modal
    setFormData({ name: "", phone: "" });
    setErrors({});
    setIsModalOpen(false);

    // You can add a success message or API call here
    alert("Thank you! We'll get back to you soon.");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
      if (errors.phone) {
        setErrors((prev) => ({
          ...prev,
          phone: "",
        }));
      }
    }
  };

  // T3B Club form handlers
  const handleT3BInputChange = (e) => {
    const { name, value } = e.target;
    setT3bFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (t3bErrors[name]) {
      setT3bErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateT3BWhatsApp = (whatsappNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(whatsappNumber.replace(/\D/g, ""));
  };

  const validateT3BEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleT3BWhatsAppChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setT3bFormData((prev) => ({
        ...prev,
        whatsappNumber: value,
      }));
      if (t3bErrors.whatsappNumber) {
        setT3bErrors((prev) => ({
          ...prev,
          whatsappNumber: "",
        }));
      }
    }
  };

  const handleT3BSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!t3bFormData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!t3bFormData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (
      isNaN(t3bFormData.age) ||
      parseInt(t3bFormData.age) < 1 ||
      parseInt(t3bFormData.age) > 120
    ) {
      newErrors.age = "Please enter a valid age";
    }

    if (!t3bFormData.sex.trim()) {
      newErrors.sex = "Sex is required";
    } else if (!["Male", "Female", "Other"].includes(t3bFormData.sex)) {
      newErrors.sex = "Please select a valid option";
    }

    if (!t3bFormData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }

    if (!t3bFormData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!validateT3BWhatsApp(t3bFormData.whatsappNumber)) {
      newErrors.whatsappNumber =
        "Please enter a valid 10-digit WhatsApp number";
    }

    if (!t3bFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateT3BEmail(t3bFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setT3bErrors(newErrors);
      return;
    }

    // Submit to API
    try {
      setIsSubmittingT3B(true);
      const apiClient = await getApiClient();

      const payload = {
        name: t3bFormData.name.trim(),
        age: parseInt(t3bFormData.age),
        sex: t3bFormData.sex,
        occupation: t3bFormData.occupation.trim(),
        whatsappNumber: t3bFormData.whatsappNumber.trim(),
        email: t3bFormData.email.trim(),
      };

      const response = await apiClient.post("/t3b-club-applications", payload);

      if (response.data && response.data.message) {
        showToast.success(
          response.data.message || "Application submitted successfully!"
        );
      } else {
        showToast.success("Application submitted successfully!");
      }

      // Reset form and close modal
      setT3bFormData({
        name: "",
        age: "",
        sex: "",
        occupation: "",
        whatsappNumber: "",
        email: "",
      });
      setT3bErrors({});
      setIsT3BModalOpen(false);
    } catch (error) {
      console.error("T3B Club application error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Full error object:", JSON.stringify(error.response, null, 2));

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 500 ? "Server Error: Please contact support or try again later" :
          (error.response?.status ? `Error ${error.response.status}: ${error.message}` : error.message)) ||
        "Failed to submit application. Please try again.";
      showToast.error(errorMessage);

      // Set API errors if provided
      if (error.response?.data?.errors) {
        setT3bErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmittingT3B(false);
    }
  };

  // Newsletter subscription handlers
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterEmailChange = (e) => {
    const value = e.target.value;
    setNewsletterEmail(value);
    if (newsletterError) {
      setNewsletterError("");
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setNewsletterError("");

    // Validate email
    if (!newsletterEmail.trim()) {
      setNewsletterError("Email is required");
      return;
    }

    if (!validateEmail(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address");
      return;
    }

    // Submit to API
    try {
      setIsSubmittingNewsletter(true);
      const apiClient = await getApiClient();

      const payload = {
        email: newsletterEmail.trim(),
      };

      const response = await apiClient.post("/newsletter/subscribe", payload);

      if (response.data && response.data.message) {
        showToast.success(
          response.data.message || "Successfully subscribed to newsletter!"
        );
      } else {
        showToast.success("Successfully subscribed to newsletter!");
      }

      // Reset form and close modal
      setNewsletterEmail("");
      setIsNewsletterModalOpen(false);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to subscribe. Please try again.";
      showToast.error(errorMessage);

      // Set error message if provided
      if (error.response?.data?.message) {
        setNewsletterError(error.response.data.message);
      }
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  // Fetch carousel images from API
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await bannerService.getBanners();

        if (
          response.success &&
          response.data &&
          Array.isArray(response.data)
        ) {
          // Map the banner data to ensure we have the correct image URL
          const banners = response.data.map((banner) => ({
            url: formatImageUrl(banner.url || banner.imageUrl || banner.image || gutBanner),
            id: banner._id || banner.id,
            ...banner,
          }));

          if (banners.length > 0) {
            setCarouselImages(banners);
          } else {
            // Fallback to default image if no banners
            setCarouselImages([{ url: gutBanner }]);
          }
        } else {
          // Fallback to default image if API response is invalid
          setCarouselImages([{ url: gutBanner }]);
        }
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        // Fallback to default image
        setCarouselImages([{ url: gutBanner }]);
      }
    };

    fetchCarouselImages();
  }, []);

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    if (carouselImages.length > 1) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [carouselImages.length]);

  // Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && carouselImages.length > 1) {
      // Swipe left - next image
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
      // Reset auto-play timer
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
      carouselIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    if (isRightSwipe && carouselImages.length > 1) {
      // Swipe right - previous image
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
      );
      // Reset auto-play timer
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
      carouselIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
  };

  const goToNext = () => {
    if (carouselImages.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
      // Reset auto-play timer
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
      carouselIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
  };

  const goToPrevious = () => {
    if (carouselImages.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
      );
      // Reset auto-play timer
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
      carouselIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#034327] min-h-screen flex items-center justify-center overflow-hidden">
        {/* Custom Wave Background */}
        <div className="absolute inset-0 flex items-center">
          <img
            src={waveSvg}
            alt="wave background"
            className="w-full h-[25vw] object-cover opacity-70"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-block mb-8">
            <span className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-6 py-2 rounded-full text-emerald-100 text-sm font-medium tracking-wide">
              INDIA'S FIRST PATENTED POSTBIOTIC
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-none bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent tracking-tighter">
            To your health.
          </h1>

          {/* Value Propositions */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-light tracking-wide">
                feel unstoppable
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-emerald-400/40"></div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-light tracking-wide">
                be in command
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-emerald-400/40"></div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-light tracking-wide">
                own your flow
              </span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <button
              className="group relative bg-white text-emerald-800 px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:bg-emerald-50 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-emerald-100/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <p className="text-emerald-200/80 text-sm font-light">
              Transform your wellness journey today
            </p>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="bg-white py-40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-[#034327] mb-4">
              It's OK to have high
              <br />
              standards.
            </h2>
          </div>

          {/* Promise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 py-10">
            {/* Top Row - 3 items */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-[#034327]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#034327] mb-1">
                We are clinically tested
              </h3>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-[#034327]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <rect
                    x="9"
                    y="3"
                    width="6"
                    height="18"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                  />
                  <rect
                    x="3"
                    y="9"
                    width="18"
                    height="6"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#034327] mb-1">
                Doctor-Formulated
              </h3>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-[#034327]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <polyline points="9,11 12,14 16,10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#034327] mb-1">
                GMP Certified Facility
              </h3>
            </div>
          </div>

          {/* Bottom Row - 2 items centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-[#034327]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <rect
                    x="2"
                    y="8"
                    width="20"
                    height="10"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="currentColor"
                  />
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#034327] mb-1">
                10,000,000 Doses Sold
              </h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-[#034327]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#034327] mb-1">
                FDA Compliant
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Third Biome Club Section */}
      <section className="bg-[#034327] py-30 relative overflow-hidden">
        {/* Wave Background */}
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 320"
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#022b1f"
              fillOpacity="0.3"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,170.7C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#01241a"
              fillOpacity="0.2"
              d="M0,224L48,234.7C96,245,192,267,288,261.3C384,256,480,224,576,218.7C672,213,768,235,864,234.7C960,235,1056,213,1152,197.3C1248,181,1344,171,1392,165.3L1440,160V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto px-6 text-center">
          {/* T3B Logo */}
          <div className="mb-12">
            <img
              src={thirdLogo}
              alt="Third Biome Club Logo"
              className="mx-auto w-auto h-16 md:h-20 lg:h-24"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />
          </div>
          {/* Main Title */}
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-8 leading-tight">
            Not Just Another Club. A Revolution in Preventive Care.
          </h2>
          {/* Subtitle Points */}
          <div className="space-y-2 mb-12">
            <p className="text-xl md:text-2xl text-white/90 font-light">
              You wake up bloated even when you eat clean
            </p>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Consistently feeling constipated and heavy
            </p>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Your brain feels tired, fatigued & crashed — aren't separate
              problems your gut, hormones, brain are talking to each other
            </p>
          </div>
          {/* Main Description */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-white/90 font-light">
              If this feels like you T3B club was built from lived experiences
              for you backed by patented science
            </p>
          </div>

          <p className="text-xl md:text-2xl text-white/90 font-semibold mb-4">
            Join the T3B club
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsT3BModalOpen(true)}
              className="group relative bg-white text-[#034327] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Take Care of Yourself Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-16 py-20">
            <h2 className="text-4xl md:text-6xl font-bold text-[#034327] mb-0">
              Take care of yourself.
            </h2>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-20 pb-20">
            {/* Left Side - Venn Diagram (Unchanged) */}
            <div className="flex justify-center items-center">
              <div className="relative w-[300px] md:w-[500px] h-[270px] md:h-[450px]">
                {/* Top circle - Health Trackers */}
                <div
                  className="absolute -top-12 md:-top-20 left-1/2 transform -translate-x-1/2 w-56 h-56 md:w-96 md:h-96 rounded-full border-3 border-[#034327] bg-[#034327]/10 flex items-start justify-center pt-8 md:pt-16 cursor-pointer hover:bg-[#034327]/15 transition-all duration-300"
                  onClick={() => setSelectedSection("trackers")}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#034327] mb-1">
                      Health
                    </h3>
                    <p className="text-base font-medium text-[#034327]">
                      Trackers
                    </p>
                  </div>
                </div>

                {/* Bottom left circle - Wellness products */}
                <div
                  className="absolute top-20 md:top-32 -left-12 md:-left-20 w-56 h-56 md:w-96 md:h-96 rounded-full border-3 border-[#034327] bg-[#034327]/10 flex items-center justify-start pl-8 md:pl-16 cursor-pointer hover:bg-[#034327]/15 transition-all duration-300"
                  onClick={() => setSelectedSection("supplements")}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#034327] mb-1">
                      Generic
                    </h3>
                    <p className="text-base font-medium text-[#034327]">
                      Supplements
                    </p>
                  </div>
                </div>

                {/* Bottom right circle - Hospital */}
                <div
                  className="absolute top-20 md:top-32 -right-12 md:-right-20 w-56 h-56 md:w-96 md:h-96 rounded-full border-3 border-[#034327] bg-[#034327]/10 flex items-center justify-end pr-8 md:pr-16 cursor-pointer hover:bg-[#034327]/15 transition-all duration-300"
                  onClick={() => setSelectedSection("hospital")}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#034327]">
                      Hospital
                    </h3>
                  </div>
                </div>

                {/* Center icon */}
                <div className="absolute top-24 md:top-40 left-1/2 transform -translate-x-1/2 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full border-3 border-[#034327] flex items-center justify-center z-10">
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12 text-[#034327]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Side - Clean Content Display */}
            <div className="flex items-center justify-center min-h-[400px]">
              {selectedSection ? (
                /* Content Display */
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-lg w-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#034327] mb-2">
                      {contentData[selectedSection].title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {contentData[selectedSection].subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {contentData[selectedSection].points.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-6 h-6 bg-[#034327] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      className="bg-[#034327] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#034327]/90 transition-colors duration-300"
                      onClick={() => {
                        setSelectedSection(null);
                        navigate("/products");
                      }}
                    >
                      Discover Our Solution
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial State */
                <div className="text-center max-w-md">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="mb-6">
                      <svg
                        className="w-16 h-16 text-[#034327] mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#034327] mb-3">
                      Reveal the Secret
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Click on each circle to discover the secrets of taking
                      better care of yourself.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-[#034327] rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-[#034327] rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#034327] rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full relative">
        {carouselImages.length > 0 ? (
          <div
            className="relative w-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Carousel Images */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
              }}
            >
              {carouselImages.map((item, index) => {
                const rawUrl = item.url || item.imageUrl || item.image || (typeof item === 'string' ? item : "");
                const imageUrl = formatImageUrl(rawUrl || gutBanner);
                const altText =
                  item.alt || item.title || `Carousel ${index + 1}`;
                return (
                  <div
                    key={item.id || index}
                    className="min-w-full flex-shrink-0"
                  >
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6 text-[#034327]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6 text-[#034327]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {carouselImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      // Reset auto-play timer
                      if (carouselIntervalRef.current) {
                        clearInterval(carouselIntervalRef.current);
                      }
                      carouselIntervalRef.current = setInterval(() => {
                        setCurrentImageIndex((prevIndex) =>
                          prevIndex === carouselImages.length - 1
                            ? 0
                            : prevIndex + 1
                        );
                      }, 5000);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <img src={gutBanner} alt="" className="w-full h-auto object-cover" />
        )}
      </section>

      {/* Testimonial Section */}
      {/* <section className="relative bg-[#034327] py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-[#034327]">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V60c0,0,200,40,600,40s600-40,600-40V0H0z"
              fill="rgba(255,255,255,0.1)"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 right-0 w-full h-32 bg-[#034327]">
          <svg
            className="absolute bottom-0 right-0 w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200,120V60c0,0-200-40-600-40S0,60,0,60v60H1200z"
              fill="rgba(255,255,255,0.1)"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="mb-12">
            <span className="inline-block bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-8 py-3 rounded-full text-white text-base font-medium tracking-wider uppercase">
              At Third Biome
            </span>
          </div>

          <div className="mb-16 space-y-8">
            <div className="space-y-4 text-center">
              <div className="text-3xl font-semibold text-white leading-tight tracking-tight">
                We don't patch the problem — 
                <span className="text-emerald-300">we decode it.</span>
              </div>

              <div className="text-3xl font-semibold text-white leading-tight tracking-tight">
                We don't just track — 
                <span className="text-emerald-300">we transform.</span>
              </div>

              <div className="text-3xl not-first:font-semibold text-white leading-tight tracking-tight">
                We don't mass-produce — 
                <span className="text-emerald-300">
                  we custom-formulate for your biome, rhythm, and root cause.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center my-7">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
              <div className="mx-4 w-3 h-3 bg-emerald-400 rounded-full"></div>
              <div className="w-24 h-px bg-gradient-to-r from-emerald-400 via-emerald-400 to-transparent"></div>
            </div>

            <div className="text-2xl md:text-4xl font-bold text-emerald-100 leading-relaxed mx-auto whitespace-nowrap">
              Welcome to India's first precision postbiotic ecosystem
              <br />
              <span className="text-white font-light">
                where science meets self
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative bg-white text-[#034327] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Discover Your Biome</span>
              <div className="absolute inset-0 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button className="group relative bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#034327] transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">Learn More</span>
            </button>
          </div>
        </div>
      </section> */}

      {/* Blog Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block bg-[#034327]/10 text-[#034327] px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase">
                Our Blog
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#034327] mb-4">
              Learn what's good
              <br />
              for you.
            </h2>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="h-64 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://ik.imagekit.io/starfiitstorage/pexels-nadezhda-moryak-9162030.jpg?updatedAt=1752573155097"
                  alt="Gut-Brain Axis"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block bg-[#034327]/10 text-[#034327] px-3 py-1 rounded-full text-xs font-medium">
                    Microbiome
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#034327] mb-3 leading-tight">
                  How Your Gut Talks to Your Brain: The Gut-Brain Axis & Mood
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Discover how your gut and brain communicate, how the gut-brain
                  axis impacts your mood, and why postbiotics like Thirdbiome GTB™
                  are a game-changer for emotional wellness.
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    to="/blogs/gut-brain-axis"
                    className="text-[#034327] font-semibold text-sm hover:underline transition-all duration-300"
                  >
                    Read More →
                  </Link>
                  <span className="text-gray-400 text-xs">9 min read</span>
                </div>
              </div>
            </div>

            {/* Blog Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="h-64 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://ik.imagekit.io/starfiitstorage/pexels-shkrabaanthony-6823339%20(1).jpg?updatedAt=1752573306938"
                  alt="SCFAs Health"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block bg-[#034327]/10 text-[#034327] px-3 py-1 rounded-full text-xs font-medium">
                    Microbiome
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#034327] mb-3 leading-tight">
                  What Are SCFAs — And Why They're the Missing Link in Your
                  Health?
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Discover the crucial role of short-chain fatty acids (SCFAs)
                  in gut, brain, and metabolic health—and how postbiotics like
                  Thirdbiome GTB™ can restore your microbiome's voice.
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    to="/blogs/scfa-health"
                    className="text-[#034327] font-semibold text-sm hover:underline transition-all duration-300"
                  >
                    Read More →
                  </Link>
                  <span className="text-gray-400 text-xs">8 min read</span>
                </div>
              </div>
            </div>

            {/* Blog Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="h-64 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://ik.imagekit.io/starfiitstorage/pexels-edward-jenner-4031442.jpg"
                  alt="Thirdbiome GTB Super Molecule"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block bg-[#034327]/10 text-[#034327] px-3 py-1 rounded-full text-xs font-medium">
                    Microbiome
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#034327] mb-3 leading-tight">
                  Why Thirdbiome GTB Is the Super Molecule Your Gut Is Praying For
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Discover why Thirdbiome GTB is the cornerstone of true digestive
                  healing—the 'super molecule' your gut and entire body silently
                  needs for optimal health.
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    to="/blogs/Thirdbiome GTB-super-molecule"
                    className="text-[#034327] font-semibold text-sm hover:underline transition-all duration-300"
                  >
                    Read More →
                  </Link>
                  <span className="text-gray-400 text-xs">7 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* View All Blogs Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => setIsNewsletterModalOpen(true)}
              className="inline-flex items-center bg-[#034327] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#034327]/90 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              GET PERSONALISED GUT HEALTH PROTOCOLS TO YOUR INBOX
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Science Section */}
      {/* <section className="relative bg-gray-300 py-44 overflow-hidden">
        <img
          src={scienceWave}
          alt="science wave"
          className="w-full h-[50vw] object-cover absolute inset-0 z-0"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white ">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight ">
                Science proves our
                <br />
                <span className="block">formulas work.</span>
              </h2>
              <p className="text-sm text-emerald-800 leading-relaxed max-w-md">
                we are the first nutraceutical company formulation and
                manufacturing in house with dedicated DSIR lab
              </p>
            </div>

            <div className=" flex justify-center items-center">
              <div className="w-[450px] h-[600px] bg-[#C7F4EA] rounded-[3rem] border-4 border-blue-400"></div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFormData({ name: "", phone: "" });
                setErrors({});
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-[#034327] mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your details and we'll get back to you soon.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number (10 digits)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#034327] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#045a3a] transition-colors duration-300 mt-6"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscription Modal */}
      {isNewsletterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsNewsletterModalOpen(false);
                setNewsletterEmail("");
                setNewsletterError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-[#034327] mb-2">
                Get Personalised Gut Health Protocols
              </h2>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter and receive personalized gut health
                protocols directly to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    value={newsletterEmail}
                    onChange={handleNewsletterEmailChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${newsletterError ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your email address"
                    disabled={isSubmittingNewsletter}
                  />
                  {newsletterError && (
                    <p className="mt-1 text-sm text-red-500">
                      {newsletterError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingNewsletter}
                  className="w-full bg-[#034327] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#045a3a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingNewsletter ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* T3B Club Application Modal */}
      {isT3BModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsT3BModalOpen(false);
                setT3bFormData({
                  name: "",
                  age: "",
                  sex: "",
                  occupation: "",
                  whatsappNumber: "",
                  email: "",
                });
                setT3bErrors({});
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-[#034327] mb-2">
                Apply to Join T3B Club
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your details and we'll get back to you soon.
              </p>

              <form onSubmit={handleT3BSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="t3b-name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="t3b-name"
                    name="name"
                    value={t3bFormData.name}
                    onChange={handleT3BInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${t3bErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your name"
                  />
                  {t3bErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {t3bErrors.name}
                    </p>
                  )}
                </div>

                {/* Age Field */}
                <div>
                  <label
                    htmlFor="t3b-age"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="t3b-age"
                    name="age"
                    value={t3bFormData.age}
                    onChange={handleT3BInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${t3bErrors.age ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                  {t3bErrors.age && (
                    <p className="mt-1 text-sm text-red-500">{t3bErrors.age}</p>
                  )}
                </div>

                {/* Sex Field */}
                <div>
                  <label
                    htmlFor="t3b-sex"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sex
                  </label>
                  <select
                    id="t3b-sex"
                    name="sex"
                    value={t3bFormData.sex}
                    onChange={handleT3BInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${t3bErrors.sex ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {t3bErrors.sex && (
                    <p className="mt-1 text-sm text-red-500">{t3bErrors.sex}</p>
                  )}
                </div>

                {/* Occupation Field */}
                <div>
                  <label
                    htmlFor="t3b-occupation"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="t3b-occupation"
                    name="occupation"
                    value={t3bFormData.occupation}
                    onChange={handleT3BInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${t3bErrors.occupation
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                    placeholder="Enter your occupation"
                  />
                  {t3bErrors.occupation && (
                    <p className="mt-1 text-sm text-red-500">
                      {t3bErrors.occupation}
                    </p>
                  )}
                </div>

                {/* WhatsApp Field */}
                <div>
                  <label
                    htmlFor="t3b-whatsappNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    WhatsApp Number (10 digits)
                  </label>
                  <input
                    type="tel"
                    id="t3b-whatsappNumber"
                    name="whatsappNumber"
                    value={t3bFormData.whatsappNumber}
                    onChange={handleT3BWhatsAppChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${t3bErrors.whatsappNumber
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                    placeholder="Enter 10-digit WhatsApp number"
                    maxLength={10}
                  />
                  {t3bErrors.whatsappNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {t3bErrors.whatsappNumber}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="t3b-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="t3b-email"
                    name="email"
                    value={t3bFormData.email}
                    onChange={handleT3BInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${t3bErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your email"
                  />
                  {t3bErrors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {t3bErrors.email}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingT3B}
                  className="w-full bg-[#034327] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#045a3a] transition-colors duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingT3B ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

     

      <Footer />
    </div>
  );
};

export default Home;
