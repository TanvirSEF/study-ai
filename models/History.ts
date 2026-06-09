import mongoose, { Schema, model, models } from "mongoose";

const HistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    toolType: {
      type: String,
      enum: ["grammar", "math", "summary", "chat"],
      required: true,
    },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

export const History = models.History || model("History", HistorySchema);
export default History;
