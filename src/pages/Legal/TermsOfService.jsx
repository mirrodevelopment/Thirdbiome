import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const TermsOfService = () => {
    return (
        <div className=" ">
            <Navbar />
            <div className="mx-20">
                <div className=" p-8">
                    <h1 className="text-4xl font-bold text-[#134A4E] mb-2 text-center mt-10">
                        Terms and Conditions
                    </h1>
                    <p className="text-lg font-bold italic text-gray-900 mt-10 mb-8 mx-44 text-center">
                        Last Updated: July 19, 2025
                    </p>

                    <div className="space-y-6 text-gray-800 leading-relaxed mx-44">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Acceptance of Terms
                            </h2>
                            <p className="mb-4">
                                By accessing and using the website located at{" "}
                                <a href="https://www.thirdbiome.com" className="underline text-blue-600">
                                    www.thirdbiome.com
                                </a>{" "}
                                ("Website"), you agree to be bound by these Terms and Conditions ("Terms").
                                If you do not agree to these Terms, please do not use our Website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                2. Use of the Website
                            </h2>
                            <p className="mb-3">
                                You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content or disrupting the normal flow of dialogue within our Website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                3. Intellectual Property
                            </h2>
                            <p className="mb-3">
                                All content on this Website, including text, graphics, logos, images, and software, is the property of Aeobiome Healthcare Pvt. Ltd. and is protected by international copyright laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                4. Limitation of Liability
                            </h2>
                            <p className="mb-3">
                                Aeobiome Healthcare Pvt. Ltd. will not be liable for any damages that will arise from the use of this Website. This includes, but is not limited to, direct, indirect, incidental, punitive, and consequential damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                5. Governing Law
                            </h2>
                            <p className="mb-3">
                                These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Coimbatore, Tamil Nadu.
                            </p>
                        </section>

                        <section className="bg-gray-100 p-6 rounded-lg border">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Contact Us
                            </h2>
                            <p className="mb-4">
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </p>
                            <div className="text-gray-700">
                                <p className="font-semibold">Aeobiome Healthcare Pvt. Ltd.</p>
                                <p>Email: <a href="mailto:support@thirdbiome.com" className="text-blue-600 hover:text-blue-800 underline">support@thirdbiome.com</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsOfService;
