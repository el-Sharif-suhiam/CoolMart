import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModal.js";
import mongoose from "mongoose";
import { userAuth, adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get(
  "/api/products",
  asyncHandler(async (req, res) => {
    const productsInPage = Number(req.query.limit) || 2;
    const pageNumber = Number(req.query.page) || 1;
    const totalProducts = await Product.countDocuments();
    console.log(req.query);
    const pagesTotalNum = Math.ceil(totalProducts / productsInPage);

    if (pagesTotalNum < pageNumber) {
      res.status(404);
      throw new Error("Page not found");
    } else {
      const products = await Product.find({})
        .limit(productsInPage)
        .skip(productsInPage * (pageNumber - 1));
      return res.json({
        products,
        pageNumber,
        pagesTotalNum: Math.ceil(totalProducts / productsInPage),
      });
    }
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

// @desc Create a new product
// @route POST /api/products
// @access Private/Admin

router.post(
  "/api/products",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const product = new Product({
      name: "Sample name",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "Sample brand",
      category: "Sample category",
      countInStock: 0,
      numReviews: 0,

      description: "Sample description",
    });
    const createProduct = await product.save();
    res.status(201).json(createProduct);
  })
);

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
router.put(
  "/api/products/:id",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } =
      req.body;
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin

router.delete(
  "/api/products/:id",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// @desc Create a new review
// @route POST /api/products/:id/reviews
// @access Private

router.post(
  "/api/products/:id/reviews",
  userAuth,
  asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (product) {
      const oldReview = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (oldReview) {
        res.status(404);
        throw new Error("you already reviewed this product");
      } else {
        const review = {
          user: req.user._id,
          name: req.user.name,
          rating: Number(rating),
          comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length;

        await product.save();
        res.status(201).send({ message: "The review has been added!" });
      }
    } else {
      res.status(404);
      throw new Error("resource not found");
    }
  })
);
export default router;
