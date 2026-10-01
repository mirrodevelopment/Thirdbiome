import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { payuService } from "../../services/paymentService";
import { getOrderByNumber } from "../../services/orderService";
import { getCart } from "../../services/cartService";
import { clearCart as clearCartAction } from "../../redux/slices/CartSlice";

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cartRefreshed, setCartRefreshed] = useState(false);

  const params = new URLSearchParams(location.search);
  const orderNumber =
    sessionStorage.getItem("lastOrderNumber") || params.get("orderNumber");

  // Cart refresh effect - runs immediately when component mounts
  useEffect(() => {
    const refreshCartAfterPayment = async () => {
      try {
        // Clear Redux state immediately
        dispatch(clearCartAction());

        // Wait a moment for backend to process
        setTimeout(async () => {
          await getCart();
          setCartRefreshed(true);
        }, 500);
      } catch (error) {
        // Still mark as refreshed to show UI feedback
        setCartRefreshed(true);
      }
    };

    // Refresh cart when component mounts (payment success)
    refreshCartAfterPayment();
  }, [dispatch]);

  // Payment verification effect
  useEffect(() => {
    const doVerify = async () => {
      if (!orderNumber) return;
      try {
        setVerifying(true);
        const res = await payuService.verify(orderNumber);
        setVerifyResult(res?.data || res);
        try {
          const orderRes = await getOrderByNumber(orderNumber);
          const statusCandidate =
            orderRes?.data?.paymentStatus ||
            orderRes?.paymentStatus ||
            orderRes?.data?.order?.paymentStatus;
          if (statusCandidate) setPaymentStatus(statusCandidate);
        } catch (orderError) {
          // Error fetching order details
        }
      } catch (e) {
        setError("Unable to verify payment at the moment.");
      } finally {
        setVerifying(false);
      }
    };
    doVerify();
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful
        </h1>
        <p className="text-gray-700 mt-2">
          Thank you! Your payment has been received. We are processing your
          order.
        </p>
        {cartRefreshed && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">
              ✅ Your cart has been refreshed and your order is being processed
            </p>
          </div>
        )}
        {orderNumber && (
          <p className="text-gray-900 font-medium mt-4">
            Order Number: {orderNumber}
          </p>
        )}

        {verifying && (
          <div className="mt-6 text-sm text-gray-500">
            Verifying payment with gateway...
          </div>
        )}
        {error && <div className="mt-6 text-sm text-red-600">{error}</div>}
        {paymentStatus && (
          <div className="mt-4 text-sm">
            <span className="font-semibold">Payment Status:</span>{" "}
            <span
              className={
                paymentStatus === "paid"
                  ? "text-green-700"
                  : paymentStatus === "failed"
                  ? "text-red-700"
                  : "text-yellow-700"
              }
            >
              {paymentStatus}
            </span>
          </div>
        )}

        {verifyResult && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Gateway Response</h2>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
              {JSON.stringify(verifyResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="px-4 py-2 bg-black text-white rounded">
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
