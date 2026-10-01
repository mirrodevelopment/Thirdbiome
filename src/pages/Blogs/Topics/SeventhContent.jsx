import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const SeventhContent = () => {
  const currentBlog = {
    title: "What Your Poop Says About Your Health — And How to Fix It",
    author: "Dr. Sarah Johnson",
    date: "January 24, 2025",
    readTime: "10 min read",
    category: "Gut Health",
    image:
      "https://ik.imagekit.io/starfiitstorage/Blog%201.png?updatedAt=1752559566659",
    content: [
      {
        type: "paragraph",
        text: "The Ultimate Gut Health Decoder You Never Knew You Needed",
      },
      {
        type: "paragraph",
        text: "Let's be honest: talking about poop makes people uncomfortable. But here's the truth — your poop is your body's daily health report. It's one of the most important (and overlooked) indicators of your gut health, digestion, hydration, metabolism, inflammation, and even mood. We believe the journey to optimal health starts with understanding the clues your body gives you every day — especially the ones you flush away. Let's dive in.",
      },
      {
        type: "heading",
        text: "What Is Poop, Really?",
      },
      {
        type: "paragraph",
        text: "Feces is about:",
      },
      {
        type: "list",
        items: [
          "75% water",
          "25% solid matter, including: Dead and live gut bacteria, Undigested food (mostly fiber), Mucus and bile, Sloughed-off gut lining cells, Waste metabolites and toxins",
        ],
      },
      {
        type: "paragraph",
        text: "In other words, poop is a mirror reflecting your gut microbiome and how efficiently your digestive system is working.",
      },
      {
        type: "heading",
        text: "The 7 Types of Poop — Explained",
      },
      {
        type: "paragraph",
        text: "The Bristol Stool Chart, developed by researchers at the University of Bristol, classifies poop into 7 types:",
      },
      {
        type: "list",
        items: [
          "Type 1: Hard, separate lumps - Severe constipation",
          "Type 2: Lumpy and sausage-shaped - Mild constipation",
          "Type 3: Like a sausage with cracks - Normal, slightly dehydrated",
          "Type 4: Smooth, soft sausage - Ideal stool",
          "Type 5: Soft blobs with clear edges - Mild urgency, possible fiber lack",
          "Type 6: Fluffy pieces, mushy - Mild diarrhea or inflammation",
          "Type 7: Watery, no solid pieces - Severe diarrhea",
        ],
      },
      {
        type: "image",
        src: "https://ik.imagekit.io/starfiitstorage/stool.png",
        alt: "Bristol Stool Chart - visual guide to stool types",
      },
      {
        type: "heading",
        text: "5 Red Flags Your Poop May Reveal",
      },
      {
        type: "subheading",
        text: "1. Constipation (Types 1–2)",
      },
      {
        type: "paragraph",
        text: "Could signal:",
      },
      {
        type: "list",
        items: [
          "Low fiber",
          "Dehydration",
          "Slow gut motility",
          "Dysbiosis or low butyrate levels",
        ],
      },
      {
        type: "subheading",
        text: "2. Chronic Diarrhea (Types 6–7)",
      },
      {
        type: "paragraph",
        text: "Could indicate:",
      },
      {
        type: "list",
        items: [
          "Inflammation (IBS-D, IBD)",
          "SIBO (Small Intestinal Bacterial Overgrowth)",
          "Food intolerances",
          "Gut microbiome imbalance",
        ],
      },
      {
        type: "subheading",
        text: "3. Floating, Foul-Smelling Stool",
      },
      {
        type: "paragraph",
        text: "May point to:",
      },
      {
        type: "list",
        items: [
          "Malabsorption (especially fats)",
          "Pancreatic insufficiency",
          "Gut flora imbalance",
        ],
      },
      {
        type: "subheading",
        text: "4. Pale or Clay-Colored Stool",
      },
      {
        type: "paragraph",
        text: "May suggest:",
      },
      {
        type: "list",
        items: ["Bile flow issues", "Liver or gallbladder dysfunction"],
      },
      {
        type: "subheading",
        text: "5. Mucus or Blood in Stool",
      },
      {
        type: "paragraph",
        text: "Requires medical evaluation — could be linked to:",
      },
      {
        type: "list",
        items: [
          "Inflammation (IBD, colitis)",
          "Gut lining damage",
          "Hemorrhoids or fissures",
        ],
      },
      {
        type: "heading",
        text: "Did You Know? Your Poop Affects Your Mood",
      },
      {
        type: "paragraph",
        text: "You excrete a significant number of neurotransmitter precursors and microbial byproducts daily. Disruptions in your microbiome can lead to:",
      },
      {
        type: "list",
        items: ["Brain fog", "Irritability", "Anxiety", "Sleep issues"],
      },
      {
        type: "heading",
        text: "How to Fix It: 5 Gut-Boosting Strategies",
      },
      {
        type: "subheading",
        text: "1. Increase Fiber Intake (25–30g/day)",
      },
      {
        type: "paragraph",
        text: "Feed your gut bacteria with prebiotics: oats, bananas, garlic, flaxseed, etc.",
      },
      {
        type: "subheading",
        text: "2. Stay Hydrated",
      },
      {
        type: "paragraph",
        text: "Water supports motility and softens stool — aim for 2.5–3L/day.",
      },
      {
        type: "subheading",
        text: "3. Move Your Body",
      },
      {
        type: "paragraph",
        text: "Regular movement stimulates peristalsis — nature's internal massage.",
      },
      {
        type: "subheading",
        text: "4. Rebalance Your Microbiome",
      },
      {
        type: "paragraph",
        text: "Probiotics help — but what your gut really needs are postbiotics, the beneficial metabolites (like butyrate) that do the heavy lifting.",
      },
      {
        type: "subheading",
        text: "5. Use Targeted Postbiotics Like Trybutyrin",
      },
      {
        type: "paragraph",
        text: "Trybutyrin, a tributyrin-based postbiotic, delivers butyrate directly to the colon, where it:",
      },
      {
        type: "list",
        items: [
          "Fuels gut lining cells",
          "Tightens the intestinal barrier",
          "Reduces inflammation",
          "Normalizes bowel movements",
        ],
      },
      {
        type: "heading",
        text: "Poop-Check Quick Summary",
      },
      {
        type: "paragraph",
        text: "Sign | Possible Cause | Action Needed",
      },
      {
        type: "list",
        items: [
          "Hard, dry stools | Low fiber, dehydration, dysbiosis | Add fiber, hydrate, Trybutyrin™",
          "Loose, urgent stools | Inflammation, IBS, infection | Rule out IBD, consider postbiotics",
          "Mucus, foul odor | Gut inflammation or malabsorption | Gut test, consult a provider",
          "No poop in 2+ days | Constipation, sluggish motility | Move more, increase fiber",
        ],
      },
      {
        type: "heading",
        text: "Final Takeaway: Listen to Your Stool — It Never Lies",
      },
      {
        type: "paragraph",
        text: "Your poop is not waste — it's information. Tracking your stool daily helps you decode: What your gut needs, What your diet lacks, Whether your gut barrier is healing or inflamed, And how well your microbiome is functioning. At ThirdBiome, we believe that healing starts in the gut, and Trybutyrin is one of the most powerful tools to reboot and rebalance your digestive system — from the inside out.",
      },
      {
        type: "heading",
        text: "References",
      },
      {
        type: "list",
        items: [
          "Heaton KW, Lewis SJ. (1997). Scand J Gastroenterol Suppl. PMID: 9146732",
          "Parthasarathy G et al. (2016). Neurogastroenterol Motil. DOI: 10.1111/nmo.12772",
          "Cryan JF et al. (2019). Nat Rev Neurosci. DOI: 10.1038/s41583-019-0203-9",
          "Canani RB et al. (2011). World J Gastroenterol. PMID: 21472114",
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

export default SeventhContent;
