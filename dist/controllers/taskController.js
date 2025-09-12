"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = getTasks;
exports.addTask = addTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const Task_1 = __importDefault(require("../models/Task"));
// GET all tasks
async function getTasks(req, res) {
    try {
        const tasks = await Task_1.default.find().sort({ status: 1, order: 1 });
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// CREATE new task
async function addTask(req, res) {
    try {
        const { title, description = "", status = "todo" } = req.body;
        if (!title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }
        const count = await Task_1.default.countDocuments({ status });
        const newTask = new Task_1.default({
            title,
            description,
            status,
            order: count,
        });
        await newTask.save();
        res.status(201).json(newTask);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// UPDATE task (move or edit)
async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const task = await Task_1.default.findById(id);
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        // Handle reordering when moving to a new status
        if (updates.status && updates.status !== task.status) {
            // Shift old column
            await Task_1.default.updateMany({ status: task.status, order: { $gt: task.order } }, { $inc: { order: -1 } });
            // Shift new column
            if (updates.order !== undefined) {
                await Task_1.default.updateMany({ status: updates.status, order: { $gte: updates.order } }, { $inc: { order: 1 } });
            }
        }
        Object.assign(task, updates);
        await task.save();
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// DELETE task
async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const task = await Task_1.default.findById(id);
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        // Adjust order in column
        await Task_1.default.updateMany({ status: task.status, order: { $gt: task.order } }, { $inc: { order: -1 } });
        await task.deleteOne();
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
