"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "User not found in database" });
            }
            req.user = user;
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    res.status(401).json({ message: "Not authorized, no token" });
};
exports.protect = protect;
