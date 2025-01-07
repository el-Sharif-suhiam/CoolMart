import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import { getRealData, calcThePrice } from "./middleware/paymentMiddleware.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "dev"
        ? process.env.CLIENT_URL
        : process.env.PRODUCTION_URL,
  })
);
app.use(cookieParser());
app.use(routes);

app.post("/create-checkout-session", getRealData, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      ui_mode: "embedded",
      line_items: req.cartRealItems,
      return_url: `${process.env.CLIENT_URL}/placeorder?session_id={CHECKOUT_SESSION_ID}`,
    });
    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

const _dirname = path.resolve();
app.use("/uploads", express.static(path.join(_dirname, "/uploads")));

if (process.env.NODE_ENV === "dev") {
  // set static folder
  app.use(express.static(path.join(_dirname, "/frontend/build")));
  // any route that is not api
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
  });
}
// Global Error Handler Middleware
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(port, () => {
  console.log(`The server are running in post : ${port}`);
});
