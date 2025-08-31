import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const userRoutes = express.Router();

// Register
userRoutes.post("/", registerUser);

// Login
userRoutes.post("/login", loginUser);

// Profile (protected)
userRoutes.get("/profile", protect, getProfile);

export default userRoutes;
