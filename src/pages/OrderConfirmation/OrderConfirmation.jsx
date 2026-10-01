import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getOrderByNumber } from "../../services/orderService";
import { payuService } from "../../services/paymentService";
import { showToast } from "../../utils/toast";
import {
  FaCheckCircle,
  FaHome,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderNumber) return;
      try {
        await payuService.verify(orderNumber);
      } catch (err) {
        // Payment verification failed
      }
    };

    verifyPayment();
  }, [orderNumber]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Get guest email from query param if present
        const params = new URLSearchParams(location.search);
        const guestEmail = params.get("email");
        const response = await getOrderByNumber(orderNumber, guestEmail);
        setOrder(response.data);
      } catch (err) {
        setError("Failed to load order details");
        showToast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading order details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">
              {error || "Order not found"}
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate totals
  const subtotal = order.items?.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  ) || 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Order Confirmation */}
          <div className="space-y-8">
            {/* Thank you message */}
            <div>
              <h1 className="text-8xl font-bold text-gray-900 mb-4">
                Thank you for your order!
              </h1>
            </div>

            {/* Order number card */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700 font-medium">
                Your order{" "}
                <span className="font-bold text-lg">{order.orderNumber}</span>
              </p>
            </div>

            {/* Manager contact info */}
            <div>
              <p className="text-gray-600">
                Our manager will contact you within 15 minutes
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                View Cart
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-6">
              {/* Items count */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {order.items.length} Items
                </h2>
              </div>

              {/* Order items */}
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item.variantId || item.id || index}
                    className="bg-white rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/imageTest.webp";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaShoppingBag />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.name || `Product ${index + 1}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.quantity}x
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
