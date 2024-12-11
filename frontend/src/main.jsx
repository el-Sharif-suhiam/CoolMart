import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import Home from "./sections/Home.jsx";
//import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import "./styles/bootstrap.custom.css";
import App from "./App.jsx";
import ProductDetail from "./sections/ProductDetail.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
