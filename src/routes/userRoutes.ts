import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const userRoutes = express.Router();

// Register
userRoutes.post("/", registerUser);

// Login
userRoutes.post("/login", loginUser);

// Profile (protected)
userRoutes.get("/profile", protect, getProfile);
userRoutes.put("/profile", protect, updateProfile);
export default userRoutes;
