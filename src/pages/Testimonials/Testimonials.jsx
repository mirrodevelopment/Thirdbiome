import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Testimonials = () => {

    const testimonials = [
        {
            heading: "Revolutionary gut healing approach",
            quote:
                "Third Biome Gut has transformed how I approach gut health with my patients. Unlike traditional probiotics, this postbiotic formula delivers immediate results. The Thirdbiome GTB™ technology really works - my patients report significant improvements in gut barrier function and overall digestive comfort within weeks.",
            name: "Dr. Anita Sharma",
            title: "Gastroenterologist, MD, MBBS, DNB",
            subtitle: "About Third Biome Gut",
            image:
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
        },

        {
            heading: "My go-to gut health recommendation",
            quote:
                "I've tried many gut health products with my clients, but Third Biome Gut stands out. The postbiotic approach makes so much sense - you're getting the benefits without the uncertainty of live bacteria. My clients love how gentle yet effective it is for their digestive issues.",
            name: "Ravi Kumar",
            title: "Certified Nutritionist & Wellness Coach",
            subtitle: "About Third Biome Gut",
            image:
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
        },

        {
            heading: "Remarkable results for IBS patients",
            quote:
                "Third Biome Gut has been a game-changer for my IBS patients. The combination of Thirdbiome GTB and L-Glutamine provides comprehensive gut healing. I've seen remarkable improvements in bloating, irregular bowel movements, and overall gut comfort. It's now my first-line recommendation.",
            name: "Dr. Mithun Joshi",
            title: "Internal Medicine Specialist, MD, MRCP",
            subtitle: "About Third Biome Gut",
            image:
                "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
        },

        {
            heading: "Start with your gut",
            quote:
                "Start with your gut not your sugar levels or weight. Healing begins there",
            name: "Dr. Jonathan",
            title: "Post graduate from Sri Ramachandra medical college",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Janarathanan.jpg.jpeg",
        },

        {
            heading: "Gut health impacts overall wellness",
            quote:
                "Gut health is not digestion. It’s link to fatigue, inflammation, skin and mood problem. Postbiotics can rebalance it.",
            name: "Dr. Keerthika",
            title: "MBBS, MD, Sri Ramchandra medical college",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Keerthika.jpg.jpeg",
        },

        {
            heading: "Science-backed formulation",
            quote:
                "So many products today are built on trends. Third biome is different. This is a formulation developed by clinicians grounded in butyrate science tailored for the Indian microbiome diversity and mapped to real patient outcomes",
            name: "Dr. Balaji",
            title: "MBBS, MD, Department of pharmacology from SRMC",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Balaji.jpg.jpeg",
        },

        {
            heading: "Smarter gut interventions",
            quote:
                "Patients don’t need more pills. They need smarter interventions and postbiotics are one!",
            name: "Dr. Ram Prabhakaran",
            title: "MBBS, MD, Sri Ramachandra medical college",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Dr. Ram Prabhakaran.jpg.jpeg",
        },

        {
            heading: "Foundation for metabolic health",
            quote:
                "Improving gut integrity is foundational to metabolic health. Postbiotic supports that without any side effects",
            name: "Dr. Raj Mohan",
            title: "MBBS, MD, Department of pharmacology from SRMC",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Raj Mohan.jpg.jpeg",
        },

        {
            heading: "Support for fatigue and PCOD",
            quote:
                "I recommend postbiotics to anyone dealing with fatigue, PCOD and digestive distress",
            name: "Dr. Sandeep",
            title: "MBBS, MD, Sri Ramachandra medical college",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Sandeep.jpg.jpeg",
        },

        {
            heading: "Tributyrin clinical efficiency",
            quote:
                "As pharmacologist, we appreciate esters like tributyrin it bypasses the upper GI and reaches the colon intact maximizing its clinical efficacy",
            name: "Dr.Nidharshan",
            title: "MBBS, MD, Sri Ramachandra medical college",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Nidhrshan.jpg.jpeg",
        },

        {
            heading: "Innovation in postbiotics",
            quote:
                "So today we take many pills, but we are not in need of pills. But we need more innovations and one such innovation is postbiotics. And I highly command the third biome on their innovations on Postbiotics",
            name: "Dr. Tejas",
            title: "MBBS, MD, Department of pharmacology from SRMC",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Tejas.jpg.jpeg",
        },

        {
            heading: "Postbiotics for chronic conditions",
            quote:
                "In India, there are many chronic patients with obesity, diabetes and PCOS. They have underlying gut issues that’s where Postbiotics help.",
            name: "Dr. Janarathanan",
            title: "MBBS, MD, SRMC",
            subtitle: "About Third Biome Gut",
            image: "/images/doctors/Jana.jpg.jpeg",
        }
    ];

    return (

        <div className="min-h-screen bg-[#F8FAFC]">

      <Navbar />

      {/* Testimonials Section */}

      <div className=" py-20">

        {/* Page Title */}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white">
            <span className="text-[#004345]">Biome Stories</span>
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-6">

          {/* Section Title */}

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#004345]">
              What customers and healthcare providers say
            </h2>
          </div>

          {/* Testimonials Carousel */}

          <Swiper
         modules={[Autoplay, Pagination]}
  spaceBetween={30}
  slidesPerView={1}
  className="pb-12 mt-4"
  autoplay={{
    delay: 4000,
    disableOnInteraction: false
  }}
  pagination={{ clickable: true }}
  breakpoints={{
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }}
          >

            {testimonials.map((testimonial, index) => (

              <SwiperSlide key={index} className="flex">

             <div className="bg-white rounded-2xl p-7 flex flex-col w-full min-h-[320px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">

                  <h3 className="text-lg font-semibold text-[#004345] mb-4 min-h-[48px]">
                    {testimonial.heading}
                  </h3>

                  <div className="flex-grow mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-5">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  <div className="flex items-center mt-auto">

                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[#ebf6f2] mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="text-[#004345] font-semibold text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {testimonial.title}
                      </p>
                      <p className="text-xs text-[#004345] font-medium">
                        {testimonial.subtitle}
                      </p>
                    </div>

                  </div>

                </div>

              </SwiperSlide>

            ))}

          </Swiper>

        </div>


        {/* Video Section */}

        <div className="mt-20 max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Biome Stories 
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ebf6f2]">
              <div className="aspect-[9/16] w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/PHX5KGMsbKs"
                  title="Doctor Testimonial"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ebf6f2]">
              <div className="aspect-[9/16] w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/By3wXaX8Mys"
                  title="Doctor Testimonial"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#ebf6f2]">
              <div className="aspect-[9/16] w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/rKheM1scMmA"
                  title="Doctor Testimonial"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

    );

};


export default Testimonials;