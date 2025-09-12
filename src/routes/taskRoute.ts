import { Router } from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const taskRouter = Router();

// GET all tasks
taskRouter.get("/", getTasks);

// CREATE new task
taskRouter.post("/", addTask);

// UPDATE task by id
taskRouter.put("/:id", updateTask);

// DELETE task by id
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
