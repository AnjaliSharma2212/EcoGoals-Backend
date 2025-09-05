import express from "express";
import { getUserProgress } from "../controllers/progressController";
import { protect } from "../middleware/authMiddleware";

const progressRouter = express.Router();

// GET /api/progress
progressRouter.get("/", protect, getUserProgress);

export default progressRouter;
