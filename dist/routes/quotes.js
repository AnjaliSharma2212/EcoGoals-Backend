"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
// ✅ Test route
router.get("/", (req, res) => {
    res.send("📖 Quotes route is live!");
});
// ✅ Daily Quote route
router.get("/daily", async (req, res) => {
    try {
        // Fetch from quotable API
        const response = await axios_1.default.get("https://api.quotable.io/random", {
            timeout: 5000, // prevent hanging
        });
        const quoteData = response.data;
        res.json({
            content: quoteData.content,
            author: quoteData.author,
        });
    }
    catch (err) {
        console.error("🔥 Quote API Error:", err.message);
        // Fallback if API is down
        res.json({
            content: "Your habits shape your future. Stay consistent! 💪",
            author: "Eco Habits",
        });
    }
});
exports.default = router;
