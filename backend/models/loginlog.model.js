import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "role",
    required: true,
  },
  role: {
    type: String,
    enum: ["User", "Employee"],
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  location: String,
  isAnomalous: Boolean,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const LoginLog = mongoose.model("LoginLog", loginLogSchema);
