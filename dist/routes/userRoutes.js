"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userRoutes = express_1.default.Router();
// Register
userRoutes.post("/", userController_1.registerUser);
// Login
userRoutes.post("/login", userController_1.loginUser);
// Profile (protected)
userRoutes.get("/profile", authMiddleware_1.protect, userController_1.getProfile);
userRoutes.put("/profile", authMiddleware_1.protect, userController_1.updateProfile);
exports.default = userRoutes;
