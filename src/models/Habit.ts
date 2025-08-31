import mongoose, { Document, Schema, Types } from "mongoose";

export interface IHabit extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  description?: string;
  completedDates: Date[];
  streak: number;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxLength: 80 },
    description: { type: String, trim: true, maxLength: 280 },
    completedDates: [{ type: Date }], // ✅ fixed typo
    streak: { type: Number, default: 0 },
    color: { type: String, default: "#22c55e" }, // Tailwind green-500 default
  },
  { timestamps: true }
);

const Habit = mongoose.model<IHabit>("Habit", habitSchema);
export default Habit;
