import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((ele) => ele._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((ele) =>
          ele._id === existItem._id ? item : ele
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    // addToCart: (state, action) => {
    //   const item = action.payload;

    //   const existItem = state.cartItems.find((ele) => ele.id === item.id);
    //   if (existItem) {
    //     state.cartItems = state.cartItems.map((ele) =>
    //       ele.id === existItem.id ? item : ele
    //     );
    //   } else {
    //     state.cartItems = [...state.cartItems, item];
    //   }
    //   return updateCart(state);
    // },
    calculateProductsPrice: (state, action) => {
      const productsList = action.payload;
      state.cartItems = state.cartItems.map((ele) => {
        const product = productsList.find((p) => p.id === ele._id);
        return { ...ele, ...product };
      });
      updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (ele) => ele._id !== action.payload
      );
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
