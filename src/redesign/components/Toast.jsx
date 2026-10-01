import { useCart } from "../cart/CartContext";

export function Toast() {
  const { toastMsg, toastVisible } = useCart();
  return (
    <div className={`toast${toastVisible ? " show" : ""}`}>
      <span className="g">✓</span> <span>{toastMsg}</span>
    </div>
  );
}
