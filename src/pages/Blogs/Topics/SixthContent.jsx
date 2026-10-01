import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const SixthContent = () => {
  const currentBlog = {
    title:
      "Curd, Buttermilk and Probiotics: Are They Enough for Modern Gut Health?",
    author: "Dr. Sarah Johnson",
    date: "January 17, 2025",
    readTime: "8 min read",
    category: "Traditional Foods",
    image:
      "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
    content: [
      {
        type: "paragraph",
        text: "For generations, Indians have turned to curd and buttermilk as the natural elixirs for digestion. These traditional ferments are rich in probiotic bacteria and form a cornerstone of Ayurvedic and home remedies alike. But as gut health challenges escalate in modern India — from IBS, PCOD, leaky gut, to mental health issues — one question arises: Are curd and buttermilk still enough in today's ultra-processed, high-stress world? Or does modern gut health need more than traditional probiotics? Let's explore the truth behind these staples, and why science is now looking beyond probiotics — into the future of postbiotics like Microencapsulated Trybutyrate.",
      },
      {
        type: "heading",
        text: "The Science of Traditional Probiotics",
      },
      {
        type: "paragraph",
        text: "Both curd and buttermilk contain live cultures, mainly:",
      },
      {
        type: "list",
        items: [
          "Lactobacillus delbrueckii subsp. bulgaricus",
          "Streptococcus thermophilus",
          "Sometimes wild Lactobacillus plantarum or Bifidobacteria",
        ],
      },
      {
        type: "paragraph",
        text: "These are beneficial bacteria that help:",
      },
      {
        type: "list",
        items: [
          "Improve lactose digestion",
          "Modulate immune function",
          "Inhibit some pathogens",
          "Maintain gut flora balance",
        ],
      },
      {
        type: "heading",
        text: "So… Are They Enough?",
      },
      {
        type: "paragraph",
        text: "Unfortunately, not anymore — and here's why:",
      },
      {
        type: "subheading",
        text: "1. Limited Strain Diversity",
      },
      {
        type: "list",
        items: [
          "Homemade curd/buttermilk typically contains 1–2 strains of bacteria.",
          "The human gut has over 1000+ species; a couple of strains aren't sufficient for true microbiome diversity.",
        ],
      },
      {
        type: "subheading",
        text: "2. Poor Survivability Through the GI Tract",
      },
      {
        type: "list",
        items: [
          "Most live bacteria from curd don't survive stomach acid or bile.",
          "This limits their ability to colonize or produce beneficial metabolites like short-chain fatty acids (SCFAs).",
        ],
      },
      {
        type: "subheading",
        text: "3. Mismatch With Modern Lifestyles",
      },
      {
        type: "paragraph",
        text: "Modern India is facing a gut crisis due to:",
      },
      {
        type: "list",
        items: [
          "Processed food & refined carbs",
          "Low fiber diets",
          "Environmental toxins",
          "Chronic stress and antibiotic use",
        ],
      },
      {
        type: "paragraph",
        text: "This leads to:",
      },
      {
        type: "list",
        items: [
          "Dysbiosis (imbalance of gut flora)",
          "Low SCFA production (especially butyrate)",
          "Weakened gut barrier function (leaky gut)",
        ],
      },
      {
        type: "paragraph",
        text: "Even daily curd can't undo years of microbial damage.",
      },
      {
        type: "heading",
        text: "So What's Missing? The Answer: Postbiotics like Microencapsulated Trybutyrate",
      },
      {
        type: "paragraph",
        text: "While probiotics introduce bacteria and prebiotics feed them, postbiotics are the bioactive metabolites they produce — especially butyrate, the supermolecule for gut repair.",
      },
      {
        type: "heading",
        text: "Why Postbiotics Like Microencapsulated Trybutyrate Are the Game Changer",
      },
      {
        type: "paragraph",
        text: "Microencapsulated Trybutyrate is a clinically advanced, triglyceride-bound form of butyrate that bypasses the stomach and releases butyrate directly in the colon.",
      },
      {
        type: "subheading",
        text: "How Microencapsulated Trybutyrate Complements Traditional Foods:",
      },
      {
        type: "paragraph",
        text: "Curd/Buttermilk | Microencapsulated Trybutyrate",
      },
      {
        type: "list",
        items: [
          "Contains live bacteria | Contains direct butyrate (no bacteria)",
          "May not survive digestion | Reaches colon intact",
          "Limited strain action | Broad anti-inflammatory and repair effects",
          "Needs consistent intake | Clinically-dosed precision delivery",
        ],
      },
      {
        type: "heading",
        text: "Ancient Wisdom Meets Modern Science",
      },
      {
        type: "paragraph",
        text: "Yes — curd and buttermilk are beautiful traditional foods. They support digestion, cool the system, and offer light probiotic benefits. But for modern conditions like:",
      },
      {
        type: "list",
        items: [
          "IBS, IBD, SIBO",
          "PCOS, metabolic syndrome",
          "Anxiety and mood imbalance",
          "Chronic fatigue and leaky gut",
        ],
      },
      {
        type: "paragraph",
        text: "...we need therapeutic-level gut repair, not just cultural support.",
      },
      {
        type: "heading",
        text: "Final Takeaway",
      },
      {
        type: "paragraph",
        text: "Your grandmother's curd recipe is still sacred — but your 21st-century gut needs more firepower. Postbiotics like Microencapsulated Trybutyrate go beyond tradition, offering precision, potency, and proven gut healing — without the need for live bacteria. At Aeobiome, we're not replacing your curd. We're building on top of it — with the best of science, for the future of Indian gut health.",
      },
      {
        type: "heading",
        text: "References",
      },
      {
        type: "list",
        items: [
          "Nagpal R et al. (2012). Probiotic potential of Indian fermented dairy. J Med Food. PMID: 22510121",
          "Lozupone CA et al. (2012). Diversity and resilience of the human gut microbiome. Nature. DOI: 10.1038/nature11550",
          "Cook MT et al. (2012). Survival of probiotics in the GI tract. Trends Food Sci Tech. DOI: 10.1016/j.tifs.2012.05.003",
          "Kien CL et al. (2019). Butyrate delivery via tributyrin. J Nutr Biochem. DOI: 10.1016/j.jnutbio.2019.01.016",
        ],
      },
    ],
  };

  const renderContent = (section, index) => {
    switch (section.type) {
      case "heading":
        return (
          <h2
            key={index}
            className="text-2xl font-bold text-gray-900 mb-6 mt-12 first:mt-0"
          >
            {section.text}
          </h2>
        );
      case "subheading":
        return (
          <h3 key={index} className="text-lg font-bold text-gray-900 mb-4 mt-8">
            {section.text}
          </h3>
        );
      case "paragraph":
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-6">
            {section.text}
          </p>
        );
      case "list":
        return (
          <ul
            key={index}
            className="list-disc list-inside text-gray-700 mb-6 space-y-2"
          >
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="ml-4">
                {item}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article Content - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-8">
              <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm mb-4">
                {currentBlog.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentBlog.title}
              </h1>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#114639] rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                  {currentBlog.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm text-gray-900 font-medium">
                    {currentBlog.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentBlog.date}
                  </div>
                </div>
              </div>
            </div>
            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {currentBlog.content.map((section, index) =>
                renderContent(section, index)
              )}
            </div>
          </div>
          {/* Sidebar - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="border-t-4 border-[#114639] pt-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Aeobiome Blog
                </h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Check out the Aeobiome blog to learn more about our products,
                customer stories, and our take on gut health, microbiome
                science, and more.
              </p>
              {/* CTA Button */}
              <Link
                to="/products/gut-health"
                className="block w-full bg-[#114639] text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-[#0d3529] transition-colors"
              >
                VISIT WEBSITE
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SixthContent;
