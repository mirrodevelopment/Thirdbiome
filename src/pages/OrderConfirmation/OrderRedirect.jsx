import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderRedirect = () => {
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
};

export default OrderRedirect;
