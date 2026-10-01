import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import getApiClient from "../../axios/axios";
import { showToast } from "../../utils/toast";

const Quiz = () => {
  // Pre-quiz details
  const [userDetails, setUserDetails] = useState({
    name: "",
    whatsapp: "",
    email: "",
    dob: "",
    occupation: "",
  });
  const [detailsErrors, setDetailsErrors] = useState({});
  const [hasStarted, setHasStarted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [score, setScore] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  // Define the survey questions
  const questions = [
    {
      id: "Q1",
      text: "How often do you feel bloated after meals?",
      options: [
        { text: "A) Never — I feel comfortable after every meal", score: 0 },
        { text: "B) Occasionally — once or twice a week", score: 3 },
        { text: "C) Often — most days after meals", score: 6 },
        { text: "D) Very often — almost every single meal", score: 10 },
      ],
      fact: "Studies show that over 70% of chronic bloating cases are linked to disrupted gut signalling that affects the gut lining and inflammatory responses. This is often not a food intolerance, but a structural gut lining issue."
    },
    {
      id: "Q2",
      text: "How often do you experience excess gas, burping, or flatulence?",
      options: [
        { text: "A) Never — rarely an issue", score: 0 },
        { text: "B) Occasionally — a few times a week", score: 3 },
        { text: "C) Often — most days", score: 6 },
        { text: "D) Very often — daily discomfort", score: 10 },
      ],
      fact: "Gas in the digestive system comes from swallowed air, microbial fermentation or altered gut microbial balance. Third biome GTB addresses this at the source by restoring gut signals."
    },
    {
      id: "Q3",
      text: "How often do you experience low energy or fatigue during the day — especially after 2 pm?",
      options: [
        { text: "A) Never — my energy is consistent all day", score: 0 },
        { text: "B) Occasionally — some afternoons", score: 3 },
        { text: "C) Often — most afternoons I struggle", score: 6 },
        { text: "D) Very often — daily fatigue regardless of sleep", score: 10 },
      ],
      fact: "The 2-4pm energy crash is widely blamed on post-lunch blood sugar. But for many people, the real culprit is gut-derived. Your gut microbiome produces short-chain fatty acids — the primary fuel for your mitochondria. When microbiome health declines, so does cellular energy production."
    },
    {
      id: "Q4",
      text: "How often do you experience intense sugar or carbohydrate cravings?",
      options: [
        { text: "A) Never — I don't experience strong cravings", score: 0 },
        { text: "B) Occasionally — sometimes in afternoons", score: 3 },
        { text: "C) Often — most afternoons or evenings", score: 6 },
        { text: "D) Very often — daily and difficult to resist", score: 10 },
      ],
      fact: "Gut microbes can influence eating behavior through gut–brain signalling and neurotransmitter activity. When this signalling is balanced, it helps regulate cravings and appetite."
    },
    {
      id: "Q5",
      text: "How often do you wake up feeling unrefreshed — tired despite adequate sleep?",
      options: [
        { text: "A) Never — I generally wake up rested", score: 0 },
        { text: "B) Occasionally — some mornings", score: 3 },
        { text: "C) Often — most mornings feel sluggish", score: 6 },
        { text: "D) Very often — almost never wake up refreshed", score: 10 },
      ],
      fact: "90% of serotonin is made in your gut — not your brain. Serotonin is the precursor to melatonin, which governs sleep quality and depth. When gut microbiome disruption reduces serotonin synthesis, sleep becomes lighter and less restorative regardless of duration"
    },
    {
      id: "Q6",
      text: "How often does stress directly affect your digestion — causing urgency, cramping, or discomfort?",
      options: [
        { text: "A) Never — stress doesn't affect my digestion", score: 0 },
        { text: "B) Occasionally — major stress events only", score: 3 },
        { text: "C) Often — regular stress affects my gut", score: 6 },
        { text: "D) Very often — any stress causes gut symptoms", score: 10 },
      ],
      fact: "Around 80% of vagus nerve signals travel from the gut to the brain, meaning your gut constantly influences how your brain feels and functions. When gut signalling is disrupted, this communication weakens, affecting digestion and overall well-being."
    },
    {
      id: "Q7",
      text: "How often does stress directly affect your digestion — causing urgency, cramping, or discomfort?",
      options: [
        { text: "A) Never — stress doesn't affect my digestion", score: 0 },
        { text: "B) Occasionally — major stress events only", score: 3 },
        { text: "C) Often — regular stress affects my gut", score: 6 },
        { text: "D) Very often — any stress causes gut symptoms", score: 10 },
      ],
      fact: "Around 80% of vagus nerve signals travel from the gut to the brain, meaning your gut constantly influences how your brain feels and functions. When gut signalling is disrupted, this communication weakens, affecting digestion and overall well-being."
    },
    {
      id: "Q8",
      text: "How often do you feel hungry again within 2 hours of eating a full meal?",
      options: [
        { text: "A) Never — I feel full for 3-4 hours after meals", score: 0 },
        { text: "B) Often — most meals dont keep me full", score: 3 },
        { text: "C) Often — most days after meals", score: 6 },
        { text: "D) Very often — rarely feel satisfied after eating", score: 10 },
      ],
      fact: "GLP-1, PYY, and CCK are hormones from the gut that signal fullness to the brain. When gut signalling is disrupted, these signals weaken—leading to overeating and unstable blood sugar."
    },
    {
      id: "Q9",
      text: "How often do you eat processed, packaged, or restaurant food?",
      options: [
        { text: "A) Rarely — I cook most of my meals at home", score: 0 },
        { text: "B) Occasionally — 2-3 times per week", score: 3 },
        { text: "C) Often — most days include processed food", score: 6 },
        { text: "D) Very often — almost every meal is processed", score: 10 },
      ],
      fact: "Ultra processed foods are often low in fibre and high in additives, which can alter gut microbial composition and increase inflammatory potential."
    },
    {
      id: "Q10",
      text: "How often do you eat fibre-rich foods — vegetables, fruits, legumes, and wholegrains?",
      options: [
        { text: "A) Very often — vegetables and fibre at most meals", score: 0 },
        { text: "B) Often — most days include fibre-rich foods", score: 3 },
        { text: "C) Occasionally — a few times a week", score: 6 },
        { text: "D) Rarely — low fibre intake most days", score: 10 },
      ],
      fact: "Note: this question is reversed in scoring — high fibre intake scores lower (better gut health). Research consistently shows that microbiome diversity correlates strongly with dietary fibre variety than any single supplement. Third Biome GTB works synergistically with a fibre-rich diet by supporting healthy gut signalling similar to what fibre fermentation naturally promotes."
    }
  ];

  const calculateTotalScore = (responses) => {
    let total = 0;
    Object.values(responses).forEach((val) => {
      total += (typeof val === 'number' ? val : 0);
    });
    return total;
  };

  const getStatusFromScore = (totalScore) => {
    if (totalScore <= 20) return "Gut optimised";
    if (totalScore <= 40) return "Mild optimisation gap";
    if (totalScore <= 60) return "Moderate imbalance";
    if (totalScore <= 80) return "Significant gut stress";
    return "Severe Dysfunction";
  };

  const handleAnswer = (optionScore) => {
    const currentQuestion = questions[currentQuestionIndex];

    setUserResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: optionScore,
    }));

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const redirectToCalendly = () => {
    window.open("https://calendly.com/aeobiome-info/30min", "_blank");
  };

  const validateDetails = () => {
    const errors = {};
    if (!userDetails.name.trim()) errors.name = "Required";
    if (!userDetails.whatsapp.trim()) errors.whatsapp = "Required";
    if (
      userDetails.whatsapp &&
      !/^[0-9]{10}$/.test(userDetails.whatsapp.replace(/\D/g, ""))
    ) {
      errors.whatsapp = "Enter a valid 10-digit mobile number";
    }
    if (!userDetails.email.trim()) errors.email = "Required";
    if (
      userDetails.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)
    ) {
      errors.email = "Enter a valid email";
    }
    if (!userDetails.dob) errors.dob = "Required";
    if (!userDetails.occupation.trim()) errors.occupation = "Required";
    setDetailsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const startQuiz = () => {
    if (!validateDetails()) return;
    setHasStarted(true);
  };

  const submitQuiz = async () => {
    if (isSubmitting || isSubmitted) return;
    try {
      setIsSubmitting(true);
      
      const localScore = calculateTotalScore(userResponses);
      const localInterpretation = getStatusFromScore(localScore);
      
      setScore(localScore);
      setInterpretation(localInterpretation);

      const payload = {
        name: userDetails.name.trim(),
        whatsappNumber: userDetails.whatsapp.trim(),
        email: userDetails.email.trim(),
        dob: userDetails.dob,
        occupation: userDetails.occupation.trim(),
        responses: userResponses,
        calculatedScore: localScore,
        interpretation: localInterpretation
      };

      try {
        const api = await getApiClient();
        const { data } = await api.post("/gut-health", payload);
        setSubmissionId(data?.data?.id || data?.submissionId || null);
      } catch (err) {
        console.warn("Backend submission failed, proceeding with local calculation", err);
      }

      setIsSubmitted(true);
      showToast.success("Quiz completed successfully!");
    } catch (err) {
      showToast.error("Failed to process your result. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
      // End of form, show the generate report button
      return (
        <div className="text-center p-8 space-y-5 w-full">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-[#034327]">
                You're all set!
              </h2>
              <p className="text-gray-700 text-sm max-w-xl mx-auto">
                Submit your check-in to instantly view your Gut Health Score and Interpretation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <button
                  onClick={submitQuiz}
                  disabled={isSubmitting}
                  className={`py-3 px-8 rounded-full font-semibold text-white bg-[#034327] hover:bg-[#034327]/90 transition-colors shadow-md ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Calculating Results..." : "Show My Results"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2 text-green-600">
                Review your results — thank you!
              </h2>
              {/* {submissionId && (
                // <p className="text-xs text-gray-500 mb-4">ID: {submissionId}</p>
              )} */}

              {score !== null && (
                <div className="bg-[#034327]/5 border border-[#034327]/10 rounded-2xl p-6 mb-6">
                  <div className="text-sm text-gray-600 font-medium mb-1">Your Gut Health Score</div>
                  <div className="text-5xl font-bold text-[#034327] mb-3">{score}/100</div>
                  <div className="text text-gray-700 bg-white/50 p-3 rounded-xl border border-white">
                    <h2 className="font-bold text-[#034327]">Status: {interpretation}</h2>
                  </div>
                </div>
              )}

              <p className="text-gray-700 text-sm max-w-xl mx-auto mb-6">
                The next step is a one-on-one call with the Doctor to connect
                the dots on your symptoms, diet, and lifestyle.
              </p>
              <button
                onClick={redirectToCalendly}
                className="py-3 px-8 rounded-full font-semibold text-white bg-[#034327] hover:bg-[#034327]/90 transition-colors duration-200 shadow-lg"
              >
                Book My Doctor Interview
              </button>
            </>
          )}
        </div>
      );
    }

    const question = questions[currentQuestionIndex];

    return (
      <div className="space-y-6 w-full animate-fadeIn">
        <p className="text-xl font-semibold text-[#034327]">
          {currentQuestionIndex + 1}. {question.text}
        </p>
        <div className="flex flex-col space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className="w-full text-left py-4 px-6 rounded-xl font-medium text-gray-800 bg-white border border-gray-200 hover:border-[#034327] hover:bg-[#034327]/5 hover:text-[#034327] transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              onClick={() => handleAnswer(option.score)}
            >
              {option.text}
            </button>
          ))}
        </div>
        {question.fact && (
          <div className="mt-8 bg-blue-50/70 border border-blue-100 rounded-xl p-5 shadow-sm text-left">
            <h4 className="flex items-center text-blue-800 font-bold text-xs uppercase tracking-wider mb-2 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Science Fact
            </h4>
            <p className="text-blue-900/80 text-sm leading-relaxed">{question.fact}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className=" bg-gray-50">
        {/* Header band matching brand */}
        <div className="">
          <div className="max-w-5xl mx-auto px-6 py-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#034327] tracking-tight">
              Your Gut Health Check-In
            </h1>
            <p className="text-[#034327] text-sm md:text-base mt-2">
              A quick, guided check-in to understand your current symptoms and
              patterns
            </p>
          </div>
        </div>

        {/* Content card */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 pb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 animate-fadeIn border border-gray-100">
            {!hasStarted ? (
              <div>
                {/* Step badge */}
                <div className="mb-6">
                  <span className="inline-block bg-[#034327]/10 text-[#034327] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    Step 1 of 2 — Your details
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#034327] mb-1">
                  Tell us a bit about you
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  This helps us personalize your check-in and follow-ups.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userDetails.name}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, name: e.target.value })
                      }
                      className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#034327] ${detailsErrors.name
                        ? "border-red-400"
                        : "border-gray-300"
                        }`}
                      placeholder="Your full name"
                    />
                    {detailsErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {detailsErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={userDetails.whatsapp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                        if (value.length <= 10) {
                          setUserDetails({
                            ...userDetails,
                            whatsapp: value,
                          });
                        }
                      }}
                      className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#034327] ${detailsErrors.whatsapp
                        ? "border-red-400"
                        : "border-gray-300"
                        }`}
                      placeholder="e.g., 9876543210"
                      maxLength="10"
                    />
                    {detailsErrors.whatsapp && (
                      <p className="text-red-500 text-xs mt-1">
                        {detailsErrors.whatsapp}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          email: e.target.value,
                        })
                      }
                      className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#034327] ${detailsErrors.email
                        ? "border-red-400"
                        : "border-gray-300"
                        }`}
                      placeholder="you@example.com"
                    />
                    {detailsErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {detailsErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={userDetails.dob}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, dob: e.target.value })
                      }
                      className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#034327] ${detailsErrors.dob ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {detailsErrors.dob && (
                      <p className="text-red-500 text-xs mt-1">
                        {detailsErrors.dob}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={userDetails.occupation}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          occupation: e.target.value,
                        })
                      }
                      className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#034327] ${detailsErrors.occupation
                        ? "border-red-400"
                        : "border-gray-300"
                        }`}
                      placeholder="e.g., Student, Engineer, Homemaker"
                    />
                    {detailsErrors.occupation && (
                      <p className="text-red-500 text-xs mt-1">
                        {detailsErrors.occupation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Your information is kept private and used only for
                    personalization.
                  </div>
                  <button
                    onClick={startQuiz}
                    className="group relative bg-[#034327] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#034327]/90 transition-all"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Step badge and progress */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-block bg-[#034327]/10 text-[#034327] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    Step 2 of 2 — Symptoms
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.min(currentQuestionIndex + 1, questions.length)} /{" "}
                    {questions.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                  <div
                    className="h-2 bg-[#034327] rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((currentQuestionIndex + 1) / questions.length) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                {/* Question renderer */}
                <div className="min-h-[360px] flex items-center">
                  {renderQuestion()}
                </div>

                {/* Helper text */}
                <div className="mt-6 text-xs text-gray-500 text-center">
                  Answer honestly so we can help you
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #034327;
          border: 2px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #034327;
          border: 2px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Quiz;
