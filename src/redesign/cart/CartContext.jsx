import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

/**
 * Client-side cart mirroring the design prototype's `window.T3B` API.
 * Single source of truth for the nav badge, drawer, and cart page.
 * Persists to localStorage["t3b_cart_v1"].
 * In production this should be backed by the real commerce backend.
 */

const CART_KEY = "t3b_cart_v1";
const FREE_SHIP = 999;

export function inr(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

const CartContext = createContext(null);

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // lock body scroll while the drawer is open
  useEffect(() => {
    document.body.classList.toggle("no-scroll", drawerOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [drawerOpen]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2600);
  }, []);

  const openCart = useCallback(() => setDrawerOpen(true), []);
  const closeCart = useCallback(() => setDrawerOpen(false), []);

  const add = useCallback(
    (item) => {
      setItems((prev) => {
        const ex = prev.find((x) => x.lineId === item.lineId);
        if (ex) {
          return prev.map((x) =>
            x.lineId === item.lineId ? { ...x, qty: x.qty + (item.qty || 1) } : x
          );
        }
        return [
          ...prev,
          {
            lineId: item.lineId,
            id: item.id,
            name: item.name,
            variant: item.variant || "",
            price: item.price,
            qty: item.qty || 1,
            img: item.img || "/assets/biome-balance-lifestyle.jpeg",
          },
        ];
      });
      setDrawerOpen(true);
      showToast(`${item.name} added · ${inr(item.price)}`);
    },
    [showToast]
  );

  const setQty = useCallback((lineId, delta) => {
    setItems((prev) =>
      prev
        .map((x) => (x.lineId === lineId ? { ...x, qty: Math.max(0, x.qty + delta) } : x))
        .filter((x) => x.qty > 0)
    );
  }, []);

  const setQtyAbs = useCallback((lineId, q) => {
    setItems((prev) =>
      prev.map((x) => (x.lineId === lineId ? { ...x, qty: Math.max(1, q) } : x))
    );
  }, []);

  const remove = useCallback((lineId) => {
    setItems((prev) => prev.filter((x) => x.lineId !== lineId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const value = {
    items,
    count,
    subtotal,
    freeShip: FREE_SHIP,
    add,
    setQty,
    setQtyAbs,
    remove,
    clear,
    drawerOpen,
    openCart,
    closeCart,
    toast: showToast,
    toastMsg,
    toastVisible,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
