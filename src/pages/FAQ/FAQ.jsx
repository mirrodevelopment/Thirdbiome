import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const FAQ = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(0);

  const faqData = [
   {
      question: "Who founded Third Biome?",
      answer:
        "Third biome is founder by Jayavardhini Biomedical (uk) & Dr .Ariarasudhan MD  PhD combining clinical expertise  and her physician co-founder in Chennai, India. The team brings pharmacology, biomedical science, and gut health specialization. The parent company, Aeobiome Healthcare, is DPIIT registered (2025) with a patent pending in India.",
    },
    {
      question: "What makes Third Biome different from other gut health brands in India?",
      answer:
        "Third Biome is India's first patented postbiotic brand. While other brands focus on probiotics(live bacteria) or prebiotics (dietary fibre), Third Biome delivers Thirdbiome GTB (microencapsulated glycerol tributyrate)—a butyrate postbiotic that acts directly on the gut lining without relying on bacterial colonization. No Indian brand has done this before.",
    },
    {
      question: "What is the T3B Club?",
      answer:
        "The T3B Club is Third Biome's membership-based, doctor-guided 30-day postbiotic protocol. Members receive Biome Balance sachets, a clinical gut protocol, weekly check-ins, the Gut Letter newsletters and access to our medical team. Cohort 4 opens in April 2026.",
    },
    {
      question: "Where is Third Biome available?",
      answer:
        "Third Biome's public launch is on July 1, 2026, at @thirdbiome.com. Prior to launch, products are available exclusively through the T3B Club cohort program. Join the waitlist now for early access.",
    },
    {
      question: "Is Third Biome's product clinically validated?",
      answer:
        "Yes. Third Biome has run four cohorts of the T3B Club, with over 300 members tracking symptoms using our Gut Feeling scoring system. The formulation is based on peer-reviewed postbiotic and butyrate research and has been developed with clinical oversight.",
    },
    {
      question:
        "What is Third Biome™ Gut, and how is it different from probiotics?",
      answer:
        "Third Biome™ Gut is a postbiotic gut health  powered by Thirdbiome GTB™ (Thirdbiome GTB), L-Glutamine, Peppermint, and Fennel extracts. Unlike probiotics (live bacteria), postbiotics are clinically active metabolites that directly support gut healing, inflammation control, and microbiome balance without the need for live organisms.",
    },
    {
      question: "What does Thirdbiome GTB™ do in my gut?",
      answer:
        "Thirdbiome GTB™ is a patented triglyceride form of Thirdbiome GTB, a short-chain fatty acid that fuels colon cells, repairs the gut lining, reduces inflammation, and regulates bowel movement and supports brain-gut health.",
    },
    {
      question: "How should I take Third Biome™ Gut?",
      answer:
        " Preferably after a Meal, mixed with water, buttermilk, or a smoothie. It's tasteless and odorless and requires no refrigeration.",
    },
    {
      question: "How soon will I start seeing results?",
      answer:
        "Most users report reduced bloating in 5–7 days, improved bowel movements in 2–3 weeks, and enhanced energy and gut-brain clarity in 4–6 weeks.",
    },
    {
      question: "Can I take it along with my probiotics?",
      answer:
        "Yes! In fact, postbiotics like Thirdbiome GTB™ enhance the effect of probiotics by improving the gut environment and nutrient absorption.",
    },
    {
      question: "Is Third Biome™ Gut safe for long-term use?",
      answer:
        "Absolutely. All ingredients are clinically tested, gut-friendly, and non-habit forming. It's suitable for long-term gut health management and prevention.",
    },
    {
      question: "Who should take Third Biome™ Gut?",
      answer:
        "Ideal for those with bloating, gas, indigestion; IBS, irregular stools, food sensitivities; leaky gut, chronic inflammation; PCOS-related gut dysfunction; low energy, brain fog, or mood swings.",
    },
    {
      question: "Is it suitable for vegetarians and vegans?",
      answer:
        "Yes. Third Biome™ Gut is 100% vegetarian, gluten-free, non-GMO, and dairy-free.",
    },
    {
      question: "Does it cause any side effects?",
      answer:
        "The formulation is well-tolerated, even in sensitive guts. Rarely, initial mild gas or stool changes may occur — a sign of microbiome modulation, which settles in a few days.",
    },
    {
      question: "Can it be taken during pregnancy or breastfeeding?",
      answer:
        "Please consult your healthcare provider before using any supplement during pregnancy or lactation, although ingredients like L-Glutamine and Thirdbiome GTB are generally regarded as safe.",
    },
    // {
    //   question: "What is the role of L-Glutamine in this formula?",
    //   answer:
    //     "L-Glutamine is a gut-healing amino acid that helps rebuild the intestinal barrier, reduce gut permeability, and restore healthy gut lining post-infection or inflammation.",
    // },
    {
      question: "How do peppermint and fennel extracts help?",
      answer:
        "These botanicals relax the gut muscles, reduce cramping, spasms, and bloating, and support smooth digestion without synthetic antacids or laxatives.",
    },
    {
      question: "Can I use this daily or only when I feel bloated?",
      answer:
        "Third Biome™ Gut is designed for daily use to reset and maintain gut health. Regular use provides cumulative benefits beyond occasional relief.",
    },
    {
      question: "How is this different from fiber or psyllium husk?",
      answer:
        "Fiber only feeds gut bacteria. Thirdbiome GTB™ delivers active Thirdbiome GTB, while L-Glutamine repairs the lining and botanicals relieve symptoms. It works at a deeper, cellular level than fiber supplements.",
    },
    {
      question: "Is it suitable for people with IBS or IBD?",
      answer:
        "Yes — the formulation is FODMAP-friendly and designed for sensitive guts. Thirdbiome GTB and L-Glutamine are clinically studied in IBS/IBD for reducing inflammation and improving stool quality.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#004345] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to know about Third Biome, postbiotics, and
              your gut health journey.
            </p>
            <div className="w-24 h-1.5 bg-[#004345] mx-auto rounded-full mt-6"></div>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 h-fit ${
                  expandedFAQ === index
                    ? "border-l-[10px] border-l-[#004345] shadow-xl bg-[#f5fffb]/50"
                    : "hover:shadow-lg border-l-[10px] border-l-transparent"
                }`}
              >
                <button
                  className="w-full text-left p-6 md:p-8 group focus:outline-none"
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === index ? -1 : index)
                  }
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xl font-bold transition-colors duration-300 ${
                        expandedFAQ === index
                          ? "text-[#004345]"
                          : "text-gray-800 group-hover:text-[#004345]"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4 ${
                        expandedFAQ === index
                          ? "bg-[#004345] text-white rotate-180 shadow-md"
                          : "bg-gray-100 text-[#004345] group-hover:bg-[#004345]/10"
                      }`}
                    >
                      <span className="text-2xl leading-none">
                        {expandedFAQ === index ? "−" : "+"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      expandedFAQ === index
                        ? "grid-rows-[1fr] opacity-100 mt-6"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
