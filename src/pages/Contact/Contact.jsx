import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import contactService from "../../services/contactService";
import { showToast } from "../../utils/toast";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        if (!phone.trim()) return true; // Phone is optional
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ""));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 10) {
            setFormData((prev) => ({
                ...prev,
                phone: value,
            }));
            if (errors.phone) {
                setErrors((prev) => ({
                    ...prev,
                    phone: "",
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || undefined,
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            };

            const response = await contactService.submitContact(payload);

            showToast.success(
                response?.message || "Message sent successfully! We'll get back to you soon."
            );

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
            setErrors({});
        } catch (error) {
            console.error("Contact form error:", error);
            const errorMessage =
                error?.message ||
                (typeof error === "string" ? error : "Failed to send message. Please try again.");
            showToast.error(errorMessage);

            if (error?.errors) {
                setErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#034327] to-[#003335] py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Have a question, feedback, or need help with your order? We're here
                        to help.
                    </p>
                </div>
            </section>

            {/* Contact Details Section */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Email */}
                        <div className="bg-[#f5fffb] rounded-xl p-8 text-center border border-[#ebf6f2] hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-[#004345] rounded-full flex items-center justify-center mx-auto mb-5">
                                <span className="text-white text-2xl">✉️</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#004345] mb-2">Email Us</h3>
                            <p className="text-gray-600 text-sm mb-3">
                                For order support, returns, or general inquiries
                            </p>
                            <a
                                href="mailto:support@thirdbiome.com"
                                className="text-[#004345] font-semibold hover:underline"
                            >
                                support@thirdbiome.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="bg-[#f5fffb] rounded-xl p-8 text-center border border-[#ebf6f2] hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-[#004345] rounded-full flex items-center justify-center mx-auto mb-5">
                                <span className="text-white text-2xl">📞</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#004345] mb-2">Call Us</h3>
                            <p className="text-gray-600 text-sm mb-3">
                                Monday – Friday, 10 AM – 6 PM IST
                            </p>
                            <a
                                href="tel:+91XXXXXXXXXX"
                                className="text-[#004345] font-semibold hover:underline"
                            >
                                +91-XXXXXXXXXX
                            </a>
                        </div>

                        {/* Location */}
                        <div className="bg-[#f5fffb] rounded-xl p-8 text-center border border-[#ebf6f2] hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-[#004345] rounded-full flex items-center justify-center mx-auto mb-5">
                                <span className="text-white text-2xl">📍</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#004345] mb-2">
                                Our Office
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                                Third Biome Health Pvt. Ltd.
                            </p>
                            <p className="text-[#004345] font-semibold text-sm">India</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="bg-gradient-to-br from-[#f5fffb] to-white py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#004345] mb-2 text-center">
                        Send us a message
                    </h2>
                    <p className="text-gray-600 mb-8 text-center">
                        Fill out the form below and our team will get back to you within 24 hours.
                    </p>

                    <div className="bg-white rounded-xl shadow-lg p-8 border border-[#ebf6f2]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="contact-name"
                                        className="block text-sm font-semibold text-[#004345] mb-2"
                                    >
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="contact-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your full name"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] transition-colors ${errors.name ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="contact-email"
                                        className="block text-sm font-semibold text-[#004345] mb-2"
                                    >
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] transition-colors ${errors.email ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="contact-phone"
                                        className="block text-sm font-semibold text-[#004345] mb-2"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="contact-phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        placeholder="10-digit number"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] transition-colors ${errors.phone ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="block text-sm font-semibold text-[#004345] mb-2"
                                    >
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="contact-subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] transition-colors ${errors.subject ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="Order Support">Order Support</option>
                                        <option value="Returns & Refunds">Returns & Refunds</option>
                                        <option value="Product Queries">Product Queries</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                                    )}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="block text-sm font-semibold text-[#004345] mb-2"
                                >
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="How can we help you?"
                                    rows={5}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034327] transition-colors resize-none ${errors.message ? "border-red-500" : "border-gray-300"
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-[#034327] hover:bg-[#003335] text-white shadow-md hover:shadow-lg"
                                    }`}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Additional Info Section */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-[#ebf6f2]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm">🛒</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#004345] mb-1">
                                        Order Support
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Track, modify, or cancel your orders
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm">🔄</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#004345] mb-1">
                                        Returns & Refunds
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Help with returns or refund status
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm">🧬</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#004345] mb-1">
                                        Product Queries
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Questions about our formulations
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#004345] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm">🤝</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#004345] mb-1">
                                        Partnerships
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Collaborate with Third Biome
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
