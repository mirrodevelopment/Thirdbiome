import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getBlogBySlug } from "../../services/blogService";

const BlogDetail = () => {
    const { id: slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API Base URL for fixing relative images
    const API_BASE_URL = "https://admin.thirdbiome.com";

    useEffect(() => {
        fetchBlogDetail();
        fetchRecentBlogs();
    }, [slug]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const data = await getBlogBySlug(slug);
            if (data && data.success && data.data) {
                setBlog(data.data);
            } else {
                setError("Blog post not found");
            }
        } catch (err) {
            console.error("Error fetching blog detail:", err);
            setError("Failed to load blog content. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentBlogs = async () => {
        try {
            const data = await getBlogBySlug(""); // Assuming getBlogs or similar
        } catch (err) {
            console.error("Error fetching recent blogs:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center items-center py-40">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#114639]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h2>
                    <p className="text-gray-600 mb-8">{error || "Blog not found"}</p>
                    <Link to="/blogs" className="text-[#114639] font-bold hover:underline">
                        ← Back to all blogs
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const rawDate = blog.date || blog.created_at;
    const formattedDate = rawDate 
        ? (!isNaN(new Date(rawDate).getTime()) 
            ? new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
            : rawDate.toString().split('T')[0])
        : "March 2025";
        
    const authorName = blog.author || "Aeobiome Editorial";
    const authorInitials = authorName.split(" ").map((n) => n[0]).slice(0, 3).join("") || "A";

    // Cleanup formatContent to handle HTML sanitization and URL fixing
    const formatContent = (content) => {
        if (!content) return "";

        let finalHtml = "";
        
        // 1. Detect if it's HTML or Plain Text
        const isHtml = /<p|<h\d|<div|<ul|<ol|<span|<b|<strong/i.test(content);

        if (isHtml) {
            finalHtml = content;
        } else {
            // Fallback plain text formatter (already improved)
            const lines = content.replace(/\r/g, '').split('\n');
            let tempHtml = '';
            let inList = false;
            let inNumberedList = false;

            lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) {
                    if (inList) { tempHtml += '</ul>'; inList = false; }
                    if (inNumberedList) { tempHtml += '</ol>'; inNumberedList = false; }
                    tempHtml += '<div class="h-8"></div>';
                    return;
                }

                const isListItem = trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*');
                const isNumberedItem = /^\d+\.\s/.test(trimmedLine);

                if (isListItem) {
                    if (inNumberedList) { tempHtml += '</ol>'; inNumberedList = false; }
                    if (!inList) { tempHtml += '<ul class="list-disc pl-6 mb-8 space-y-4">'; inList = true; }
                    tempHtml += `<li>${trimmedLine.replace(/^[-\•\*]\s*/, '')}</li>`;
                } else if (isNumberedItem) {
                    if (inList) { tempHtml += '</ul>'; inList = false; }
                    if (!inNumberedList) { tempHtml += '<ol class="list-decimal pl-6 mb-8 space-y-4">'; inNumberedList = true; }
                    tempHtml += `<li>${trimmedLine.replace(/^\d+\.\s*/, '')}</li>`;
                } else {
                    if (inList) { tempHtml += '</ul>'; inList = false; }
                    if (inNumberedList) { tempHtml += '</ol>'; inNumberedList = false; }
                    
                    const isHeading = ((trimmedLine.length < 80 && !trimmedLine.includes('.')) || trimmedLine.endsWith(':') || (index === 0 && trimmedLine.length < 100));
                    
                    if (trimmedLine.startsWith('Q:')) {
                        tempHtml += `<p class="font-bold text-gray-900 text-xl mt-10">${trimmedLine}</p>`;
                    } else if (isHeading) {
                        tempHtml += `<h2 class="text-3xl lg:text-4xl font-extrabold text-[#111827] mt-12 mb-6">${trimmedLine}</h2>`;
                    } else {
                        tempHtml += `<p class="mb-8 text-lg">${trimmedLine}</p>`;
                    }
                }
            });
            if (inList) tempHtml += '</ul>';
            if (inNumberedList) tempHtml += '</ol>';
            finalHtml = tempHtml;
        }

        // 2. Sanitize HTML, ensuring we don't drop styles
        const cleanHtml = DOMPurify.sanitize(finalHtml, {
            ADD_ATTR: ['style', 'class', 'target'],
            FORBID_TAGS: ['script', 'iframe'] 
        });

        // 3. Fix Image URLs 
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanHtml, 'text/html');
        
        // Fix images: relative path -> absolute path
        const images = doc.querySelectorAll('img');
        images.forEach(img => {
            let src = img.getAttribute('src');
            if (src && (src.startsWith('/uploads') || src.startsWith('/storage'))) {
                img.setAttribute('src', `${API_BASE_URL}${src}`);
            }
            // Add minimal responsive sizing constraint for images
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });

        // We removed the custom Tailwind class injection here to keep the content 
        // looking exactly like the backend design without extra styling overrides
        
        return doc.body.innerHTML;
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Article Content - Takes 2/3 of the space */}
                    <div className="lg:col-span-2">
                        {/* Article Header */}
                        <div className="mb-12">
                            <div className="inline-block bg-[#114639]/10 text-[#114639] px-4 py-1.5 rounded-full text-sm mb-6 font-bold tracking-wide uppercase">
                                {blog.category || "Health Insight"}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#111827] mb-8 leading-[1.15] tracking-tight">
                                {blog.title}
                            </h1>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-[#114639] rounded-full flex items-center justify-center text-white text-base font-bold mr-4 uppercase tracking-wider shadow-lg shadow-emerald-900/10">
                                    {authorInitials}
                                </div>
                                <div>
                                    <div className="text-base text-gray-900 font-bold">
                                        {authorName}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                        {formattedDate} {blog.readTime && `· ${blog.readTime}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Featured Image */}
                        {blog.image && (
                            <div className="mb-14 rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-900/10 border border-gray-100">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                        
                        {/* Article Body */}
                        <div
                            className="bg-white ck-content text-gray-800 text-base leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                        />

                        {/* Article Footer / Back Link */}
                        <div className="mt-24 pt-10 border-t border-gray-100">
                            <Link to="/blogs" className="group inline-flex items-center gap-3 text-[#114639] font-bold text-lg hover:text-[#1a6b57] transition-all">
                                <span className="transition-transform group-hover:-translate-x-2">←</span> Back to all insights
                            </Link>
                        </div>
                    </div>
                    
                    {/* Sidebar - Takes 1/3 of the space */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-gray-50 rounded-xl p-8 border border-gray-200">
                            <div className="border-t-4 border-[#114639] pt-4 mb-5">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Third Biome
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                                Check out the Third Biome to learn more about our products, customer stories, and our take on gut health, microbiome science, and more.
                            </p>
                            <Link
                                to="/products"
                                className="block w-full bg-[#114639] text-white text-center py-3.5 px-6 rounded-lg font-bold tracking-wide hover:bg-[#1a6b57] transition-colors"
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

export default BlogDetail;
