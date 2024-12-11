import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/product/:id", (req, res) => {
  const theProduct = products.find((product) => product._id === req.params.id);
  if (theProduct) {
    res.json(theProduct);
  } else {
    res.status(404).send({ error: "The product is not found" });
  }
});
app.listen(port, () => {
  console.log(`The server are running in post : ${port}`);
});
