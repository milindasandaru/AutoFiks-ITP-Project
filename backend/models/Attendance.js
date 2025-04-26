import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day"],
      default: "present",
    },
    location: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;