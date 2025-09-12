"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const habitController_1 = require("../controllers/habitController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const habitRoutes = express_1.default.Router();
habitRoutes
    .route("/")
    .get(authMiddleware_1.protect, habitController_1.getHabits) // GET /api/habits
    .post(authMiddleware_1.protect, habitController_1.addHabit); // POST /api/habits
habitRoutes
    .route("/:id")
    .get(authMiddleware_1.protect, habitController_1.getHabitById)
    .put(authMiddleware_1.protect, habitController_1.updateHabit) // PUT /api/habits/:id
    .delete(authMiddleware_1.protect, habitController_1.deleteHabit); // DELETE /api/habits/:id
habitRoutes.route("/:id/complete").post(authMiddleware_1.protect, habitController_1.markHabitComplete);
exports.default = habitRoutes;
