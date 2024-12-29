import jwt from "jsonwebtoken";

export default function generateToken(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "dev",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
  });
}
