import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const FourthContent = () => {
  const currentBlog = {
    title: "Why Butyrate Is the Super Molecule Your Gut Is Praying For",
    author: "Dr. Sarah Johnson",
    date: "January 3, 2025",
    readTime: "7 min read",
    category: "Microbiome",
    image:
      "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
    content: [
      {
        type: "paragraph",
        text: "In the world of gut health, trends come and go — probiotics, detox teas, kombucha shots. But behind the buzzwords lies a molecule so powerful and essential, your gut is quietly begging for it: Butyrate. It's not flashy. It's not hyped. But butyrate is the cornerstone of true digestive healing — and the world is only beginning to understand its full potential. Let's explore why butyrate is the 'super molecule' your gut (and entire body) is silently praying for.",
      },
      {
        type: "heading",
        text: "What Is Butyrate?",
      },
      {
        type: "paragraph",
        text: "Butyrate (or butyric acid) is a short-chain fatty acid (SCFA) produced when your gut bacteria ferment dietary fiber in the colon. It's one of the three main SCFAs — along with acetate and propionate — but it's the one with the most potent impact on gut lining repair, immune function, and inflammation control. It's not a vitamin. It's not a probiotic. It's what your own bacteria make when you feed them right.",
      },
      {
        type: "paragraph",
        text: "In short: Butyrate is the currency your gut uses to heal, protect, and thrive.",
      },
      {
        type: "heading",
        text: "What Does Butyrate Do Inside Your Body?",
      },
      {
        type: "subheading",
        text: "1. Repairs and Seals Your Gut Lining",
      },
      {
        type: "paragraph",
        text: "Butyrate is the primary energy source for your colon cells (colonocytes). It helps tighten the gut barrier, preventing leaky gut — which has been linked to:",
      },
      {
        type: "list",
        items: [
          "Inflammation",
          "Autoimmunity",
          "Food sensitivities",
          "Mood disorders",
        ],
      },
      {
        type: "image",
        src: "https://ik.imagekit.io/starfiitstorage/testdfsfg.png",
        alt: "Butyrate repairs and seals gut lining - scientific diagram",
      },
      {
        type: "subheading",
        text: "2. Reduces Inflammation Systemically",
      },
      {
        type: "paragraph",
        text: "Butyrate inhibits NF-κB, a major pro-inflammatory pathway, and increases regulatory T cells, which calm the immune system.",
      },
      {
        type: "subheading",
        text: "3. Supports Brain Health and Mood",
      },
      {
        type: "paragraph",
        text: "Butyrate crosses the blood-brain barrier and boosts BDNF (Brain-Derived Neurotrophic Factor) — a molecule critical for memory, mood, and neuroplasticity. It's being explored in studies on depression, Alzheimer's, and anxiety.",
      },
      {
        type: "subheading",
        text: "4. Helps With Weight Regulation and Insulin Sensitivity",
      },
      {
        type: "paragraph",
        text: "Butyrate influences fat storage, improves insulin sensitivity, and reduces visceral fat by improving gut hormone signaling and reducing endotoxemia.",
      },
      {
        type: "heading",
        text: "Butyrate Deficiency: A Hidden Epidemic",
      },
      {
        type: "paragraph",
        text: "Despite its importance, most modern diets starve the microbiome of fiber, resulting in:",
      },
      {
        type: "list",
        items: [
          "Low butyrate production",
          "Weak gut lining",
          "Poor mood and immunity",
          "Chronic inflammation",
        ],
      },
      {
        type: "paragraph",
        text: "Stress, antibiotics, processed food, and sedentary lifestyles only make it worse. This is why butyrate is now being actively studied as a therapeutic molecule in conditions like:",
      },
      {
        type: "list",
        items: [
          "IBS & IBD",
          "PCOS",
          "Depression & cognitive decline",
          "Type 2 diabetes",
          "Autism spectrum disorders",
        ],
      },
      {
        type: "heading",
        text: "Summary: Why Butyrate = Super Molecule Status",
      },
      {
        type: "paragraph",
        text: "Function | Butyrate's Role",
      },
      {
        type: "list",
        items: [
          "Gut repair: Fuels colon cells, tightens junctions",
          "Inflammation control: HDAC inhibition, boosts Tregs",
          "Mental wellness: Increases BDNF, reduces neuroinflammation",
          "Immunity: Modulates immune cells + cytokines",
          "Metabolism & weight: Enhances insulin sensitivity",
        ],
      },
      {
        type: "paragraph",
        text: "It's praying for butyrate. At ThirdBiome, we've heard that prayer — and we're building the future of postbiotic wellness in India, starting with the power of butyrate.",
      },
      {
        type: "heading",
        text: "References",
      },
      {
        type: "list",
        items: [
          "Canani RB et al. (2011). Butyrate and intestinal barrier. World J Gastroenterol. PMID: 21472114",
          "Chang PV et al. (2014). HDAC inhibition by butyrate. Nat Rev Immunol. DOI: 10.1038/nri3746",
          "Stilling RM et al. (2016). Butyrate in the brain. J Neurosci Res. DOI: 10.1002/jnr.23710",
          "Gao Z et al. (2009). Butyrate improves insulin sensitivity. Diabetes. DOI: 10.2337/db08-1637",
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

export default FourthContent;
