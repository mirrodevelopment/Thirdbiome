import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AnnouncementBar from "./AnnouncementBar";
import Nav from "./Nav";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import Popup from "./Popup";
import { useCart } from "../cart/CartProvider";
import { useReveal } from "./ui";

export default function Layout() {
  const { pathname, hash } = useLocation();
  const { toast } = useCart();
  useReveal(pathname);

  /* scroll to top on route change; honour in-page hashes */
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <AnnouncementBar />
      <div className="app">
        <div className="stack">
          <Nav />
          <Outlet />
          <Footer />
        </div>
        <CartDrawer />
        <Popup />
        <div className={`toast${toast ? " on" : ""}`}>{toast || "Added to cart ✓"}</div>
        {/* production services report errors via react-toastify (v11 injects its own styles) */}
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored" />
      </div>
    </>
  );
}
