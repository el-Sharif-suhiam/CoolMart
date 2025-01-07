import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/api/orders",
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: "PATCH",
      }),
    }),
    getStripeClientId: builder.mutation({
      query: ({ cartItems }) => ({
        url: "/create-checkout-session",
        method: "POST",
        body: cartItems,
      }),
    }),
    getPaymentStatus: builder.mutation({
      query: ({ sessionId }) => ({
        url: `/session-status?session_id=${sessionId}`,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/api/orders/myorders",
      }),
      keepUnusedDataFor: 5,
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "/api/orders",
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/deliver`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useDeliverOrderMutation,
  useGetStripeUrlMutation,
  useGetStripeClientIdMutation,
  useGetPaymentStatusMutation,
} = orderApiSlice;
