import express from "express";
import {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
} from "../controllers/habitController";
import { protect } from "../middleware/authMiddleware";

const habitRoutes = express.Router();

habitRoutes
  .route("/")
  .get(protect, getHabits) // GET /api/habits
  .post(protect, addHabit); // POST /api/habits

habitRoutes
  .route("/:id")
  .put(protect, updateHabit) // PUT /api/habits/:id
  .delete(protect, deleteHabit); // DELETE /api/habits/:id

export default habitRoutes;
