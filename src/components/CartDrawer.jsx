import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { useSelector } from "react-redux";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  generateSessionId,
} from "../services/cartService";
import { formatImageUrl } from "../utils/urlUtils";
import productImg from "../assets/imageTest.webp";
import {
  FaShoppingBag,
  FaTimes,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaTrash,
  FaSpinner,
  FaTag,
  FaShippingFast,
  FaLock,
  FaSync,
} from "react-icons/fa";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);

  // Fetch cart data when drawer opens
  useEffect(() => {
    if (isOpen) {
      const fetchCartData = async () => {
        if (!localStorage.getItem("sessionId")) {
          await generateSessionId();
        }
        await getCart();
      };
      fetchCartData();
    }
  }, [isOpen]);

  // Calculate totals excluding items with stock issues
  const availableItems = cartItems.filter(
    (item) => !item.isOutOfStock && !item.hasStockIssue
  );
  const outOfStockItems = cartItems.filter((item) => item.isOutOfStock);
  const stockIssueItems = cartItems.filter((item) => item.hasStockIssue);

  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 100 ? 0 : 2.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      console.log("Updating quantity in drawer:", { cartItemId, newQuantity });
      await updateCartItemQuantity(cartItemId, newQuantity);
      showToast.success("Cart updated"); // Re-added based on original logic
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Check if it's a stock-related error
      if (error.message && error.message.includes("stock")) {
        showToast.error(error.message);
      } else {
        showToast.error("Failed to update cart");
      }
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      showToast.success("Item removed"); // Re-added based on original logic
    } catch (error) {
      console.error("Error removing item:", error);
      showToast.error("Failed to remove item"); // Re-added based on original logic
    }
  };

  const handleContinueToCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleRefreshCart = async () => {
    try {
      if (!localStorage.getItem("sessionId")) {
        await generateSessionId();
      }
      await getCart();
      showToast.success("Cart refreshed");
    } catch (error) {
      showToast.error("Failed to refresh cart");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] lg:w-[630px] bg-gradient-to-br from-gray-50 to-emerald-50 shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Modern Header */}
        <div className="bg-white border-b border-emerald-200 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[#034327] hover:text-emerald-600 transition-colors duration-200 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200 text-sm" />
              <span className="font-medium text-sm">Continue Shopping</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshCart}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-emerald-100 text-[#034327] hover:text-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh cart"
              >
                <FaSync
                  className={`text-sm ${loading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-emerald-100 text-[#034327] hover:text-emerald-600 transition-all duration-200"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <FaShoppingBag className="text-emerald-600 text-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#034327]">Your Cart</h2>
                <p className="text-emerald-600 text-xs font-medium">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  selected
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-3">
                <FaSpinner className="text-emerald-600 text-lg animate-spin" />
              </div>
              <p className="text-[#034327] font-medium text-sm">
                Loading your cart...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-4">
                <FaShoppingBag className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-[#034327] mb-2 text-center">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-4 text-center max-w-xs text-sm">
                Discover our amazing products and start building your wellness
                journey
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-[#034327] to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 text-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={formatImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = formatImageUrl(productImg);
                          }}
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-[#034327] text-sm leading-tight">
                          {item.name}
                        </h3>
                        {/* Show stock status */}
                        {item.isOutOfStock && (
                          <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium mt-1">
                            Out of Stock
                          </span>
                        )}
                        {!item.isOutOfStock &&
                          item.hasStockIssue &&
                          item.availableStock !== null && (
                            <span className="inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium mt-1">
                              Only {item.availableStock} available (you have{" "}
                              {item.quantity})
                            </span>
                          )}
                        {!item.isOutOfStock &&
                          !item.hasStockIssue &&
                          item.availableStock !== null &&
                          item.availableStock <= 5 && (
                            <span className="inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium mt-1">
                              Only {item.availableStock} left
                            </span>
                          )}
                        {/* Legacy support for backend stock field */}
                        {!item.isOutOfStock &&
                          !item.hasStockIssue &&
                          item.stock !== undefined &&
                          item.stock === 0 && (
                            <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium mt-1">
                              Out of Stock
                            </span>
                          )}
                        {!item.isOutOfStock &&
                          !item.hasStockIssue &&
                          item.stock !== undefined &&
                          item.stock > 0 &&
                          item.stock <= 5 && (
                            <span className="inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium mt-1">
                              Only {item.stock} left
                            </span>
                          )}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200 ml-2 flex-shrink-0"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>

                      {item.selectedPlan && (
                        <p className="text-xs text-emerald-600 font-medium mb-2 bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                          {item.selectedPlan}
                        </p>
                      )}

                      {/* Price Display */}
                      <div className="flex items-center gap-2 mb-2">
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        <span className="font-bold text-[#034327] text-sm">
                          ₹{item.price.toFixed(2)}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-xs bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                              <FaTag className="text-[8px]" />
                              {Math.round(
                                ((item.originalPrice - item.price) /
                                  item.originalPrice) *
                                  100
                              )}
                              % OFF
                            </span>
                          )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center bg-gray-100 rounded-lg p-1 ${
                            item.isOutOfStock || item.hasStockIssue
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:text-[#034327] hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50"
                            disabled={
                              item.quantity <= 1 ||
                              item.isOutOfStock ||
                              item.hasStockIssue
                            }
                          >
                            <FaMinus size={14} className="text-gray-600" />
                          </button>
                          <span className="px-3 py-1 font-semibold text-[#034327] min-w-[2rem] text-center text-sm">
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
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:text-[#034327] hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-sm ${
                              item.isOutOfStock || item.hasStockIssue
                                ? "text-gray-400 line-through"
                                : "text-[#034327]"
                            }`}
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {(item.isOutOfStock || item.hasStockIssue) && (
                            <p className="text-xs text-red-600 mt-1">
                              {item.isOutOfStock
                                ? "Cannot purchase"
                                : "Stock issue"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modern Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t border-emerald-200 p-3 sm:p-4">
            {/* Order Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-3 mb-3">
              <h3 className="font-bold text-[#034327] mb-2 flex items-center gap-2 text-sm">
                <FaTag className="text-emerald-600" />
                Order Summary
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Subtotal ({availableItems.length}{" "}
                    {availableItems.length === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {outOfStockItems.length > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>
                      Out of stock ({outOfStockItems.length}{" "}
                      {outOfStockItems.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold">Not available</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span className="flex items-center gap-1">
                    <FaShippingFast className="text-emerald-600" />
                    Shipping & Processing
                  </span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `₹${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Estimated taxes</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
              </div>
              {subtotal < 100 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 font-medium">
                    Add ₹{(100 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-3 p-3 rounded-xl text-white">
              <span className="font-bold text-base text-[#034327]">Total</span>
              <span className="font-bold text-xl text-[#034327]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            {(outOfStockItems.length > 0 ||
              stockIssueItems.filter((item) => !item.isOutOfStock).length >
                0) && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs text-red-700 font-medium text-center">
                  Please resolve stock issues to continue checkout
                </p>
                {outOfStockItems.length > 0 && (
                  <p className="text-xs text-red-600 text-center mt-1">
                    • {outOfStockItems.length} item(s) out of stock
                  </p>
                )}
                {stockIssueItems.filter((item) => !item.isOutOfStock).length >
                  0 && (
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
            <button
              onClick={handleContinueToCheckout}
              disabled={
                outOfStockItems.length > 0 ||
                stockIssueItems.filter((item) => !item.isOutOfStock).length >
                  0 ||
                availableItems.length === 0
              }
              className={`w-full font-bold py-3 rounded-xl text-base transition-all duration-300 transform flex items-center justify-center gap-2 ${
                outOfStockItems.length > 0 ||
                stockIssueItems.filter((item) => !item.isOutOfStock).length >
                  0 ||
                availableItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-[#034327] to-emerald-600 hover:from-emerald-700 hover:to-emerald-800 text-white hover:scale-105 hover:shadow-lg"
              }`}
            >
              <FaLock className="text-sm" />
              {outOfStockItems.length > 0 ||
              stockIssueItems.filter((item) => !item.isOutOfStock).length > 0
                ? "Resolve Stock Issues"
                : "Secure Checkout"}
            </button>

            {/* Security Info */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout • Taxes calculated at checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
