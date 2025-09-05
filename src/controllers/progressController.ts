import { Response } from "express";
import Habit from "../models/Habit";
import { AuthRequest } from "../middleware/authMiddleware";

export const getUserProgress = async (req: AuthRequest, res: Response) => {
  const habits = await Habit.find({ user: req.user?._id });

  if (!habits || habits.length === 0) {
    return res.json({
      totalHabits: 0,
      totalCompleted: 0,
      longestStreak: 0,
      highestLevel: "None",
      currentLevel: 1,
      xp: 0,
      badgesEarned: [],
      streakHistory: [],
    });
  }

  // ✅ Aggregate totals
  const totalHabits = habits.length;
  const totalCompleted = habits.reduce(
    (acc, h) => acc + h.completedDates.length,
    0
  );
  const longestStreak = Math.max(...habits.map((h) => h.streak), 0);
  // ✅ XP + Level system
  const xpPerHabit = 10;
  const xp = (totalCompleted * xpPerHabit) % 100; // XP toward next level
  let currentLevel = Math.floor((totalCompleted * xpPerHabit) / 100) + 1;

  // ✅ Highest level
  const levels = ["None", "Bronze", "Silver", "Gold"];
  let highestLevel: "None" | "Bronze" | "Silver" | "Gold" = "None";

  for (const h of habits) {
    if (levels.indexOf(h.level) > levels.indexOf(highestLevel)) {
      highestLevel = h.level;
    }
  }

  // ✅ Collect all badges
  const badgesEarned = habits.flatMap((h) => h.badges);

  // ✅ Build streak history for chart
  // Merge completedDates across all habits into one timeline
  const streakHistory: { date: string; streak: number }[] = [];
  let streakCounter = 0;

  // Flatten all completed dates
  const allDates = habits.flatMap((h) =>
    h.completedDates.map((d) => new Date(d))
  );

  // Sort ascending
  allDates.sort((a, b) => a.getTime() - b.getTime());

  let prevDate: Date | null = null;
  for (const d of allDates) {
    const day = d.toDateString();

    if (!prevDate) {
      streakCounter = 1;
    } else {
      const diff =
        (new Date(day).getTime() -
          new Date(prevDate.toDateString()).getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streakCounter += 1; // continued streak
      } else if (diff > 1) {
        streakCounter = 1; // reset streak
      }
    }

    streakHistory.push({
      date: day,
      streak: streakCounter,
    });

    prevDate = d;
  }

  res.json({
    totalHabits,
    totalCompleted,
    longestStreak,
    currentLevel,
    xp,
    highestLevel,
    badgesEarned,
    streakHistory,
  });
};
