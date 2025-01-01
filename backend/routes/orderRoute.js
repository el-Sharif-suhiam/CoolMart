import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import { userAuth, adminAuth } from "../middleware/authMiddleware.js";

const router = Router();

// ============================================================================
// Admin Routes
// ============================================================================

// @desc Fetch all orders
// @route GET /api/orders
// @access Private/Admin
router.get(
  "/api/orders",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  })
);

// @desc Update order to delivered
// @route PATCH /api/orders/:id/deliver
// @access Private/Admin
router.patch(
  "/api/orders/:id/deliver",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

// ============================================================================
// User Routes
// ============================================================================

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
router.get(
  "/api/orders/myorders",
  userAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  })
);

// @desc Create a new order
// @route POST /api/orders
// @access Private
router.post(
  "/api/orders",
  userAuth,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("no order items");
    } else {
      const order = new Order({
        orderItems: orderItems.map((order) => ({
          ...order,
          product: order._id,
          _id: undefined,
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

// @desc Fetch a single order
// @route GET /api/order/:id
// @access Private
router.get(
  "/api/orders/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

// @desc Update order to paid
// @route PATCH /api/orders/:id/pay
// @access Private
router.patch(
  "/api/orders/:id/pay",
  userAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

export default router;
