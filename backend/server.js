import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  // Use a default status code if not provided
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail", // Error for server issues, Fail for client issues
    message: err.message,
    path: req.path,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Show stack trace only in development
  });
});

app.listen(port, () => {
  console.log(`The server are running in post : ${port}`);
});
