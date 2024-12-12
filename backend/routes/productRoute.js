import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModal.js";
import mongoose from "mongoose";
const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get(
  "/api/products",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

// @desc Fetch a single product
// @route GET /api/product/:id
// @access Public
router.get(
  "/api/product/:id",
  asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({ error: "Invalid product ID" });
    }
    const theProduct = await Product.findById(productId);
    if (theProduct) {
      return res.json(theProduct);
    } else {
      return res.status(404).send({ error: "The product is not found" });
    }
  })
);

export default router;
