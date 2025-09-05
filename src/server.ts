import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import habitRoutes from "./routes/habitRoutes";
import progressRouter from "./routes/progressRoutes";
import aiRoutes from "./routes/ai-route";
// Load environment variables
dotenv.config();
console.log(
  "🔑 OpenAI API Key loaded?",
  process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No"
);

// Initialize app
const app: Application = express();

// Middleware
app.use(express.json());

app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("🌱 Eco Habits API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/progress", progressRouter);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/ai", aiRoutes);
// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
});
