"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const habitRoutes_1 = __importDefault(require("./routes/habitRoutes"));
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
const ai_route_1 = __importDefault(require("./routes/ai-route"));
const quotes_1 = __importDefault(require("./routes/quotes"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
dotenv_1.default.config();
// ✅ Log API Key presence
console.log("🔑 OpenAI Key?", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");
// Initialize app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // frontend dev server
    credentials: true,
}));
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Routes
app.get("/", (req, res) => {
    res.send("🌱 Eco Habits API is running...");
});
app.use("/api/users", userRoutes_1.default);
app.use("/api/habits", habitRoutes_1.default);
app.use("/api/progress", progressRoutes_1.default);
app.use("/api/ai", ai_route_1.default);
app.use("/api/quotes", quotes_1.default);
app.use("/api/tasks", taskRoute_1.default);
// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
