import React from "react";
import image1 from "../assets/imageTest.webp";
import { formatImageUrl } from "../utils/urlUtils";

const bestSellers = [
  {
    id: 1,
    image: image1,
    title: "Metabolically Lean | Weight Management",
    durations: ["3 Month"],
    price: 1199,
    oldPrice: 1298,
    kit: "15 Days",
    rating: 4.4,
    reviews: 2871,
    mrp: true,
  },
  {
    id: 2,
    image: image1,
    title: "Gut Cleanse | 14 Prebiotic Colon Detox Shots",
    durations: ["14 Days Detox Kit"],
    price: 749,
    oldPrice: 799,
    kit: "14 Days Detox Kit",
    rating: 4.8,
    reviews: 1421,
    mrp: true,
  },
  {
    id: 3,
    image: image1,
    title: "Immunity Boost | Vitamin C & Zinc",
    durations: ["30 Days", "60 Days"],
    price: 899,
    oldPrice: 999,
    kit: "30 Days",
    rating: 4.6,
    reviews: 2156,
    mrp: true,
  },
  {
    id: 4,
    image: image1,
    title: "Sleep Well | Natural Sleep Support",
    durations: ["20 Days", "40 Days"],
    price: 649,
    oldPrice: 749,
    kit: "20 Days",
    rating: 4.7,
    reviews: 1834,
    mrp: true,
  },
];

const BestSeller = () => {
  return (
    <div className="py-10">
      <h2 className="text-4xl font-bold text-center mb-8">Our Best Sellers</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {bestSellers.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg w-80 p-4 flex flex-col items-center border border-gray-200 group hover:shadow-2xl transition-all duration-300 "
          >
            <div className="overflow-hidden mb-4">
              <img
                src={formatImageUrl(item.image)}
                alt={item.title}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 className="font-bold text-lg text-center mb-2">{item.title}</h3>
            <div className="flex gap-2 mb-2">
              {item.durations.map((d, i) => (
                <span key={i} className="border rounded-full px-3 py-1 text-xs">
                  {d}
                </span>
              ))}
            </div>
            <div className="mb-1">
              <span className="font-bold text-xl">₹{item.price}</span>
              {item.oldPrice && (
                <span className="line-through text-gray-500 ml-2">
                  ₹{item.oldPrice}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              MRP (incl. of all taxes)
            </div>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 text-lg">★</span>
              <span className="ml-1 font-bold">{item.rating}</span>
              <span className="ml-1 text-gray-500">
                ({item.reviews} reviews)
              </span>
            </div>
            <button className="bg-black text-white w-full py-2 rounded mt-auto">
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
