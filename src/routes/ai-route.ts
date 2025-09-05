import express from "express";
import { OpenAI } from "openai";

const router = express.Router();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing from environment variables!");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // fallback to avoid crash
});

router.post("/motivation", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key is not set" });
    }

    const { habits } = req.body;
    const completed = habits.reduce(
      (sum: number, h: any) => sum + h.completedDates.length,
      0
    );

    const prompt = `The user has completed ${completed} habits in total. 
    Write a short, fun, motivational message (with emojis, casual tone).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const message =
      response.choices[0]?.message?.content || "Keep going, champ! 🚀🔥";

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
