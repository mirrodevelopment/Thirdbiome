import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnnouncementBar } from "./AnnouncementBar";
import { Nav } from "./Nav";
import { MobileMenu } from "./MobileMenu";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Toast } from "./Toast";
import { useReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useReveal();
  useParallax();

  // close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  // scroll to top on route change (or to the hash target if present)
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <AnnouncementBar />
      <Nav onBurger={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Outlet />
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
