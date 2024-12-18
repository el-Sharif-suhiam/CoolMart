import productRoute from "./productRoute.js";
import userRoutes from "./userRoutes.js";
import express from "express";

const routes = express.Router();

routes.use(productRoute);
routes.use(userRoutes);

export default routes;
