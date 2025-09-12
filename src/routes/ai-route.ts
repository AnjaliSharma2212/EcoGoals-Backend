// import express, { Request, Response } from "express";
// import OpenAI from "openai";

// const router = express.Router();

// // ✅ Test route
// router.get("/", (req: Request, res: Response) => {
//   res.send("🤖 AI route is live!");
// });

// // ✅ Motivation route
// router.post("/motivation", async (req: Request, res: Response) => {
//   try {
//     const { habits } = req.body;

//     if (!process.env.OPENAI_API_KEY) {
//       return res
//         .status(500)
//         .json({ error: "❌ Missing OpenAI API Key in environment variables." });
//     }

//     if (!habits || !Array.isArray(habits) || habits.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Please provide habits in an array." });
//     }

//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // modern lightweight model
//       messages: [
//         { role: "system", content: "You are a fun motivational eco-coach." },
//         {
//           role: "user",
//           content: `Give me a short motivational message for these eco-habits: ${habits.join(
//             ", "
//           )}`,
//         },
//       ],
//       max_tokens: 80,
//     });

//     const message =
//       completion.choices[0].message?.content ||
//       "🌱 Keep going, small steps build great habits!";

//     res.json({ message });
//   } catch (err: any) {
//     console.error("🔥 AI Route Error:", err);
//     res.status(500).json({ error: err.message || "AI route failed." });
//   }
// });

// export default router;

import express, { Request, Response } from "express";
import OpenAI from "openai";

const router = express.Router();

// ✅ Test route
router.get("/", (req: Request, res: Response) => {
  res.send("🤖 AI route is live!");
});

// ✅ Motivation route
router.post("/motivation", async (req: Request, res: Response) => {
  try {
    const { habits } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("❌ OPENAI_API_KEY is missing in environment variables!");
    }

    // Validate request
    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide habits as a non-empty array." });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ use GPT-3.5 for free tier
      messages: [
        { role: "system", content: "You are a motivational eco-coach." },
        {
          role: "user",
          content: `Give me a short fun motivational message for these habits: ${habits.join(
            ", "
          )}. Keep it under 50 words.`,
        },
      ],
      max_tokens: 100,
    });

    const message =
      completion.choices[0].message?.content ||
      "Keep going, you’re doing amazing! 🌱";

    res.json({ message });
  } catch (err: any) {
    console.error("🔥 AI Route Error:", err.message);

    // 👇 Fallback message if quota is exceeded
    res.json({
      message: `You're doing great with your habits! 💪 Keep up with ${req.body.habits.join(
        ", "
      )}, and stay consistent 🌱`,
      source: "fallback",
    });
  }
});

export default router;
