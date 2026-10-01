import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import waveSvg from "../../assets/wave.svg";
import thirdLogo from "../../assets/T3BLogo.svg";
import getApiClient from "../../axios/axios";
import { showToast } from "../../utils/toast";
import clubService from "../../services/clubService";

const TBClub = () => {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    occupation: "",
    whatsappNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const systemicBenefits = {
    cognitive: {
      title: "Cognitive Clarity Meets Emotional Calm",
      systemicLink:
        "Gut-brain axis shapes serotonin, GABA, and neuroinflammation.",
      feel: "Sharper focus, reduced anxiety, smoother mood transitions.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
    },
    metabolism: {
      title: "Metabolism That Works With You",
      systemicLink:
        "SCFAs regulate insulin, support mitochondria, reduce visceral fat.",
      feel: "Better digestion, weight rhythm, muscle tone.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "from-green-500 to-emerald-600",
    },
    hormonal: {
      title: "Hormonal Harmony",
      systemicLink:
        "Estrobolome manages estrogen detox. Inflammation affects ovulation and thyroid.",
      feel: "PMS relief, fertility rhythm, emotional steadiness.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "from-pink-500 to-rose-600",
    },
    skin: {
      title: "Skin That Glows",
      systemicLink:
        "Gut permeability and immune balance impact skin signaling.",
      feel: "Fewer flares, faster healing, more glow.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      color: "from-amber-500 to-orange-600",
    },
    energy: {
      title: "Sustained Energy",
      systemicLink: "Microbiome balances cortisol and circadian rhythm.",
      feel: "Wake up energized, no afternoon crashes.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "from-yellow-500 to-amber-600",
    },
    inflammation: {
      title: "Lower Inflammation",
      systemicLink:
        "Immune-microbial recalibration reduces chronic inflammation.",
      feel: "Fewer flare-ups, improved recovery, less pain.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
      color: "from-red-500 to-pink-600",
    },
    nervous: {
      title: "Nervous System Safety",
      systemicLink: "Vagus nerve and microbiota create regulation loop.",
      feel: "Less anxiety, more calm, deep rest.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      color: "from-purple-500 to-violet-600",
    },
    wholebody: {
      title: "Whole-Body Sync",
      systemicLink: "All organs communicate via microbial metabolites.",
      feel: "You stop fighting your body. You feel right.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      color: "from-teal-500 to-cyan-600",
    },
  };

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

  const validateWhatsApp = (whatsappNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(whatsappNumber.replace(/\D/g, ""));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleWhatsAppChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: value,
      }));
      if (errors.whatsappNumber) {
        setErrors((prev) => ({
          ...prev,
          whatsappNumber: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (
      isNaN(formData.age) ||
      parseInt(formData.age) < 1 ||
      parseInt(formData.age) > 120
    ) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.sex.trim()) {
      newErrors.sex = "Sex is required";
    } else if (!["Male", "Female", "Other"].includes(formData.sex)) {
      newErrors.sex = "Please select a valid option";
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!validateWhatsApp(formData.whatsappNumber)) {
      newErrors.whatsappNumber =
        "Please enter a valid 10-digit WhatsApp number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to API
    try {
      setIsSubmitting(true);

      const response = await clubService.submitApplication(formData);

      if (response && response.message) {
        showToast.success(
          response.message || "Application submitted successfully!"
        );
      } else {
        showToast.success("Application submitted successfully!");
      }

      // Reset form and close modal
      setFormData({
        name: "",
        age: "",
        sex: "",
        occupation: "",
        whatsappNumber: "",
        email: "",
      });
      setErrors({});
      setIsModalOpen(false);
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
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#034327] min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Custom Wave Background */}
        <div className="absolute inset-0 flex items-center">
          <img
            src={waveSvg}
            alt="wave background"
            className="w-full h-[25vw] object-cover opacity-70"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center text-white px-6 max-w-7xl mx-auto">
          {/* T3B Logo */}
          <div className="mb-8 md:mb-12">
            <img
              src={thirdLogo}
              alt="Third Biome Club Logo"
              className="mx-auto w-auto h-16 md:h-24 lg:h-28"
            />
          </div>

          {/* Hero Badge */}
          <div className="inline-block mb-6 md:mb-8">
            <span className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 px-4 md:px-6 py-2 rounded-full text-emerald-100 text-xs md:text-sm font-medium tracking-wide">
              WHERE YOUR GUT MEETS SCIENCE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent px-4">
            Welcome to the T3B Club
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl lg:text-3xl text-emerald-100/90 font-light mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto px-4">
            India's first postbiotic-led ecosystem
          </p>

          {/* CTA Section */}
          <div className="space-y-4 md:space-y-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative bg-white text-[#034327] px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:bg-emerald-50 cursor-pointer"
            >
              <span className="relative z-10">Apply to Join</span>
              <div className="absolute inset-0 bg-emerald-100/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <p className="text-emerald-200/80 text-xs md:text-sm font-light">
              Join the revolution in preventive care
            </p>
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#034327] mb-4 md:mb-6 leading-tight">
              This is for those who are done
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              chasing symptoms.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 md:mb-16">
            {/* Left Side - Problem Description */}
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
              <div className="space-y-5 md:space-y-6 text-base md:text-lg text-gray-700 leading-relaxed">
                <p>
                  You've tried the pills, the trackers, the temporary fixes.
                </p>
                <p>
                  But what if your real solution was never in isolation —
                  because your body doesn't work in silos?
                </p>
                <div className="bg-[#034327]/5 p-5 md:p-6 rounded-2xl border-l-4 border-[#034327]">
                  <p className="font-medium text-[#034327] text-base md:text-lg">
                    Your gut talks to your brain. Your hormones talk to your
                    liver.
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    Every signal is a conversation — and you've never been
                    taught to listen.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Element */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-[#034327] rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-2xl z-10">
                  YOU
                </div>

                {/* Connected Systems - Symmetrically positioned */}
                {/* Brain - Top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-emerald-200 rounded-full flex items-center justify-center text-[#034327] font-medium text-xs md:text-sm shadow-lg">
                  Brain
                </div>
                {/* Skin - Bottom */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-emerald-200 rounded-full flex items-center justify-center text-[#034327] font-medium text-xs md:text-sm shadow-lg">
                  Skin
                </div>
                {/* Gut - Right */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-emerald-200 rounded-full flex items-center justify-center text-[#034327] font-medium text-xs md:text-sm shadow-lg">
                  Gut
                </div>
                {/* Liver - Left */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-emerald-200 rounded-full flex items-center justify-center text-[#034327] font-medium text-xs md:text-sm shadow-lg">
                  Liver
                </div>

                {/* Connection Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 256 256"
                >
                  {/* Line to Brain (Top) */}
                  <line
                    x1="128"
                    y1="128"
                    x2="128"
                    y2="32"
                    stroke="#034327"
                    strokeWidth="2"
                    opacity="0.3"
                    strokeDasharray="5,5"
                  />
                  {/* Line to Gut (Right) */}
                  <line
                    x1="128"
                    y1="128"
                    x2="224"
                    y2="128"
                    stroke="#034327"
                    strokeWidth="2"
                    opacity="0.3"
                    strokeDasharray="5,5"
                  />
                  {/* Line to Skin (Bottom) */}
                  <line
                    x1="128"
                    y1="128"
                    x2="128"
                    y2="224"
                    stroke="#034327"
                    strokeWidth="2"
                    opacity="0.3"
                    strokeDasharray="5,5"
                  />
                  {/* Line to Liver (Left) */}
                  <line
                    x1="128"
                    y1="128"
                    x2="32"
                    y2="128"
                    stroke="#034327"
                    strokeWidth="2"
                    opacity="0.3"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-gradient-to-br from-[#034327]/10 to-emerald-50 rounded-3xl p-8 md:p-12 mb-12 md:mb-16">
            <div className="text-center mb-8">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#034327] mb-6">
                90% of disease begin in your gut
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 bg-white/60 rounded-xl">
                <p className="text-2xl md:text-3xl font-bold text-[#034327] mb-2">
                  4 in 5
                </p>
                <p className="text-sm md:text-base text-gray-700">
                  metabolic disorder*
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-xl">
                <p className="text-2xl md:text-3xl font-bold text-[#034327] mb-2">
                  70%
                </p>
                <p className="text-sm md:text-base text-gray-700">
                  of immunity*
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-xl">
                <p className="text-2xl md:text-3xl font-bold text-[#034327] mb-2">
                  1 in 7
                </p>
                <p className="text-sm md:text-base text-gray-700">diabetes*</p>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-xl">
                <p className="text-2xl md:text-3xl font-bold text-[#034327] mb-2">
                  2 in 5
                </p>
                <p className="text-sm md:text-base text-gray-700">
                  hormonal imbalance*
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-[#034327] italic">
              If you're ready to rebuild that system — not patch it — you're
              already one of us.
            </p>
          </div>
        </div>
      </section>

      {/* Systemic Benefits Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#034327] mb-4 md:mb-6 leading-tight">
              What You'll Feel — And Why Your
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              Whole Body Will Know It
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by physicians, 1000+ consumers and healthcare
              professionals
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {Object.entries(systemicBenefits).map(([key, benefit]) => (
              <div
                key={key}
                className={`p-5 md:p-6 bg-white rounded-2xl shadow-md cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-2 ${selectedBenefit === key
                  ? "border-[#034327] ring-4 ring-[#034327]/20"
                  : "border-transparent hover:border-[#034327]/30"
                  }`}
                onClick={() =>
                  setSelectedBenefit(selectedBenefit === key ? null : key)
                }
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#034327]/10 flex items-center justify-center text-[#034327] mb-3 md:mb-4 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#034327] text-center leading-tight">
                  {benefit.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Benefit Detail Display */}
          {selectedBenefit && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#034327]/10 flex items-center justify-center text-[#034327] mb-4 mx-auto">
                  {systemicBenefits[selectedBenefit].icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#034327] mb-4">
                  {systemicBenefits[selectedBenefit].title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-[#034327]/5 p-5 md:p-6 rounded-2xl border-l-4 border-[#034327]">
                  <h4 className="font-bold text-[#034327] mb-3 flex items-center text-sm md:text-base">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Systemic Link
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {systemicBenefits[selectedBenefit].systemicLink}
                  </p>
                </div>

                <div className="bg-emerald-50 p-5 md:p-6 rounded-2xl border-l-4 border-emerald-500">
                  <h4 className="font-bold text-emerald-700 mb-3 flex items-center text-sm md:text-base">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    What You'll Feel
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {systemicBenefits[selectedBenefit].feel}
                  </p>
                </div>
              </div>

              <div className="text-center mt-6 md:mt-8">
                <button
                  className="bg-[#034327] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium hover:bg-[#034327]/90 transition-colors duration-300 text-sm md:text-base"
                  onClick={() => setSelectedBenefit(null)}
                >
                  Explore More Benefits
                </button>
              </div>
            </div>
          )}

          {/* CTA Button Below Benefits */}
          <div className="text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#034327] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#034327]/90 cursor-pointer"
            >
              Get personalized bloat, brain fog & burnout protocol
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 320"
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#034327"
              fillOpacity="0.03"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,170.7C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Main CTA */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#034327] mb-4 md:mb-6 leading-tight">
              Ready to Stop Fighting
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              Your Body?
            </h2>

            <p className="text-base md:text-xl text-gray-700 font-light mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto">
              Join the T3B Club and discover what it feels like when your whole
              system works in harmony. This isn't another quick fix — it's a
              complete recalibration.
            </p>

            <div className="space-y-4 md:space-y-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative bg-[#034327] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-[#034327]/25 transition-all duration-300 transform hover:scale-105 hover:bg-[#034327]/90 cursor-pointer"
              >
                <span className="relative z-10">
                  Apply to Join the T3B Club
                </span>
                <div className="absolute inset-0 bg-[#034327]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <p className="text-gray-500 text-xs md:text-sm font-light">
                Limited spots available • Precision health awaits
              </p>
            </div>
          </div>

          {/* Additional Info Section */}
          {/* <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center space-y-4 md:space-y-6">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#034327]">
                T3B club is about shared health responsibility
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                All you need is 5 minute, science backed protocol to beat
                bloating, fatigue without feeling overwhelmed, overworked, over
                compensating without cutting all your favourite foods
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#034327] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#034327]/90 cursor-pointer"
                >
                  Get personalized bloat, brain fog & burnout protocol
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFormData({
                  name: "",
                  age: "",
                  sex: "",
                  occupation: "",
                  whatsappNumber: "",
                  email: "",
                });
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
                Apply to Join T3B Club
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

                {/* Age Field */}
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.age ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                  )}
                </div>

                {/* Sex Field */}
                <div>
                  <label
                    htmlFor="sex"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sex
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.sex ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-500">{errors.sex}</p>
                  )}
                </div>

                {/* Occupation Field */}
                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.occupation ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your occupation"
                  />
                  {errors.occupation && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.occupation}
                    </p>
                  )}
                </div>

                {/* WhatsApp Field */}
                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    WhatsApp Number (10 digits)
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleWhatsAppChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.whatsappNumber
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                    placeholder="Enter 10-digit WhatsApp number"
                    maxLength={10}
                  />
                  {errors.whatsappNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.whatsappNumber}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] ${errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#034327] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#045a3a] transition-colors duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
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

export default TBClub;
