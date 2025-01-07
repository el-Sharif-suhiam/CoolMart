import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
//import "./styles/bootstrap.custom.css";
import App from "./App.jsx";
import UserOnlyRoute from "./components/utils/UserOnlyRoute.jsx";
import AdminOnlyRoute from "./components/utils/AdminOnlyRoute.jsx";
import { HelmetProvider } from "react-helmet-async";
import {
  Home,
  ProductDetail,
  Payment,
  Profile,
  PlaceOrder,
  Register,
  Shipping,
  OrderScreen,
  Cart,
  Login,
} from "./screens";
import {
  OrdersList,
  ProductsList,
  UsersList,
  ProductEdit,
  UserEdit,
} from "./screens/admin";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="" element={<UserOnlyRoute />}>
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="" element={<AdminOnlyRoute />}>
        <Route path="/admin/orderslist" element={<OrdersList />} />
        <Route path="/admin/productslist" element={<ProductsList />} />
        <Route path="/admin/userslist" element={<UsersList />} />
        <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
        <Route path="/admin/user/:id/edit" element={<UserEdit />} />
      </Route>
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
