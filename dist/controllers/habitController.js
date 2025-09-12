"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markHabitComplete = exports.deleteHabit = exports.getHabitById = exports.updateHabit = exports.addHabit = exports.getHabits = void 0;
const Habit_1 = __importDefault(require("../models/Habit"));
const awaredBadge_1 = require("../utils/awaredBadge");
// @desc    Get all habits of logged-in user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
    const habits = await Habit_1.default.find({ user: req.user?._id }).sort({
        createdAt: -1,
    });
    res.json(habits);
};
exports.getHabits = getHabits;
// @desc    Add new habit
// @route   POST /api/habits
// @access  Private
const addHabit = async (req, res) => {
    const { name, description, color } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Habit name is required" });
    }
    const habit = await Habit_1.default.create({
        user: req.user?._id,
        name,
        description,
        color,
        completedDates: [], // ✅ ensure it's never undefined
        streak: 0,
    });
    res.status(201).json(habit);
};
exports.addHabit = addHabit;
// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
    const habit = await Habit_1.default.findById(req.params.id);
    if (!habit)
        return res.status(404).json({ message: "Habit not found" });
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
exports.updateHabit = updateHabit;
const getHabitById = async (req, res) => {
    const habit = await Habit_1.default.findById(req.params.id);
    if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
    }
    if (habit.user.toString() !== req.user?._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }
    res.json(habit);
};
exports.getHabitById = getHabitById;
// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
    const habit = await Habit_1.default.findById(req.params.id);
    if (!habit)
        return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user?._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }
    await habit.deleteOne();
    res.json({ message: "Habit removed" });
};
exports.deleteHabit = deleteHabit;
// @desc    Mark habit as completed today
// @route   POST /api/habits/:id/complete
// @access  Private
const markHabitComplete = async (req, res) => {
    const habit = await Habit_1.default.findById(req.params.id);
    if (!habit)
        return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user?._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const today = new Date().toDateString();
    // Check if today is already completed
    const doneToday = habit.completedDates.some((d) => new Date(d).toDateString() === today);
    let newBadges = [];
    if (!doneToday) {
        habit.completedDates.push(new Date());
        habit.streak = habit.streak + 1; // increase streak
        // 🏅 Award **streak milestone badge**
        const streakBadge = (0, awaredBadge_1.checkAndAwardBadge)(habit);
        if (streakBadge)
            newBadges.push(streakBadge);
        // 🎖 Award **level badge (Bronze/Silver/Gold)**
        const levelBadge = (0, awaredBadge_1.checkAndAwardLevel)(habit);
        if (levelBadge)
            newBadges.push(levelBadge);
        await habit.save();
    }
    res.json({
        habit,
        newBadges: newBadges.length > 0 ? newBadges : undefined, // return only if any new badge awarded
    });
};
exports.markHabitComplete = markHabitComplete;
