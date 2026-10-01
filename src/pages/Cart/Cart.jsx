import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { showToast } from "../../utils/toast";
import imageFallback from "../../assets/imageTest.webp";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowLeft,
  FaCreditCard,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  generateSessionId,
} from "../../services/cartService";
import { formatImageUrl } from "../../utils/urlUtils";

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // Fetch cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      if (!localStorage.getItem("sessionId")) {
        await generateSessionId();
      }
      await getCart();
    };
    initializeCart();
  }, []);

  // Calculate totals excluding items with stock issues
  const availableItems = cartItems.filter(
    (item) => !item.isOutOfStock && !item.hasStockIssue
  );
  const outOfStockItems = cartItems.filter((item) => item.isOutOfStock);
  const stockIssueItems = cartItems.filter((item) => item.hasStockIssue);

  const totalAmount = availableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      console.log("Updating quantity in full cart page:", { cartItemId, newQuantity });
      await updateCartItemQuantity(cartItemId, newQuantity);
      showToast.success("Cart updated");
    } catch (err) {
      // Check if it's a stock-related error
      if (err.message && err.message.includes("stock")) {
        showToast.error(err.message);
      } else {
        showToast.error("Failed to update cart");
      }
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      showToast.success("Item removed");
    } catch (err) {
      showToast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-2xl text-emerald-600 animate-pulse" />
            </div>
            <div className="text-lg text-[#034327] font-medium">
              Loading your cart...
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-2xl text-red-600" />
            </div>
            <div className="text-lg text-red-600 font-medium">{error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-3xl sm:text-4xl text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#034327] mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
              Start your wellness journey! Discover our premium products and add
              them to your cart.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#034327] to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold text-sm"
            >
              <FaArrowLeft />
              Start Shopping
            </button>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FaShippingFast className="text-emerald-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Free Shipping Over ₹100
                </p>
              </div>
              <div className="p-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FaShieldAlt className="text-emerald-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Secure Payment
                </p>
              </div>
              <div className="p-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FaHeart className="text-emerald-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Premium Quality
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-6 lg:mb-0">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center border border-emerald-300">
                  <FaShoppingBag className="text-lg sm:text-2xl text-emerald-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">
                    {cartItems.length}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#034327]">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-medium">
                  Review your items and proceed to checkout
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-full text-emerald-700 text-xs font-medium tracking-wide">
                    {cartItems.length} ITEM{cartItems.length !== 1 ? "S" : ""}
                  </span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-xs" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-200 hover:text-[#034327] transition-all duration-300 transform hover:scale-105 text-sm"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 border-b border-emerald-200">
                  <h2 className="text-lg font-bold text-[#034327] flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaShoppingBag className="text-emerald-600 text-sm" />
                    </div>
                    Your Items
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={formatImageUrl(item.image)}
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-emerald-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = formatImageUrl(imageFallback);
                              }}
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                              <FaHeart className="text-white text-xs" />
                            </div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-[#034327] mb-2">
                                {item.name}
                              </h3>
                              {/* Show stock status */}
                              {item.isOutOfStock && (
                                <div className="mb-3">
                                  <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                              {!item.isOutOfStock &&
                                item.hasStockIssue &&
                                item.availableStock !== null && (
                                  <div className="mb-3">
                                    <span className="inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                                      Only {item.availableStock} available (you
                                      have {item.quantity})
                                    </span>
                                  </div>
                                )}
                              {!item.isOutOfStock &&
                                !item.hasStockIssue &&
                                item.availableStock !== null &&
                                item.availableStock <= 5 && (
                                  <div className="mb-3">
                                    <span className="inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                                      Only {item.availableStock} left
                                    </span>
                                  </div>
                                )}
                              {/* Legacy support for backend stock field */}
                              {!item.isOutOfStock &&
                                !item.hasStockIssue &&
                                item.stock !== undefined &&
                                item.stock === 0 && (
                                  <div className="mb-3">
                                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                                      Out of Stock
                                    </span>
                                  </div>
                                )}
                              {!item.isOutOfStock &&
                                !item.hasStockIssue &&
                                item.stock !== undefined &&
                                item.stock > 0 &&
                                item.stock <= 5 && (
                                  <div className="mb-3">
                                    <span className="inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                                      Only {item.stock} left
                                    </span>
                                  </div>
                                )}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg font-bold text-[#034327]">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Premium
                                </span>
                              </div>
                            </div>

                            {/* Quantity & Remove */}
                            <div className="flex flex-col items-end gap-3">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-3 text-red-500 hover:bg-red-50 transition-all rounded-xl border border-red-100 hover:border-red-200 shadow-sm"
                                title="Remove item"
                              >
                                <FaTrash size={20} />
                              </button>

                              <div className="flex items-center gap-1 bg-white rounded-xl border border-emerald-200 p-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-10 h-10 flex items-center justify-center rounded-l-xl hover:bg-emerald-100 transition-colors border-r border-emerald-100"
                                  disabled={
                                    item.quantity <= 1 ||
                                    item.isOutOfStock ||
                                    item.hasStockIssue
                                  }
                                >
                                  <FaMinus size={16} className="text-emerald-700" />
                                </button>
                                <span className="w-12 text-center font-bold text-emerald-900 border-x-0">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={
                                    item.isOutOfStock ||
                                    item.hasStockIssue ||
                                    (item.availableStock !== null &&
                                      item.quantity >= item.availableStock) ||
                                    (item.stock !== undefined &&
                                      item.quantity >= item.stock)
                                  }
                                  className="w-10 h-10 flex items-center justify-center rounded-r-xl hover:bg-emerald-100 transition-colors border-l border-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <FaPlus size={16} className="text-emerald-700" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium text-sm">
                                Item Total:
                              </span>
                              <span
                                className={`text-base font-bold ${
                                  item.isOutOfStock || item.hasStockIssue
                                    ? "text-gray-400 line-through"
                                    : "text-[#034327]"
                                }`}
                              >
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            {(item.isOutOfStock || item.hasStockIssue) && (
                              <div className="text-right">
                                <span className="text-xs text-red-600 font-medium">
                                  {item.isOutOfStock
                                    ? "Cannot purchase - Out of stock"
                                    : "Stock issue - Check quantity"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 border-b border-emerald-200">
                  <h2 className="text-lg font-bold text-[#034327] flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FaShoppingBag className="text-emerald-600 text-sm" />
                    </div>
                    Order Summary
                  </h2>
                </div>

                <div className="p-4 space-y-4">
                  {/* Summary Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm">
                        Subtotal ({availableItems.length} available{" "}
                        {availableItems.length === 1 ? "item" : "items"})
                      </span>
                      <span className="text-base font-bold text-[#034327]">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                    {(outOfStockItems.length > 0 ||
                      stockIssueItems.filter((item) => !item.isOutOfStock)
                        .length > 0) && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-red-600 font-medium text-sm">
                          Stock issues ({outOfStockItems.length} out of stock,{" "}
                          {
                            stockIssueItems.filter((item) => !item.isOutOfStock)
                              .length
                          }{" "}
                          insufficient)
                        </span>
                        <span className="text-red-600 font-bold text-sm">
                          Cannot purchase
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium flex items-center gap-2 text-sm">
                        <FaShippingFast className="text-emerald-500" />
                        Shipping
                      </span>
                      <span className="text-emerald-600 font-bold text-sm">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-sm">
                        Tax
                      </span>
                      <span className="text-base font-bold text-[#034327]">
                        ₹0.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl px-3 border border-emerald-200">
                      <span className="text-base font-bold text-[#034327]">
                        Total
                      </span>
                      <span className="text-lg font-bold text-[#034327]">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stock issues warning */}
                  {(outOfStockItems.length > 0 ||
                    stockIssueItems.filter((item) => !item.isOutOfStock)
                      .length > 0) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-xs text-red-700 font-medium text-center">
                        Please resolve stock issues to continue checkout
                      </p>
                      {outOfStockItems.length > 0 && (
                        <p className="text-xs text-red-600 text-center mt-1">
                          • {outOfStockItems.length} item(s) out of stock
                        </p>
                      )}
                      {stockIssueItems.filter((item) => !item.isOutOfStock)
                        .length > 0 && (
                        <p className="text-xs text-red-600 text-center mt-1">
                          •{" "}
                          {
                            stockIssueItems.filter((item) => !item.isOutOfStock)
                              .length
                          }{" "}
                          item(s) have insufficient stock
                        </p>
                      )}
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={
                      loading ||
                      outOfStockItems.length > 0 ||
                      stockIssueItems.filter((item) => !item.isOutOfStock)
                        .length > 0 ||
                      availableItems.length === 0
                    }
                    className={`w-full font-bold py-3 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-2 text-sm ${
                      loading ||
                      outOfStockItems.length > 0 ||
                      stockIssueItems.filter((item) => !item.isOutOfStock)
                        .length > 0 ||
                      availableItems.length === 0
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-[#034327] to-emerald-600 text-white hover:from-emerald-700 hover:to-emerald-500 hover:scale-105 hover:shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : outOfStockItems.length > 0 ||
                      stockIssueItems.filter((item) => !item.isOutOfStock)
                        .length > 0 ? (
                      <>Resolve Stock Issues</>
                    ) : (
                      <>Proceed to Checkout</>
                    )}
                  </button>

                  {/* Continue Shopping Link */}
                  <button
                    onClick={() => navigate("/products")}
                    className="w-full bg-gray-100 border border-gray-200 text-[#034327] font-medium py-2 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    Continue Shopping
                  </button>
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

export default Cart;
