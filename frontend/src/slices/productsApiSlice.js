import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/api/products?page=${page}&limit=${limit}&search=${search}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductDetails: builder.query({
      query: (id) => ({
        url: `/api/product/${id}`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductsListByIds: builder.query({
      query: ({ ids }) => ({
        url: `/api/products`,
        method: "POST",
        body: ids,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 10,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: "/api/products",
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (product) => ({
        url: `/api/products/${product._id}`,
        method: "PUT",
        body: { ...product },
      }),
      invalidatesTags: ["Product"],
    }),
    uploadImage: builder.mutation({
      query: (data) => ({
        url: "/api/upload",
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    addReview: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: "/api/products/top",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
  useDeleteProductMutation,
  useAddReviewMutation,
  useGetTopProductsQuery,
  useGetProductsListByIdsQuery,
} = productApiSlice;
