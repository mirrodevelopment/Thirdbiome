import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/T3BLogo.svg";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import getApiClient from "../axios/axios";
import { showToast } from "../utils/toast";

const Footer = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    // Submit to API
    try {
      setIsSubmitting(true);
      const apiClient = await getApiClient();

      const payload = {
        email: email.trim(),
      };

      const response = await apiClient.post("/newsletter/subscribe", payload);

      if (response.data && response.data.message) {
        showToast.success(
          response.data.message || "Successfully subscribed to newsletter!"
        );
      } else {
        showToast.success("Successfully subscribed to newsletter!");
      }

      // Reset form
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to subscribe. Please try again.";
      showToast.error(errorMessage);

      // Set error message if provided
      if (error.response?.data?.message) {
        setEmailError(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="text-white relative bg-[#034327]">
      {/* Desktop Background */}
      <div className="absolute inset-0 hidden md:block"></div>

      {/* Mobile Background */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: `url('/src/assets/mobile_footer.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="relative z-10">
        {/* Money Back Guarantee Section */}
        <div className="relative text-center overflow-hidden py-8 sm:py-12 md:py-16 min-h-[280px] sm:min-h-[320px] md:min-h-[400px]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 pt-6 sm:pt-12 md:pt-20">
            {/* Money back guarantee icon */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-white/80 mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4">
              Terms and conditions apply
            </p>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4 leading-tight max-w-xl mx-auto">
              Feel great or your money back.
            </h2>

            <button
              className="bg-white text-[#034327] mt-3 sm:mt-4 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm md:text-base shadow-md hover:shadow-lg"
              onClick={() => Navigate("/products")}
            >
              Shop All
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 ">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              {/* Logo Section */}
              <div className="text-center sm:text-left">
                <div className="mb-6 sm:mb-8">
                  <Link to="/" className="inline-block mb-3 sm:mb-4">
                    <img
                      src={logo}
                      alt="ThirdBio Logo"
                      className="h-8 sm:h-10 md:h-12 w-auto mx-auto sm:mx-0"
                    />
                  </Link>

                  <p className="text-xs sm:text-xs font-semibold mb-1 text-green-300 uppercase tracking-wide">
                    INDIA'S FIRST PATENTED POSTBIOTIC
                  </p>

                  <p className="text-sm md:text-base mb-4 sm:mb-6 text-white italic">
                    To your health
                  </p>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 text-center sm:text-left">
                    Sign up for our newsletter
                  </h3>

                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col"
                  >
                    <div className="flex border border-green-400 rounded-lg overflow-hidden">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-transparent border-none text-white placeholder-green-300 focus:outline-none text-xs sm:text-sm md:text-base min-w-0 ${emailError ? "border-red-500" : ""
                          }`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white hover:bg-gray-100 active:bg-gray-200 border-l border-green-400 font-bold transition-all text-[#034327] text-xs sm:text-sm md:text-base whitespace-nowrap min-w-[80px] sm:min-w-[100px] md:min-w-[120px] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "..." : "Subscribe"}
                      </button>
                    </div>
                    {emailError && (
                      <p className="mt-1 text-xs sm:text-sm text-red-300">
                        {emailError}
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* Shop by Concern Column */}
              {/* <div className="text-center sm:text-left">
                <h4 className="text-xs sm:text-xs md:text-sm font-semibold mb-3 sm:mb-4 md:mb-6 text-green-300 uppercase tracking-wider">
                  SHOP BY CONCERN
                </h4>
                <ul className="space-y-2 sm:space-y-2 md:space-y-3">
                  <li>
                    <Link
                      to="/products/third-biome-gut"
                      className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                    >
                      Third Biome™ Gut
                    </Link>
                  </li>
                </ul>
              </div> */}

              {/* T3B Club Column */}
              <div className="text-center sm:text-left">
                <h4 className="text-xs sm:text-xs md:text-sm font-semibold mb-3 sm:mb-4 md:mb-6 text-green-300 uppercase tracking-wider">
                  T3B CLUB
                </h4>
                <ul className="space-y-2 sm:space-y-2 md:space-y-3">
                  <li>
                    <Link
                      to="/t3b-club"
                      className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                    >
                      T3B Club
                    </Link>
                  </li>
                </ul>
              </div>

              {/* GUT Scoring Column */}
              <div className="text-center sm:text-left">
                <h4 className="text-xs sm:text-xs md:text-sm font-semibold mb-3 sm:mb-4 md:mb-6 text-green-300 uppercase tracking-wider">
                  GUT SCORING
                </h4>
                <ul className="space-y-2 sm:space-y-2 md:space-y-3">
                  <li>
                    <Link
                      to="/gut-scoring/interactive-quiz"
                      className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                    >
                      Interactive GUT Scoring Quiz
                    </Link>
                  </li>
                </ul>

                <div className="mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-2 md:space-y-3">
                  <Link
                    to="/contact"
                    className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/blogs"
                    className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/testimonials"
                    className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                  >
                  Biome Stories
                  </Link>
                  <Link
                    to="/faq"
                    className="text-sm sm:text-base md:text-lg hover:text-green-200 transition-colors block"
                  >
                  FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 py-4 sm:py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6">
              {/* Copyright and Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 md:gap-6 text-xs sm:text-xs md:text-sm">
                <span>© 2025 TheThirdBiome</span>
                <Link
                  to="/privacy-policy"
                  className="hover:text-green-200 transition-colors whitespace-nowrap"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="hover:text-green-200 transition-colors whitespace-nowrap"
                >
                  Terms and Conditions
                </Link>
                <a
                  href="https://www.starfii.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-200 transition-colors whitespace-nowrap"
                >
                  Powered by Starfii
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 sm:gap-5 md:gap-6">
                <a
                  href="https://www.instagram.com/thethirdbiome/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-200 transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61588062399633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-200 transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </a>
                {/* <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-200 transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
