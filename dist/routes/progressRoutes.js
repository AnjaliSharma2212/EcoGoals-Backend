"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const progressController_1 = require("../controllers/progressController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const progressRouter = express_1.default.Router();
// GET /api/progress
progressRouter.get("/", authMiddleware_1.protect, progressController_1.getUserProgress);
exports.default = progressRouter;
