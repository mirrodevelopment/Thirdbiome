import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/Store";
import { CartProvider } from "./v5/cart/CartProvider";
import App from "./App.jsx";

// v5 "Corelab" design system (single stylesheet, ported from the handoff)
import "./v5/styles/v5.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
