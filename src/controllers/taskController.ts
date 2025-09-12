import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";

// GET all tasks
export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const tasks: ITask[] = await Task.find().sort({ status: 1, order: 1 });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// CREATE new task
export async function addTask(req: Request, res: Response): Promise<void> {
  try {
    const { title, description = "", status = "todo" } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const count = await Task.countDocuments({ status });
    const newTask = new Task({
      title,
      description,
      status,
      order: count,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE task (move or edit)
export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Handle reordering when moving to a new status
    if (updates.status && updates.status !== task.status) {
      // Shift old column
      await Task.updateMany(
        { status: task.status, order: { $gt: task.order } },
        { $inc: { order: -1 } }
      );

      // Shift new column
      if (updates.order !== undefined) {
        await Task.updateMany(
          { status: updates.status, order: { $gte: updates.order } },
          { $inc: { order: 1 } }
        );
      }
    }

    Object.assign(task, updates);
    await task.save();

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE task
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Adjust order in column
    await Task.updateMany(
      { status: task.status, order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    await task.deleteOne();
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
