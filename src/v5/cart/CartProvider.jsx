/* Third Biome v5, cart context.
   Thin UI layer over the client's service layer (src/services/cartService.js),
   which talks to the Laravel API with a guest session id and self-syncs the
   Redux CartSlice, so Checkout & order flows keep working unchanged. */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getCart,
  addToCart as apiAdd,
  updateCartItemQuantity as apiSetQty,
  removeFromCart as apiRemove,
} from "../../services/cartService";
import { LIVE_PRODUCT_ID, LIVE_VARIANT_NAME } from "../data/content";
import { track, PIXEL_PRODUCT } from "../lib/analytics";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const items = useSelector((s) => s.cart.cart) || [];
  const loading = useSelector((s) => s.cart.loading);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const toastT = useRef(null);

  useEffect(() => {
    // hydrate the server cart on first mount (no-op for brand-new sessions)
    if (localStorage.getItem("sessionId") || localStorage.getItem("token")) {
      getCart().catch(() => {});
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const say = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(""), 1800);
  }, []);

  /* add the live purchasable variant (plan = UI label carried for checkout notes) */
  const add = useCallback(async ({ quantity = 1, openDrawer = true } = {}) => {
    setBusy(true);
    try {
      await apiAdd(LIVE_VARIANT_NAME, LIVE_PRODUCT_ID, quantity);
      track("AddToCart", { ...PIXEL_PRODUCT, num_items: quantity });
      say("Added to cart ✓");
      if (openDrawer) setDrawerOpen(true);
    } catch (err) {
      say(err?.message?.includes("stock") ? err.message : "Couldn't reach the store, try again.");
    } finally {
      setBusy(false);
    }
  }, [say]);

  const setQty = useCallback(async (cartItemId, qty) => {
    if (qty < 1) return;
    try { await apiSetQty(cartItemId, qty); } catch { say("Couldn't update quantity."); }
  }, [say]);

  const remove = useCallback(async (cartItemId) => {
    try { await apiRemove(cartItemId); } catch { say("Couldn't remove item."); }
  }, [say]);

  const count = items.reduce((n, it) => n + (it.quantity || 0), 0);
  const subtotal = items.reduce((n, it) => n + (Number(it.price) || 0) * (it.quantity || 0), 0);

  return (
    <CartCtx.Provider value={{
      items, count, subtotal, loading, busy,
      add, setQty, remove,
      drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false),
      toast, say,
    }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
