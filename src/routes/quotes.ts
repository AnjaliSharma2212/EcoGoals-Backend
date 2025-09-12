import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

// ✅ Test route
router.get("/", (req: Request, res: Response) => {
  res.send("📖 Quotes route is live!");
});

// ✅ Daily Quote route
router.get("/daily", async (req: Request, res: Response) => {
  try {
    // Fetch from quotable API
    const response = await axios.get("https://api.quotable.io/random", {
      timeout: 5000, // prevent hanging
    });

    const quoteData = response.data;

    res.json({
      content: quoteData.content,
      author: quoteData.author,
    });
  } catch (err: any) {
    console.error("🔥 Quote API Error:", err.message);

    // Fallback if API is down
    res.json({
      content: "Your habits shape your future. Stay consistent! 💪",
      author: "Eco Habits",
    });
  }
});

export default router;
