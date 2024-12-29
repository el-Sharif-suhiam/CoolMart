import productRoute from "./productRoute.js";
import userRoutes from "./userRoutes.js";
import orderRoute from "./orderRoute.js";
import express from "express";

const routes = express.Router();

routes.use(productRoute);
routes.use(userRoutes);
routes.use(orderRoute);

export default routes;
