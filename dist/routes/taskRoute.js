"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const taskRouter = (0, express_1.Router)();
// GET all tasks
taskRouter.get("/", taskController_1.getTasks);
// CREATE new task
taskRouter.post("/", taskController_1.addTask);
// UPDATE task by id
taskRouter.put("/:id", taskController_1.updateTask);
// DELETE task by id
taskRouter.delete("/:id", taskController_1.deleteTask);
exports.default = taskRouter;
