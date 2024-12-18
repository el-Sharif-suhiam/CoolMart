import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

function addDecimals(num) {
  return ((num * 100) / 100).toFixed(2);
}
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

      // calaculate items price
      state.itemPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.itemPrice = addDecimals(state.itemPrice);

      // calaculate shipping price ( above 100 shipping will be 15 else it will be free)
      state.shippingPrice = state.itemPrice > 100 ? 15 : 0;
      state.shippingPrice = addDecimals(state.shippingPrice);
      // calculate tax price (8% tax)
      state.taxPrice = 0.08 * state.itemPrice;
      state.taxPrice = addDecimals(state.taxPrice);
      // total price
      state.totalPrice =
        +state.itemPrice + +state.shippingPrice + +state.taxPrice;
      state.totalPrice = addDecimals(state.totalPrice);

      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (ele) => ele._id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
