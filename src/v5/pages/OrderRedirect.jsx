/* Third Biome v5, OrderRedirect.
   Straight port of src/pages/OrderConfirmation/OrderRedirect.jsx: resolves the
   PayU return landing → /order-confirmation/:orderNumber (set in sessionStorage
   by the checkout before the PayU redirect), else falls back to home. */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastOrderNumber = sessionStorage.getItem("lastOrderNumber");
    if (lastOrderNumber) {
      navigate(`/order-confirmation/${lastOrderNumber}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return null;
}
