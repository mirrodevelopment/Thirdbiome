import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/T3BLogo.svg";
import {
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
  FiShoppingBag,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { getCart } from "../services/cartService";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'concern', 'postbiotic', 't3b', 'gut', or null
  const [cartCount, setCartCount] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null); // 'concern', 'postbiotic', 't3b', 'gut', or null
  const dropdownContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Only close if click is outside the dropdown container
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        // Ensure session ID exists for guest users
        if (!localStorage.getItem("sessionId")) {
          const { generateSessionId } = await import("../services/cartService");
          await generateSessionId();
        }

        const response = await getCart();
        setCartCount(response.data.totalItems || 0);
      } catch (error) {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const badgeClass =
    "absolute -top-1 -right-1 bg-white text-[#034327] text-xs rounded-full h-4 w-4 flex items-center justify-center border-2 border-white font-semibold";

  const isAuthenticated =
    useSelector((state) => state.auth.isAuthenticated) ||
    !!localStorage.getItem("token");

  return (
    <>
      <nav className="bg-[#034327] top-0 z-50 h-30 flex items-center 2xl:z-50 w-full">
        <div className="mx-4 md:mx-8 2xl:mx-12 w-full">
          {/* Mobile Navbar */}
          <div className="max-[1035px]:flex hidden justify-between items-center h-24 w-full">
            <div className="flex items-center gap-x-2">
              <button
                className="p-2 text-white hover:text-emerald-300 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <Link to="/">
                <img src={logo} alt="ThirdBio Logo" className="h-12 w-auto" />
              </Link>
            </div>
            <div className="flex items-center gap-x-2">
              <Link
                to={isAuthenticated ? "/profile" : "/user/login"}
                className="p-2"
                aria-label="User"
              >
                <FiUser className="h-4 w-4 text-white" />
              </Link>
              <button
                onClick={openCartDrawer}
                className="relative p-2"
                aria-label="Cart"
              >
                <FiShoppingBag className="h-4 w-4 text-white" />
                <span className={badgeClass}>{cartCount}</span>
              </button>
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden min-[1036px]:flex justify-between items-center h-24 w-full">
            {/* Logo */}
            <div className="flex items-center gap-x-10">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <img src={logo} alt="ThirdBio Logo" className="h-12 w-auto" />
                </Link>
              </div>
              {/* Nav Links */}
              <div
                className="flex items-center gap-x-8 ml-auto mt-1"
                ref={dropdownContainerRef}
              >
                {/* Shop by Concern Dropdown */}
                {/* <div className="relative flex items-center">
                  <button
                    onClick={() => handleDropdown("concern")}
                    className="text-white hover:text-emerald-300 flex items-center gap-1 font-normal relative group"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === "concern"}
                  >
                    <span className="relative flex flex-col items-start">
                      <span className="relative z-10">Shop by Concern</span>
                      <span className="transition-all duration-300 absolute left-0 bottom-0.5 w-0 h-[1px] bg-emerald-300 group-hover:w-full"></span>
                    </span>
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === "concern" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "concern" && (
                    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-4 transition-all duration-200">
                      <div className="flex flex-col gap-2">
          
                        <Link
                          to="/products/third-biome-gut"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                  
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                     
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M7 7c0-2.5 2-4 5-4s5 1.5 5 4c0 2-1.5 3-3 3s-3-1-3-3"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <ellipse
                                cx="12"
                                cy="16"
                                rx="5"
                                ry="6"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              Third Biome™ Gut
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Gut Health Formula
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                {/* Shop Link */}
             

                {/* Postbiotic Science Dropdown */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => handleDropdown("postbiotic")}
                    className="text-white hover:text-emerald-300 flex items-center gap-1 font-normal relative group"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === "postbiotic"}
                  >
                    <span className="relative flex flex-col items-start">
                      <span className="relative z-10">Postbiotic Science</span>
                      <span className="transition-all duration-300 absolute left-0 bottom-0.5 w-0 h-[1px] bg-emerald-300 group-hover:w-full"></span>
                    </span>
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "postbiotic" ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openDropdown === "postbiotic" && (
                    <div className="absolute left-0 top-full mt-2 w-[450px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-4 transition-all duration-200">
                      <div className="flex flex-col gap-2">
                        {/* What is Postbiotic */}
                        <Link
                          to="/blogs/postbiotics-vs-probiotics"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Science icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M12 7v5l3 3"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              What is Postbiotic
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Learn about postbiotics
                            </div>
                          </div>
                        </Link>
                        {/* The Gut Brain Axis */}
                        <Link
                          to="/blogs/gut-brain-axis"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Brain icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <ellipse
                                cx="12"
                                cy="12"
                                rx="7"
                                ry="9"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M12 3v18"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              The Gut Brain Axis
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Gut & brain connection
                            </div>
                          </div>
                        </Link>
                        {/* Science of Your Microbiome */}
                        <Link
                          to="/blogs/scfa-health"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Microbiome icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="8"
                                cy="8"
                                r="2"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx="16"
                                cy="16"
                                r="2"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx="16"
                                cy="8"
                                r="1.5"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx="8"
                                cy="16"
                                r="1.5"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M10 10l4 4"
                                stroke="#134E4A"
                                strokeWidth="1.2"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              Science of Your Microbiome
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Explore your inner ecosystem
                            </div>
                          </div>
                        </Link>
                        {/* Our Patented Technology */}
                        <Link
                          to="/blogs/microencapsulated-tryThirdbiome GTB"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Patent icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <rect
                                x="6"
                                y="6"
                                width="12"
                                height="12"
                                rx="2"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M9 9h6v6H9z"
                                stroke="#134E4A"
                                strokeWidth="1.2"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              Our Patented Technology
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Innovation & research
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* T3B Club Dropdown */}
                <div className="relative flex items-center">
                  <Link
                    to="/t3b-club"
                    className="text-white hover:text-emerald-300 flex items-center gap-1 font-normal relative group"
                  >
                    <span className="relative flex flex-col items-start">
                      <span className="relative z-10">T3B Club</span>
                      <span className="transition-all duration-300 absolute left-0 bottom-0.5 w-0 h-[1px] bg-emerald-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                  {openDropdown === "t3b" && (
                    <div className="absolute left-0 top-full mt-2 w-[340px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-4 transition-all duration-200">
                      <div className="flex flex-col gap-2">
                        {/* Biome Recode */}
                        <Link
                          to="/t3b-club"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: DNA icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M7 17c2.5-2 7.5-8 10-10"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M17 7c-2.5 2-7.5 8-10 10"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <circle cx="7" cy="17" r="1" fill="#134E4A" />
                              <circle cx="17" cy="7" r="1" fill="#134E4A" />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              Biome Recode
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Transform your gut ecosystem
                            </div>
                          </div>
                        </Link>
                        {/* The Inner Shift */}
                        <Link
                          to="/t3b-club"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Mind icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <ellipse
                                cx="12"
                                cy="12"
                                rx="8"
                                ry="9"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M12 7v5l3 3"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              The Inner Shift
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Mind-gut transformation
                            </div>
                          </div>
                        </Link>
                        {/* Reset Her Rhythm */}
                        <Link
                          to="/t3b-club"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Heartbeat icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M4 13l3 3 4-8 4 8 3-3"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              Reset Her Rhythm
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Women's wellness journey
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* GUT Scoring Dropdown */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => handleDropdown("gut")}
                    className="text-white hover:text-emerald-300 flex items-center gap-1 font-normal relative group"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === "gut"}
                  >
                    <span className="relative flex flex-col items-start">
                      <span className="relative z-10">GUT Scoring</span>
                      <span className="transition-all duration-300 absolute left-0 bottom-0.5 w-0 h-[1px] bg-emerald-300 group-hover:w-full"></span>
                    </span>
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${openDropdown === "gut" ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openDropdown === "gut" && (
                    <div className="absolute left-0 top-full mt-2 w-[350px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-4 transition-all duration-200">
                      <div className="flex flex-col gap-2">
                        {/* GUT Scoring Quiz */}
                        <Link
                          to="/gut-scoring/interactive-quiz"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          {/* Icon */}
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            {/* Example: Quiz icon */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="4"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M8 10h8M8 14h4"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              Interactive GUT Scoring Quiz
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Discover your gut health score
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* Biome Stories Dropdown */}
                <div className="relative flex items-center">
                  <Link
                    to="/testimonials"
                    className="text-white hover:text-emerald-300 flex items-center gap-1 font-normal relative group"
                  >
                    <span className="relative flex flex-col items-start">
                      <span className="relative z-10">Biome Stories</span>
                      <span className="transition-all duration-300 absolute left-0 bottom-0.5 w-0 h-[1px] bg-emerald-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDropdown("stories")}
                    className="text-white hover:text-emerald-300 p-1 focus:outline-none"
                    aria-label="Toggle FAQ menu"
                  >
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === "stories" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "stories" && (
                    <div className="absolute left-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-4 transition-all duration-200">
                      <div className="flex flex-col gap-2">
                        {/* FAQ Link */}
                        <Link
                          to="/faq"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5fffb] transition-colors duration-200 group"
                        >
                          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f7f3] border border-[#b2e2d6]">
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M8 10h8M8 14h4"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="4"
                                stroke="#134E4A"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="font-semibold text-[#134E4A] group-hover:text-[#0d3a36]">
                              FAQ
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Answers to your questions
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* Shop Link */}
                <div className="relative flex items-center">
                  <Link
                    to="/products"
                    className="text-white hover:text-emerald-300 flex items-center gap-1 font-normal relative group"
                  >
                    <span className="relative flex flex-col items-start">
                      <span className="relative z-10">Shop</span>
                      <span className="transition-all duration-300 absolute left-0 bottom-0.5 w-0 h-[1px] bg-emerald-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {/* Icons */}
            <div className="flex items-center gap-x-4">
              <Link
                to={isAuthenticated ? "/profile" : "/user/login"}
                className="p-2"
                aria-label="User"
              >
                <FiUser className="h-5 w-5 text-white" strokeWidth={1.7} />
              </Link>
              <button
                onClick={openCartDrawer}
                className="relative p-2"
                aria-label="Cart"
              >
                <FiShoppingBag
                  className="h-5 w-5 text-white"
                  strokeWidth={1.5}
                />
                <span className={badgeClass}>{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-[#034327] shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto
            ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
          style={{ willChange: "transform" }}
        >
          <div className="flex justify-between items-center h-24 px-4 pt-3 pb-2 border-b border-emerald-600/30">
            <div className="flex items-center gap-x-2">
              <button
                className="p-2 text-white hover:text-emerald-300 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <FiX className="h-5 w-5" />
              </button>
              <Link to="/" onClick={toggleMenu} className="flex items-center">
                <img src={logo} alt="ThirdBio Logo" className="h-12 w-auto" />
              </Link>
            </div>
            <div className="flex items-center gap-x-2">
              <Link
                to={isAuthenticated ? "/profile" : "/user/login"}
                className="p-2"
                aria-label="User"
                onClick={toggleMenu}
              >
                <FiUser className="h-4 w-4 text-white" />
              </Link>
              <button
                onClick={() => {
                  openCartDrawer();
                  toggleMenu();
                }}
                className="relative p-2"
                aria-label="Cart"
              >
                <FiShoppingBag className="h-4 w-4 text-white" />
                <span className={badgeClass}>{cartCount}</span>
              </button>
            </div>
          </div>
          <div className="px-4 pt-4 pb-8 space-y-2">
            <Link
              to="/"
              className="block text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>

            {/* Shop by Concern - Collapsible */}
            {/* <button
              className="w-full flex items-center justify-between text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium focus:outline-none"
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "concern" ? null : "concern"
                )
              }
              aria-expanded={mobileDropdown === "concern"}
            >
              Shop by Concern
              <FiChevronDown
                className={`ml-2 transition-transform ${
                  mobileDropdown === "concern" ? "rotate-180" : ""
                }`}
              />
            </button> */}
            {mobileDropdown === "concern" && (
              <div className="pl-6 pb-2">
                <Link

                  to="/products"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M7 7c0-2.5 2-4 5-4s5 1.5 5 4c0 2-1.5 3-3 3s-3-1-3-3"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <ellipse
                        cx="12"
                        cy="16"
                        rx="5"
                        ry="6"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      Third Biome™ Gut
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Gut Health Formula
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {/* Postbiotic Science - Collapsible */}
            <button
              className="w-full flex items-center justify-between text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium focus:outline-none"
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "postbiotic" ? null : "postbiotic"
                )
              }
              aria-expanded={mobileDropdown === "postbiotic"}
            >
              Postbiotic Science
              <FiChevronDown
                className={`ml-2 transition-transform ${mobileDropdown === "postbiotic" ? "rotate-180" : ""
                  }`}
              />
            </button>
            {mobileDropdown === "postbiotic" && (
              <div className="pl-6 pb-2 flex flex-col gap-2">
                <Link
                  to="/blogs/postbiotics-vs-probiotics"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 7v5l3 3"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      What is Postbiotic
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Learn about postbiotics
                    </div>
                  </div>
                </Link>
                <Link
                  to="/blogs/gut-brain-axis"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <ellipse
                        cx="12"
                        cy="12"
                        rx="7"
                        ry="9"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 3v18"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      The Gut Brain Axis
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Gut & brain connection
                    </div>
                  </div>
                </Link>
                <Link
                  to="/blogs/scfa-health"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle
                        cx="8"
                        cy="8"
                        r="2"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="2"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="16"
                        cy="8"
                        r="1.5"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="8"
                        cy="16"
                        r="1.5"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <path d="M10 10l4 4" stroke="#ffffff" strokeWidth="1.2" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      Science of Your Microbiome
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Explore your inner ecosystem
                    </div>
                  </div>
                </Link>
                <Link
                  to="/blogs/microencapsulated-tryThirdbiome GTB"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"
                        rx="2"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M9 9h6v6H9z"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      Our Patented Technology
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Innovation & research
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {/* T3B Club */}
            <Link
              to="/t3b-club"
              className="block text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              T3B Club
            </Link>
            {mobileDropdown === "t3b" && (
              <div className="pl-6 pb-2 flex flex-col gap-2">
                <Link
                  to="/t3b-club"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M7 17c2.5-2 7.5-8 10-10"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M17 7c-2.5 2-7.5 8-10 10"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="7" cy="17" r="1" fill="#ffffff" />
                      <circle cx="17" cy="7" r="1" fill="#ffffff" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      Biome Recode
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Transform your gut ecosystem
                    </div>
                  </div>
                </Link>
                <Link
                  to="/t3b-club"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <ellipse
                        cx="12"
                        cy="12"
                        rx="8"
                        ry="9"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 7v5l3 3"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      The Inner Shift
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Mind-gut transformation
                    </div>
                  </div>
                </Link>
                <Link
                  to="/t3b-club"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M4 13l3 3 4-8 4 8 3-3"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      Reset Her Rhythm
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Women's wellness journey
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* GUT Scoring - Collapsible */}
            <button
              className="w-full flex items-center justify-between text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium focus:outline-none"
              onClick={() =>
                setMobileDropdown(mobileDropdown === "gut" ? null : "gut")
              }
              aria-expanded={mobileDropdown === "gut"}
            >
              GUT Scoring
              <FiChevronDown
                className={`ml-2 transition-transform ${mobileDropdown === "gut" ? "rotate-180" : ""
                  }`}
              />
            </button>
            {mobileDropdown === "gut" && (
              <div className="pl-6 pb-2 flex flex-col gap-2">
                <Link
                  to="/gut-scoring/interactive-quiz"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="4"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 10h8M8 14h4"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      Interactive GUT Scoring Quiz
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Discover your gut health score
                    </div>
                  </div>
                </Link>
              </div>
            )}


            {/* Biome Stories - Link + Toggle */}
            <div className="flex items-center justify-between pr-2">
              <Link
                to="/testimonials"
                className="flex-grow text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Biome Stories
              </Link>
              <button
                className="p-2 text-white hover:text-emerald-300 focus:outline-none"
                onClick={() =>
                  setMobileDropdown(
                    mobileDropdown === "stories" ? null : "stories"
                  )
                }
              >
                <FiChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileDropdown === "stories" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {mobileDropdown === "stories" && (
              <div className="pl-6 pb-2 flex flex-col gap-2">
                <Link
                  to="/faq"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-emerald-700/30 transition-colors duration-200 group"
                  onClick={toggleMenu}
                >
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-300/30">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="4"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">
                      FAQ
                    </div>
                    <div className="text-xs text-emerald-200/80 mt-0.5">
                      Answers to your questions
                    </div>
                  </div>
                </Link>
              </div>
            )}
            <Link
              to="/products"
              className="block text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="block text-white hover:text-emerald-300 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>

          </div>
        </div>
      </nav>
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </>
  );
};

export default Navbar;
