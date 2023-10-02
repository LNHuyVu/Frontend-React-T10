import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemInCart = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemInCart) {
        itemInCart.quantity++;
        if (itemInCart.quantity > itemInCart.number) {
          itemInCart.quantity = itemInCart.number;
        }
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeToCart: (state, action) => {
      state.cart = [];
    },
    incrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      item.quantity++;
      if (item.quantity > item.number) {
        item.quantity = item.number;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      item.quantity--;
      if (item.quantity === 0) {
        const removeItem = state.cart.filter(
          (item) => item.id !== action.payload
        );
        state.cart = removeItem;
      }
    },
    removeItem: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item.id !== action.payload
      );
      state.cart = removeItem;
    },
  },
});

export const cartReducer = cartSlice.reducer;
export const {
  addToCart,
  removeToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} = cartSlice.actions;
