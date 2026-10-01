import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const SecondContent = () => {
  const currentBlog = {
    title: "How Your Gut Talks to Your Brain: The Gut-Brain Axis & Mood",
    author: "Dr. Sarah Johnson",
    date: "December 20, 2024",
    readTime: "9 min read",
    category: "Microbiome",

    content: [
      {
        type: "heading",
        text: "What Is the Gut-Brain Axis?",
      },
      {
        type: "paragraph",
        text: "The gut-brain axis (GBA) is the bi-directional communication system between your gastrointestinal tract and your central nervous system (CNS). It involves:",
      },
      {
        type: "list",
        items: [
          "Vagus nerve (the 'gut-to-brain hotline')",
          "Neurotransmitters like serotonin, dopamine, and GABA",
          "Immune cells & cytokines",
          "Microbial metabolites — especially short-chain fatty acids (SCFAs) like butyrate",
        ],
      },
      {
        type: "paragraph",
        text: "Your gut doesn't just digest food — it’s a second brain, home to over 100 million neurons and trillions of microbes that influence how you feel, think, and respond to stress.",
      },
      {
        type: "heading",
        text: "How Your Gut Microbiome Influences Your Mood",
      },
      {
        type: "subheading",
        text: "1. Neurotransmitter Production",
      },
      {
        type: "list",
        items: [
          "Up to 90% of serotonin (your 'feel-good' hormone) is made in the gut.",
          "Gut microbes can also produce GABA, dopamine, and acetylcholine — all key mood regulators.",
        ],
      },
      {
        type: "subheading",
        text: "2. Inflammation and Mental Health",
      },
      {
        type: "list",
        items: [
          "Chronic gut inflammation (due to dysbiosis or leaky gut) can trigger systemic inflammation — including neuroinflammation, which is linked to depression, anxiety, and cognitive decline.",
        ],
      },
      {
        type: "image",
        src: "https://ik.imagekit.io/starfiitstorage/Blog%201%20(1).png",
        alt: "Inflammation and Mental Health - Brain-Gut-Adrenal Axis Diagram",
      },
      {
        type: "subheading",
        text: "3. Short-Chain Fatty Acids (SCFAs) Like Butyrate",
      },
      {
        type: "list",
        items: [
          "SCFAs are postbiotic metabolites that gut microbes produce by fermenting dietary fibers.",
          "Butyrate, in particular, plays a key role in: Strengthening the gut barrier, Reducing inflammation, Enhancing BDNF (Brain-Derived Neurotrophic Factor), which supports brain plasticity and mood.",
        ],
      },
      {
        type: "subheading",
        text: "4. The Vagus Nerve: The Gut-Brain Superhighway",
      },
      {
        type: "list",
        items: [
          "The vagus nerve connects the gut and brain in real time.",
          "Studies show that stimulating the vagus nerve improves mood and reduces anxiety — and your microbiome can modulate that effect.",
        ],
      },
      {
        type: "heading",
        text: "The Modern Gut-Mood Crisis",
      },
      {
        type: "paragraph",
        text: "Today's lifestyle — full of stress, ultra-processed food, poor sleep, and overuse of antibiotics — damages the gut microbiome and disrupts the gut-brain axis. The result?",
      },
      {
        type: "list",
        items: [
          "Anxiety and brain fog",
          "Mood swings",
          "Depression",
          "Sleep disturbances",
          "Chronic fatigue",
        ],
      },
      {
        type: "paragraph",
        text: "That’s where postbiotics step in.",
      },
      {
        type: "heading",
        text: "Why Postbiotics Like Microencapsulated Trybutrate Are a Game-Changer",
      },
      {
        type: "paragraph",
        text: "While probiotics rely on colonization and prebiotics depend on your diet, postbiotics deliver the end product — directly. Trybutyrin, a patented tributyrin-based postbiotic, delivers butyrate in a stable, controlled form that reaches your colon effectively.",
      },
      {
        type: "subheading",
        text: "Benefits:",
      },
      {
        type: "list",
        items: [
          "Reduces gut and brain inflammation",
          "Supports serotonin pathways",
          "Enhances gut lining integrity",
          "Calms the nervous system",
        ],
      },
      {
        type: "paragraph",
        text: "In short: A healthy gut = a calmer brain. And Trybutyrin = precision mood support via the gut.",
      },
      {
        type: "heading",
        text: "5 Signs Your Mood Issues May Start in Your Gut",
      },
      {
        type: "list",
        items: [
          "You feel anxious after eating",
          "You’re bloated and moody often",
          "Brain fog and poor memory",
          "Irritability + poor sleep",
          "Food cravings and emotional eating",
        ],
      },
      {
        type: "paragraph",
        text: "If this sounds like you — it’s time to heal the gut to calm the mind.",
      },
      {
        type: "heading",
        text: "Final Takeaway: Heal the Gut, Help the Mind",
      },
      {
        type: "paragraph",
        text: "The science is clear: your mental well-being is deeply linked to your gut health. By nurturing your microbiome with the right inputs — especially postbiotics like Trybutyrin — you don’t just heal your digestion... you support your mood, focus, and emotional resilience. At ThirdBiome, we're not chasing temporary fixes. We're building India’s first postbiotic-powered path to emotional wellness, starting from the gut, backed by science.",
      },
      {
        type: "heading",
        text: "References",
      },
      {
        type: "list",
        items: [
          "Strandwitz P. (2018). Neurotransmitter modulation by the microbiome. Nat Microbiol. DOI: 10.1038/s41564-018-0200-5",
          "Dantzer R et al. (2008). Inflammation-associated depression. Nat Rev Immunol. PMID: 18368030",
          "Stilling RM et al. (2016). Microbial butyrate promotes neurogenesis. J Neurosci Res. DOI: 10.1002/jnr.23710",
          "Bravo JA et al. (2011). Vagus nerve and microbiota communication. PNAS. DOI: 10.1073/pnas.1102999108",
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
            className="rounded-lg w-full h-auto mb-6"
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

export default SecondContent;
