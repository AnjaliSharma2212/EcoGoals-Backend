"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
        type: String,
        enum: ["todo", "inprogress", "done"],
        default: "todo",
    },
    order: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Task", taskSchema);
