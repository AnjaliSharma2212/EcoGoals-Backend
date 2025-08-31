import { Response } from "express";
import Habit from "../models/Habit";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Get all habits of logged-in user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req: AuthRequest, res: Response) => {
  const habits = await Habit.find({ user: req.user?._id }).sort({
    createdAt: -1,
  });
  res.json(habits);
};

// @desc    Add new habit
// @route   POST /api/habits
// @access  Private
export const addHabit = async (req: AuthRequest, res: Response) => {
  const { name, description, color } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Habit name is required" });
  }

  const habit = await Habit.create({
    user: req.user?._id,
    name,
    description,
    color,
  });

  res.status(201).json(habit);
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req: AuthRequest, res: Response) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) return res.status(404).json({ message: "Habit not found" });

  if (habit.user.toString() !== req.user?._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  habit.name = req.body.name ?? habit.name;
  habit.description = req.body.description ?? habit.description;
  habit.color = req.body.color ?? habit.color;
  habit.streak = req.body.streak ?? habit.streak;
  habit.completedDates = req.body.completedDates ?? habit.completedDates;

  await habit.save();
  res.json(habit);
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req: AuthRequest, res: Response) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) return res.status(404).json({ message: "Habit not found" });

  if (habit.user.toString() !== req.user?._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await habit.deleteOne();
  res.json({ message: "Habit removed" });
};
