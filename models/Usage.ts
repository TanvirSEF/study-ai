import mongoose, { Schema, model, models } from "mongoose";

const UsageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    totalRequests: { type: Number, default: 0 },
    todayRequests: { type: Number, default: 0 },
    lastRequestDate: { type: String, required: true }, // Format YYYY-MM-DD
  },
  { timestamps: true }
);

export const Usage = models.Usage || model("Usage", UsageSchema);
export default Usage;
