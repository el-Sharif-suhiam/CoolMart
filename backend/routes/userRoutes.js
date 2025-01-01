import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { adminAuth, userAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

/**************************************************
 *                 AUTH ROUTES                   *
 **************************************************/

// @desc Auth user & get token
// @route POST /api/user/login
// @access Public

router.post(
  "/api/user/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

// @desc Register user
// @route POST /api/user
// @access Public
router.post(
  "/api/user/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) {
      const user = await User.create({ name, email, password });
      if (user) {
        generateToken(res, user._id);
        return res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(400).send({ error: "invaild user data" });
      }
    } else {
      res.status(400);
      throw new Error("user already exist");
    }
  })
);

// @desc Logout user / Clear cookie
// @route POST /api/user/logout
// @access Private
router.post(
  "/api/user/logout",
  asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.send({ message: "you have logout successfully" });
  })
);

/**************************************************
 *              USER PROFILE ROUTES              *
 **************************************************/

// @desc Get user profile
// @route GET /api/user/profile
// @access Private
router.get(
  "/api/user/profile",
  userAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).send({ error: "user not found" });
    }
  })
);

// @desc Update user profile
// @route PUT /api/user/profile
// @access Private
router.put(
  "/api/user/profile",
  userAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).send({ error: "user not found" });
    }
  })
);

/**************************************************
 *              ADMIN USER ROUTES                *
 **************************************************/

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
router.get(
  "/api/users",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

// @desc Get user by ID
// @route GET /api/user/:id
// @access Private/Admin
router.get(
  "/api/user/:id",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// @desc Delete user
// @route DELETE /api/user/:id
// @access Private/Admin
router.delete(
  "/api/user/:id",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (!user.isAdmin) {
        await User.deleteOne({ _id: user._id });
        res.send({ message: "User removed" });
      } else {
        res.status(400);
        throw new Error("Cannot delete admin user");
      }
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// @desc Update user
// @route PUT /api/user/:id
// @access Private/Admin
router.put(
  "/api/user/:id",
  userAuth,
  adminAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

export default router;
