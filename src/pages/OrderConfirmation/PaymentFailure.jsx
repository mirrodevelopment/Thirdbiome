import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { payuService } from "../../services/paymentService";
import { getOrderByNumber } from "../../services/orderService";

const PaymentFailure = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reason = params.get("reason");
  const orderNumber =
    sessionStorage.getItem("lastOrderNumber") || params.get("orderNumber");
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const doVerify = async () => {
      if (!orderNumber) return;
      try {
        setVerifying(true);
        await payuService.verify(orderNumber);
        try {
          const orderRes = await getOrderByNumber(orderNumber);
          const statusCandidate =
            orderRes?.data?.paymentStatus ||
            orderRes?.paymentStatus ||
            orderRes?.data?.order?.paymentStatus;
          if (statusCandidate) setPaymentStatus(statusCandidate);
        } catch {}
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
        <h1 className="text-2xl font-bold text-red-700">Payment Failed</h1>
        <p className="text-gray-700 mt-2">
          Unfortunately, your payment could not be completed.
        </p>
        {orderNumber && (
          <p className="text-gray-900 font-medium mt-4">
            Order Number: {orderNumber}
          </p>
        )}
        {reason && (
          <p className="text-sm text-gray-600 mt-2">Reason: {reason}</p>
        )}
        {verifying && (
          <div className="mt-4 text-sm text-gray-500">
            Verifying payment with gateway...
          </div>
        )}
        {paymentStatus && (
          <div className="mt-2 text-sm">
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
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <div className="mt-8 flex gap-3">
          <Link
            to="/checkout"
            className="px-4 py-2 bg-black text-white rounded"
          >
            Try Again
          </Link>
          <Link to="/" className="px-4 py-2 bg-gray-200 text-gray-900 rounded">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentFailure;
