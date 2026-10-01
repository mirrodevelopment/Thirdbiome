import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import fallbackImage from "../assets/imageTest.webp";
import { getProducts } from "../services/productService";
import { formatImageUrl } from "../utils/urlUtils";

const PromoPopup = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [displayImage, setDisplayImage] = useState(fallbackImage);

  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  const isProductPage = location.pathname.startsWith("/products");

  // ✅ FIX: default delay added
  const showPopup = (delay = 3000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isProductPage) return;

    timerRef.current = setTimeout(() => {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    }, delay);
  };

  useEffect(() => {
    // Reset state on route change
    setIsVisible(false);
    setShouldRender(false);

    if (!isProductPage) {
      showPopup(3000); // ✅ first popup 3 sec
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  // ✅ FIXED HANDLE CLOSE
  const handleClose = () => {
    setIsVisible(false);

    // clear any running timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setTimeout(() => {
      setShouldRender(false);

      // ✅ wait 60 seconds before showing again
      if (!isProductPage) {
        timerRef.current = setTimeout(() => {
          showPopup(0); // show immediately after 60 sec wait
        }, 60000);
      }

    }, 300);
  };

  const handleShopNow = () => {
    handleClose();
    navigate("/products");
  };

  if (!shouldRender || isProductPage) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* POPUP CARD */}
      <div className={`relative bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row transform transition-all duration-700 ease-out ${isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-12 opacity-0"}`}>

        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 p-2.5 bg-black/5 hover:bg-black/10 rounded-full text-gray-800 transition-all duration-300 hover:rotate-90"
        >
          <IoClose size={22} />
        </button>

        {/* LEFT IMAGE */}
        <div className="w-full md:w-1/2 h-72 md:h-auto bg-[#0a0f0d] relative overflow-hidden flex items-center justify-center group">

          <div className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-[120px]"></div>

          <img
            src="/images/popup-image.jpeg"
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* BADGE */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-xl flex items-center justify-center space-x-3">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-white font-bold text-xs tracking-widest uppercase">
                Clinically Proven Results
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">

          <div className="mb-6">
            <span className="text-emerald-600 font-bold tracking-[0.3em] text-xs uppercase border-l-4 border-emerald-500 pl-4">
              India's first patented postbiotic
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[#034327] mb-5 leading-tight tracking-tight">
            Third Biome™ <span className="text-emerald-600">Gut</span>
          </h2>

          <p className="text-gray-500 mb-10 text-base leading-relaxed">
            Advanced postbiotic gut health formula that repairs
            your intestinal barrier and strengthens your gut-brain link.
          </p>

          {/* BUTTON */}
          <button
            onClick={handleShopNow}
            className="flex items-center justify-center gap-3 bg-[#034327] text-white py-4 px-10 rounded-xl font-bold text-lg hover:bg-emerald-900 transition shadow-lg hover:shadow-xl active:scale-95"
          >
            Shop Now
          </button>

          {/* TRUST */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Trusted By
              </p>
              <p className="text-sm font-semibold text-gray-800">
                1,000+ Wellness Enthusiasts
              </p>
            </div>

            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PromoPopup;