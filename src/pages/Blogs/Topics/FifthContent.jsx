import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const FifthContent = () => {
  const currentBlog = {
    title:
      "What Does Microencapsulated Trybutyrate Do Inside Your Gut? A Deep Dive into Postbiotic Action",
    author: "Dr. Sarah Johnson",
    date: "January 10, 2025",
    readTime: "9 min read",
    category: "Postbiotics",
    image:
      "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
    content: [
      {
        type: "paragraph",
        text: "In a wellness world flooded with probiotics and gut detox trends, a quiet revolution is emerging — and its name is Microencapsulated Trybutyrate, a next-gen postbiotic that doesn't just survive the gut… it transforms it from the inside out. But what exactly is Microencapsulated Trybutyrate? What happens when it enters your gut? And why is it considered one of the most advanced gut-healing molecules in modern functional health? Let's unpack the science.",
      },
      {
        type: "heading",
        text: "What Is Microencapsulated Trybutyrate?",
      },
      {
        type: "paragraph",
        text: "Microencapsulated Trybutyrate is a triacylglycerol ester of butyric acid — simply put, it's three molecules of butyrate attached to a glycerol backbone. This structure makes it a stable, slow-release postbiotic form of butyrate, one of the most beneficial short-chain fatty acids (SCFAs) produced by your gut bacteria.",
      },
      {
        type: "paragraph",
        text: "It differs from common butyrate salts (like sodium butyrate) by being:",
      },
      {
        type: "list",
        items: [
          "Odorless and taste-neutral",
          "GI-tolerant with no irritation",
          "Sustained-release and more bioavailable",
          "Able to reach the colon intact",
        ],
      },
      {
        type: "heading",
        text: "What Happens When Microencapsulated Trybutyrate Enters Your Gut?",
      },
      {
        type: "subheading",
        text: "1. Colon-Targeted Butyrate Release",
      },
      {
        type: "paragraph",
        text: "It bypasses early absorption in the stomach and small intestine, thanks to its triglyceride structure. Once it reaches the colon, enzymes (lipases) break it down, releasing pure butyrate directly at the site where it's needed most.",
      },
      {
        type: "image",
        src: "https://ik.imagekit.io/starfiitstorage/testerrees.png",
        alt: "Microencapsulated Trybutyrate journey through the gut - scientific diagram",
      },
      {
        type: "subheading",
        text: "2. Cellular Energy for Gut Lining (Colonocytes)",
      },
      {
        type: "paragraph",
        text: "Butyrate becomes the primary energy source for colonocytes (cells lining the large intestine). This improves gut barrier function, promotes tissue repair, and prevents leaky gut.",
      },
      {
        type: "subheading",
        text: "3. Suppresses Gut Inflammation",
      },
      {
        type: "paragraph",
        text: "Microencapsulated Trybutyrate:",
      },
      {
        type: "list",
        items: [
          "Inhibits NF-κB, a pro-inflammatory pathway",
          "Increases regulatory T cells (Tregs)",
          "Reduces pro-inflammatory cytokines like IL-6 and TNF-α",
        ],
      },
      {
        type: "paragraph",
        text: "This makes Microencapsulated Trybutyrate a natural immunomodulator and gut anti-inflammatory.",
      },
      {
        type: "subheading",
        text: "4. Activates the Gut-Brain Axis",
      },
      {
        type: "paragraph",
        text: "Butyrate released from Microencapsulated Trybutyrate doesn't just stay in the gut. It can:",
      },
      {
        type: "list",
        items: [
          "Cross the blood-brain barrier",
          "Enhance BDNF (Brain-Derived Neurotrophic Factor)",
          "Reduce neuroinflammation",
          "Support mood, focus, and emotional resilience",
        ],
      },
      {
        type: "subheading",
        text: "5. Improves Metabolic Function",
      },
      {
        type: "paragraph",
        text: "Butyrate enhances insulin sensitivity, improves glucose tolerance, and helps in fat metabolism by influencing AMPK pathways and gut hormone secretion.",
      },
      {
        type: "heading",
        text: "Summary Table: The Gut-Level Impact of Trybutyrin",
      },
      {
        type: "paragraph",
        text: "Action | Effect",
      },
      {
        type: "list",
        items: [
          "Colon-targeted butyrate delivery: Fuels colonocytes, Max absorption in the large intestine",
          "Anti-inflammatory: Repairs gut lining, prevents leaky gut, Reduces IL-6, TNF-α, boosts Tregs",
          "Brain support: Enhances BDNF, reduces neuroinflammation",
          "Metabolic regulation: Improves insulin sensitivity, fat metabolism",
        ],
      },
      {
        type: "heading",
        text: "Why Microencapsulated Trybutyrate Matters in Today's India",
      },
      {
        type: "paragraph",
        text: "With skyrocketing rates of:",
      },
      {
        type: "list",
        items: [
          "IBS and gut disorders",
          "PCOS and metabolic syndrome",
          "Anxiety, sleep issues, and burnout",
          "Antibiotic overuse and fiber-deficient diets",
        ],
      },
      {
        type: "paragraph",
        text: "...India is facing a silent inflammation crisis, and the root lies in the gut. Trybutyrin offers a clinically backed, safe, stable, and scalable way to restore gut health — without relying on live bacteria or hoping for fermentation.",
      },
      {
        type: "heading",
        text: "ThirdBiome's Innovation: First-in-India Postbiotic Solution",
      },
      {
        type: "paragraph",
        text: "At ThirdBiome, we're pioneering India's first precision postbiotic platform, with Microencapsulated Trybutyrate at its core, combined with functional nutrients and AI-led symptom monitoring. Our mission is clear: deliver gut-deep healing, powered by next-gen molecules that actually work.",
      },
      {
        type: "heading",
        text: "Scientific References",
      },
      {
        type: "list",
        items: [
          "Kien CL et al. (2019). Tributyrin as a butyrate prodrug. J Nutr Biochem. DOI: 10.1016/j.jnutbio.2019.01.016",
          "Canani RB et al. (2011). Butyrate and intestinal barrier. World J Gastroenterol. PMID: 21472114",
          "Furusawa Y et al. (2013). Butyrate-induced Tregs and HDAC inhibition. Nature. DOI: 10.1038/nature12721",
          "Stilling RM et al. (2016). Butyrate in mood and brain health. J Neurosci Res. DOI: 10.1002/jnr.23710",
          "Gao Z et al. (2009). Butyrate and metabolism. Diabetes. DOI: 10.2337/db08-1637",
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
            className="rounded-lg mb-6"
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

export default FifthContent;
