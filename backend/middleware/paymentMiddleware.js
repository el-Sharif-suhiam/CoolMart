import Product from "../models/productModal.js";
import asyncHandler from "./asyncHandler.js";
import mongoose from "mongoose";

const getRealData = asyncHandler(async (req, res, next) => {
  const cartItems = req.body;
  try {
    if (!Array.isArray(cartItems)) {
      res.status(400);
      throw new Error({ message: "Invalid cartItems format" });
    }

    const idsArray = cartItems.map(
      (ele) => new mongoose.Types.ObjectId(ele._id)
    );

    const products = await Product.find({ _id: { $in: idsArray } });

    const productWithQuantity = products.map((product) => {
      const productFromCart = cartItems.find(
        (ele) => String(ele._id) === String(product._id)
      );

      const productObject = product.toObject();

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: productObject.name,
          },
          unit_amount: Math.round(productObject.price * 100),
        },
        quantity: productFromCart ? productFromCart.qty : 0,
      };
    });

    req.cartRealItems = productWithQuantity;
    next();
  } catch (error) {
    res.json(error.message);
    console.error("Error checking products:", error);
    res.status(500);
    throw new Error({ message: "Error checking products" });
  }
});

//   // التحقق من صحة JSON
//   try {
//     cartItems = JSON.parse(req.body.cartItems);
//   } catch (err) {
//     res.status(400);
//     return res.json({ message: "Invalid JSON format in cartItems" });
//   }

//   // التحقق من وجود cartItems
//   if (!cartItems || !Array.isArray(cartItems)) {
//     res.status(400);
//     return res.json({ message: "Invalid cartItems format" });
//   }

//   try {
//     const idsArray = cartItems.map(
//       (ele) => new mongoose.Types.ObjectId(ele._id)
//     );

//     const products = await Product.find({ _id: { $in: idsArray } });

//     const productWithQuantity = products.map((product) => {
//       const productFromCart = cartItems.find(
//         (ele) => String(ele._id) === String(product._id)
//       );

//       const productObject = product.toObject();

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: productObject.name,
//           },
//           unit_amount: Math.round(productObject.price * 100),
//         },
//         quantity: productFromCart ? productFromCart.qty : 0,
//       };
//     });

//     req.cartRealItems = productWithQuantity;
//     next();
//   } catch (error) {
//     console.error("Error processing cart items:", error.message);
//     res.status(500);
//     res.json({ message: "Error processing cart items" });
//   }
// });

const calcThePrice = async (req, res, next) => {
  const productWithQuantity = JSON.parse(req.cartRealItems);
  const itemsPrice = productWithQuantity.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  // Calculate the shipping price
  const shippingPrice = itemsPrice > 1000 ? 0 : 10;

  // Calculate the tax price
  const taxPrice = 0.15 * itemsPrice;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  // Calculate the total price
  req.totalPrice = totalPrice.toFixed(2);
  next();
};

export { getRealData, calcThePrice };
