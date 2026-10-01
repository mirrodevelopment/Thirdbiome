import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getOrderByNumber, getOrderDetails } from "../../services/orderService";
import { showToast } from "../../utils/toast";
import {
    FaArrowLeft,
    FaShoppingBag,
    FaMapMarkerAlt,
    FaCreditCard,
    FaTruck,
} from "react-icons/fa";

const OrderDetails = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError(null);

                let fetchedOrder = null;

                // Try fetching by order number first
                try {
                    console.log("Attempting fetch by order number:", orderNumber);
                    const response = await getOrderByNumber(orderNumber);
                    console.log("Order fetch response (by number):", response);

                    if (response && response.success && response.data) {
                        fetchedOrder = response.data;
                    } else if (response && response.data && !response.success) {
                        fetchedOrder = response.data;
                    } else if (response && (response.items || response.orderNumber)) {
                        fetchedOrder = response;
                    }
                } catch (numErr) {
                    console.warn("Failed fetch by order number:", numErr.message);
                    // Don't throw here, let it try the fallback
                }

                // If not found by number, try fetching by ID as fallback
                if (!fetchedOrder) {
                    try {
                        console.log("Attempting fetch by ID as fallback:", orderNumber);
                        const idResponse = await getOrderDetails(orderNumber);
                        console.log("Order fetch response (by ID):", idResponse);

                        if (idResponse && idResponse.success && idResponse.data) {
                            fetchedOrder = idResponse.data;
                        } else if (idResponse && (idResponse.items || idResponse.orderNumber)) {
                            fetchedOrder = idResponse;
                        } else if (idResponse && idResponse.data) {
                            fetchedOrder = idResponse.data;
                        }
                    } catch (idErr) {
                        console.error("Failed fetch by ID:", idErr.message);
                        // If this also fails, we'll handle it below
                    }
                }

                if (fetchedOrder) {
                    // Safety check for items parsing if it comes as a string
                    if (typeof fetchedOrder.items === 'string') {
                        try {
                            fetchedOrder.items = JSON.parse(fetchedOrder.items);
                        } catch (e) {
                            console.error("Failed to parse items JSON:", e);
                            fetchedOrder.items = [];
                        }
                    }

                    // Ensure numeric fields are numbers for toFixed
                    if (fetchedOrder.totalAmount) fetchedOrder.totalAmount = Number(fetchedOrder.totalAmount);
                    if (Array.isArray(fetchedOrder.items)) {
                        fetchedOrder.items = fetchedOrder.items.map(item => ({
                            ...item,
                            price: item.price ? Number(item.price) : 0,
                            quantity: item.quantity ? Number(item.quantity) : 1
                        }));
                    }

                    setOrder(fetchedOrder);
                } else {
                    throw new Error("Order not found in either endpoint");
                }
            } catch (err) {
                console.error("FULL Error fetching order details:", err);
                setError(`Failed to load order details: ${err.message}`);
                showToast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (orderNumber) {
            fetchOrder();
        }
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <div className="text-gray-600 font-medium">Loading details...</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaShoppingBag className="text-red-400 text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <p className="text-gray-500 mb-6">{error || "The order you're looking for doesn't exist."}</p>
                        <button
                            onClick={() => navigate("/profile")}
                            className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors mb-6 font-medium"
                >
                    <FaArrowLeft className="text-sm" />
                    Back to Orders
                </button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#034327]">
                            Order #{order.orderNumber || order.id?.toString().slice(-8) || "N/A"}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Placed on {(() => {
                                const dateVal = order.orderDate || order.createdAt || order.created_at;
                                return dateVal ? new Date(dateVal).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "N/A";
                            })()}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                            {order.status
                                ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                : "Pending"}
                        </span>
                        {order.paymentStatus === 'paid' && (
                            <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                Paid
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaShoppingBag className="text-emerald-600" />
                                    Items ({order.items?.length || 0})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="p-6 flex gap-4 sm:gap-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/150?text=Product";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FaShoppingBag />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                <p className="font-bold text-emerald-700 ml-4">₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Quantity: {item.quantity}</p>
                                            <p className="text-sm text-gray-500">Unit Price: ₹{Number(item.price || 0).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Support Mobile View - Can add if needed, otherwise keeping it clean */}
                    </div>

                    {/* Sidebar - Summary & Addresses */}
                    <div className="space-y-6">

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                {/* Add Tax if available */}
                                <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-emerald-600" />
                                Shipping Address
                            </h3>
                            {order.shippingAddress ? (
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-medium text-gray-900">{order.customer?.name || "User"}</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No shipping address provided</p>
                            )}
                        </div>

                        {/* Need Help? */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="font-bold text-emerald-800 mb-2">Need Help?</h3>
                            <p className="text-sm text-emerald-700/80 mb-4">
                                Have questions about your order? Contact our support team.
                            </p>
                            <button
                                onClick={() => navigate("/contact")}
                                className="w-full py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-sm"
                            >
                                Contact Support
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderDetails;
