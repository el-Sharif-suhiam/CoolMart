import productRoute from "./productRoute.js";
import express from "express";

const routes = express.Router();

routes.use(productRoute);

export default routes;
