import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import Home from "./screens/Home.jsx";
//import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import "./styles/bootstrap.custom.css";
import App from "./App.jsx";
import ProductDetail from "./screens/ProductDetail.jsx";
import Cart from "./screens/Cart.jsx";
import Login from "./screens/Login.jsx";
import Register from "./screens/Register.jsx";
import Shipping from "./screens/Shipping.jsx";
import UserOnlyRoute from "./components/UserOnlyRoute.jsx";
import Payment from "./screens/Payment.jsx";
import PlaceOrder from "./screens/PlaceOrder.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
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
      </Route>
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
