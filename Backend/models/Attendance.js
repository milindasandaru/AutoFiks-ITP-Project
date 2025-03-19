import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  clockIn: { type: Date },
  clockOut: { type: Date },
});

export default mongoose.model("Attendance", attendanceSchema);