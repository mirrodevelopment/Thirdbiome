import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#f1f5f9] to-[#e0f7fa]">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-40">
        {/* Provided SVG Cart Icon with Brand Color */}
        <div className="mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            xmlSpace="preserve"
            width="100"
            height="100"
          >
            <path
              fill="#b2e2d6"
              d="M26.029 58.156c-1.683 0-3.047 1.334-3.047 2.979 0 1.646 1.364 2.979 3.047 2.979s3.047-1.333 3.047-2.979c0-1.645-1.364-2.979-3.047-2.979zm17.795 0c-1.682 0-3.046 1.334-3.046 2.979 0 1.646 1.364 2.979 3.046 2.979 1.683 0 3.047-1.333 3.047-2.979 0-1.645-1.364-2.979-3.047-2.979zM22.515 26.997l5.416 14.5h21.793l6.189-14.5H22.515z"
            />
            <path
              fill="#134E4A"
              d="m58.753 13-9.67 28.181H23.85l-6.527-17.968h29.111v-2.27H14.036l7.722 21.258-6.281 10.643h35.794v-2.271H19.494l4.207-7.125h27.051l9.67-28.18H71V13H58.753zm-33.4 41.861c-3.134.002-5.674 2.484-5.676 5.548.002 3.065 2.542 5.548 5.676 5.549 3.133-.002 5.672-2.485 5.672-5.549 0-3.064-2.539-5.546-5.672-5.548zm0 8.827c-1.853-.003-3.35-1.468-3.353-3.279.003-1.81 1.5-3.274 3.353-3.277 1.849.003 3.349 1.467 3.352 3.277-.003 1.812-1.503 3.276-3.352 3.279zm17.794-8.827c-3.134.002-5.673 2.484-5.674 5.548.001 3.065 2.54 5.548 5.674 5.549 3.134-.002 5.672-2.485 5.674-5.549-.002-3.064-2.54-5.546-5.674-5.548zm0 8.827c-1.851-.003-3.349-1.468-3.352-3.279.003-1.81 1.501-3.274 3.352-3.277 1.851.003 3.35 1.467 3.353 3.277-.003 1.812-1.502 3.276-3.353 3.279z"
            />
          </svg>
        </div>
        <h1 className="text-6xl font-extrabold text-[#134E4A] mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-[#134E4A] text-center">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8 text-center max-w-xl mt-4">
          Sorry, we couldn’t find what you’re looking for. Let’s get you back to
          shopping!
        </p>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-[#134E4A] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#0d3a36] transition-colors duration-200 text-lg font-semibold"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path
              d="M3 12l9-9 9 9"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 21V9h6v12"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
