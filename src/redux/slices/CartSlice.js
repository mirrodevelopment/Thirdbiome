import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    addToCart: (state, action) => {
      const {
        id,
        variantId,
        quantity,
        selectedPlan,
        name,
        price,
        image,
        productId,
      } = action.payload;
      const existingItem = state.cart.find(
        (item) => item.id === id || (item.variantId === variantId && !id)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          id,
          variantId,
          productId,
          quantity,
          selectedPlan,
          name,
          price,
          image,
        });
      }
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => item.id !== id);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
