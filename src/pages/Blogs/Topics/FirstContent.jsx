import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const FirstContent = () => {
  const { topicSlug } = useParams();

  const blogContent = {
    "postbiotics-vs-probiotics": {
      title:
        "Postbiotics vs Probiotics vs Prebiotics: What's the Real Difference?",
      author: "Dr. Sarah Johnson",
      date: "December 15, 2024",
      readTime: "8 min read",
      category: "Microbiome",
      image:
        "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
      content: [
        {
          type: "paragraph",
          text: "When it comes to gut health, the words probiotics, prebiotics, and postbiotics are often thrown around interchangeably. But they're not the same — and understanding the difference could change the way you approach your digestive health forever.",
        },
        {
          type: "paragraph",
          text: "Let's break down the real science — and see why postbiotics are emerging as the most promising player in this gut game.",
        },
        {
          type: "heading",
          text: "What Are Probiotics?",
        },
        {
          type: "paragraph",
          text: "Probiotics are live microorganisms, mostly bacteria or yeast, that when consumed in adequate amounts, provide health benefits to the host. They're found in supplements, yogurt, fermented foods like kimchi or kombucha.",
        },
        {
          type: "subheading",
          text: "Benefits",
        },
        {
          type: "list",
          items: [
            "Restore gut flora after antibiotic use",
            "Support immune health",
            "Help manage diarrhea, IBS, and certain inflammatory conditions",
          ],
        },
        {
          type: "subheading",
          text: "Limitations",
        },
        {
          type: "list",
          items: [
            "Many don't survive stomach acid",
            "May not colonize the gut effectively",
            "Effects are strain-specific and not universal",
          ],
        },
        {
          type: "heading",
          text: "What Are Prebiotics?",
        },
        {
          type: "paragraph",
          text: 'Prebiotics are non-digestible fibers or compounds that feed beneficial gut bacteria. Think of them as "gut fertilizer."',
        },
        {
          type: "subheading",
          text: "Common Types",
        },
        {
          type: "list",
          items: [
            "Inulin",
            "Fructo-oligosaccharides (FOS)",
            "Galacto-oligosaccharides (GOS)",
          ],
        },
        {
          type: "subheading",
          text: "Benefits",
        },
        {
          type: "list",
          items: [
            "Nourish existing good bacteria",
            "Promote production of short-chain fatty acids (SCFAs) like butyrate",
            "Improve stool consistency and bowel regularity",
          ],
        },
        {
          type: "heading",
          text: "What Are Postbiotics?",
        },
        {
          type: "paragraph",
          text: "Postbiotics are the bioactive compounds produced when probiotics (or your own gut microbes) ferment prebiotics. These include:",
        },
        {
          type: "list",
          items: [
            "Short-chain fatty acids (e.g., butyrate, acetate, propionate)",
            "Enzymes",
            "Bacterial metabolites",
            "Cell wall fragments and peptides",
          ],
        },
        {
          type: "paragraph",
          text: "They are not live bacteria, but their benefits are real and direct — no need for survival or colonization.",
        },
        {
          type: "heading",
          text: "Why Postbiotics Are the Future",
        },
        {
          type: "subheading",
          text: "Direct Action",
        },
        {
          type: "paragraph",
          text: "Postbiotics like butyrate directly nourish colon cells (colonocytes), reduce inflammation, and improve gut barrier function.",
        },
        {
          type: "subheading",
          text: "Stable & Safe",
        },
        {
          type: "paragraph",
          text: "Unlike probiotics, they don't need refrigeration and don't risk infection in immunocompromised individuals.",
        },
        {
          type: "subheading",
          text: "Clinically Effective",
        },
        {
          type: "paragraph",
          text: "Postbiotics have shown anti-inflammatory, anti-obesity, anti-diabetic, and immune-modulating effects.",
        },
        {
          type: "heading",
          text: "Comparison Table",
        },
        {
          type: "table",
          headers: ["Feature", "Probiotics", "Prebiotics", "Postbiotics"],
          rows: [
            [
              "What is it?",
              "Live beneficial bacteria",
              "Non-digestible food for bacteria",
              "Bioactive metabolites from bacteria",
            ],
            ["Needs colonization?", "Yes", "No", "No"],
            ["Stability", "Heat/moisture sensitive", "Stable", "Highly stable"],
            [
              "Clinical consistency",
              "Varies by strain",
              "Depends on diet/microbiome",
              "More targeted & consistent",
            ],
            [
              "Key compound",
              "Lactobacillus, Bifidobacteria",
              "Inulin, FOS, GOS",
              "Butyrate, SCFAs, peptides",
            ],
            [
              "Found in",
              "Yogurt, kefir, supplements",
              "Garlic, banana, chicory root",
              "Aeobiome's Trybutyrin, ghee",
            ],
          ],
        },
        {
          type: "heading",
          text: "Why Aeobiome Focuses on Postbiotics",
        },
        {
          type: "paragraph",
          text: "At Aeobiome, we're pioneering India's first clinically formulated postbiotic to address gut disorders with precision.",
        },
        {
          type: "paragraph",
          text: "We believe the future of gut health is not in more live bacteria — but in targeted, stable molecules that speak the language of your microbiome.",
        },
        {
          type: "heading",
          text: "Final Thoughts",
        },
        {
          type: "paragraph",
          text: "If probiotics are the seeds, and prebiotics are the water and soil — postbiotics are the fruit. They represent the end product of a healthy gut process — and with innovations like Microencapsulated patented postbiotic technology, we can deliver that benefit directly to you, without the guesswork.",
        },
        {
          type: "heading",
          text: "References",
        },
        {
          type: "list",
          items: [
            'Suez J et al. (2018). "Post-antibiotic gut mucosal microbiome reconstitution is impaired by probiotics." Cell. DOI: 10.1016/j.cell.2018.08.047',
            'Canani RB et al. (2011). "Potential beneficial effects of butyrate in intestinal and extraintestinal diseases." World J Gastroenterol. PMID: 21472114',
            'Gibson GR et al. (2004). "Dietary modulation of the human colonic microbiota: updating the concept of prebiotics." J Nutr. [DOI: 10.1093/jn/134.3.481]',
            'Kien CL et al. (2019). "Effects of tributyrin supplementation on gut function and health." J Nutr Biochem. [DOI: 10.1016/j.jnutbio.2019.01.016]',
          ],
        },
      ],
    },
  };

  const currentBlog =
    blogContent[topicSlug] || blogContent["postbiotics-vs-probiotics"];

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
      case "table":
        return (
          <div key={index} className="overflow-x-auto my-8">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  {section.headers.map((header, headerIndex) => (
                    <th
                      key={headerIndex}
                      className="px-4 py-3 text-left text-sm font-bold text-gray-900 border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 text-sm text-gray-900 border-b"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content */}
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
              <p className="text-gray-600 leading-relaxed mb-6">
                When it comes to gut health, the words probiotics, prebiotics,
                and postbiotics are often thrown around interchangeably. But
                they're not the same — and understanding the difference could
                change the way you approach your digestive health forever.
              </p>
            </div>
            <div className="flex justify-center mb-7">
              <img
                src="https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659"
                alt="Featured blog"
                className="rounded-lg "
              />
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

export default FirstContent;
