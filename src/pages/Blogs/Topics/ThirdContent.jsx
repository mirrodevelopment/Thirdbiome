import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const ThirdContent = () => {
  const currentBlog = {
    title: "What Are SCFAs — And Why They’re the Missing Link in Your Health?",
    author: "Dr. Sarah Johnson",
    date: "December 27, 2024",
    readTime: "8 min read",
    category: "Microbiome",
    image:
      "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
    content: [
      {
        type: "paragraph",
        text: "Modern medicine is beginning to realize what ancient systems like Ayurveda always knew: your gut is the foundation of your overall health. But what's at the center of that foundation? A group of microscopic molecules called SCFAs (short-chain fatty acids) — the “invisible fuel” for your gut and beyond. From immunity to mood, metabolism to mental clarity, SCFAs are the missing link between your microbiome and whole-body health. Yet most people have never even heard of them. Let’s change that.",
      },
      {
        type: "heading",
        text: "What Are SCFAs?",
      },
      {
        type: "paragraph",
        text: "Short-chain fatty acids (SCFAs) are fatty acids with fewer than six carbon atoms. They are produced when gut bacteria ferment dietary fibers and prebiotics in your colon.",
      },
      {
        type: "list",
        items: [
          "Acetate (C2)",
          "Propionate (C3)",
          "Butyrate (C4) — the superstar SCFA",
        ],
      },
      {
        type: "paragraph",
        text: "These molecules aren’t just byproducts. They’re messengers, fuel sources, and inflammation regulators that affect your gut, brain, immune system, and metabolism.",
      },
      {
        type: "image",
        src: "https://ik.imagekit.io/starfiitstorage/Blog%201%20(2).png",
        alt: "What Are SCFAs? - Scientific diagram showing SCFA production and absorption in the gut",
      },
      {
        type: "heading",
        text: "How Are SCFAs Produced?",
      },
      {
        type: "paragraph",
        text: "When you eat fiber-rich foods like oats, bananas, garlic, or legumes, your gut bacteria feed on them. The fermentation process releases SCFAs, which then:",
      },
      {
        type: "list",
        items: [
          "Enter your bloodstream",
          "Signal to your immune and nervous system",
          "Feed your gut lining cells",
          "Influence everything from insulin sensitivity to mood",
        ],
      },
      {
        type: "heading",
        text: "Health Benefits of SCFAs",
      },
      {
        type: "subheading",
        text: "1. Gut Barrier Integrity (Butyrate)",
      },
      {
        type: "paragraph",
        text: "Butyrate fuels colonocytes (cells lining the colon), keeping your gut lining strong and preventing leaky gut — a root cause of inflammation.",
      },
      {
        type: "subheading",
        text: "2. Brain & Mood Regulation",
      },
      {
        type: "paragraph",
        text: "SCFAs, especially butyrate, cross the blood-brain barrier and enhance production of BDNF (Brain-Derived Neurotrophic Factor), promoting neuroplasticity, stress resilience, and mood stability.",
      },
      {
        type: "subheading",
        text: "3. Inflammation Reduction",
      },
      {
        type: "paragraph",
        text: "SCFAs reduce pro-inflammatory cytokines (e.g., TNF-α, IL-6) and promote regulatory T-cells — key players in autoimmune balance and immune tolerance.",
      },
      {
        type: "subheading",
        text: "4. Weight & Metabolism Support",
      },
      {
        type: "paragraph",
        text: "SCFAs improve insulin sensitivity, regulate glucose metabolism, and increase energy expenditure by signaling to your liver and fat cells.",
      },
      {
        type: "heading",
        text: "The Problem: Most People Are SCFA-Deficient",
      },
      {
        type: "paragraph",
        text: "Modern diets low in fiber and high in ultra-processed foods starve the gut microbiome. The result?",
      },
      {
        type: "list",
        items: [
          "Low SCFA production",
          "Weak gut lining",
          "Chronic inflammation",
          "Mental health imbalances",
          "Poor metabolic function",
        ],
      },
      {
        type: "paragraph",
        text: "This SCFA deficiency is a silent epidemic — and it’s one of the root causes behind IBS, obesity, PCOD, anxiety, and more.",
      },
      {
        type: "heading",
        text: "Solution: Postbiotics Like Microencapsulated Trybutyrate Deliver SCFAs Directly",
      },
      {
        type: "paragraph",
        text: "While prebiotics feed bacteria and probiotics hope to survive, postbiotics like Trybutyrin deliver butyrate — the most potent SCFA — directly to your colon. Trybutyrin, is a stable, triglyceride-bound version of butyrate that:",
      },
      {
        type: "list",
        items: [
          "Passes through the stomach without degradation",
          "Reaches the colon intact",
          "Releases butyrate in a controlled, sustained manner",
          "Repairs inflammation and improves gut-brain signaling",
        ],
      },
      {
        type: "heading",
        text: "Final Takeaway: SCFAs Are the Language of Your Microbiome",
      },
      {
        type: "paragraph",
        text: "Without SCFAs, your gut loses its voice — and your health suffers silently. At ThirdBiome, we’re not just treating symptoms. We’re restoring microbiome language with clinically advanced postbiotics like Trybutyrin — giving your gut and brain the fuel they need to thrive.",
      },
      {
        type: "heading",
        text: "References",
      },
      {
        type: "list",
        items: [
          "Canani RB et al. (2011). Butyrate and intestinal barrier function. World J Gastroenterol. PMID: 21472114",
          "Stilling RM et al. (2016). SCFAs and brain health. J Neurosci Res. DOI: 10.1002/jnr.23710",
          "Koh A et al. (2016). SCFAs and host physiology. Cell. DOI: 10.1016/j.cell.2016.05.041",
          "Byrne CS et al. (2015). Metabolic role of SCFAs. Nat Rev Endocrinol. DOI: 10.1038/nrendo.2015.128",
          "Kien CL et al. (2019). Tributyrin and gut inflammation. J Nutr Biochem. DOI: 10.1016/j.jnutbio.2019.01.016",
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
      case "image":
        return (
          <img
            key={index}
            src={section.src}
            alt={section.alt}
            className="w-full h-auto rounded-lg mb-6"
          />
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

export default ThirdContent;
