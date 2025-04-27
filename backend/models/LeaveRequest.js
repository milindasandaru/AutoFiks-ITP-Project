import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  leaveType: {
    type: String,
    enum: ["sick", "casual", "annual", "other"],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  adminRemarks: {
    type: String,
    default: ""
  },
  documents: {
    type: String, // URL to uploaded document if any
  }
}, { timestamps: true });

// Validate that end date is after start date
LeaveRequestSchema.pre('validate', function(next) {
  if (this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

const LeaveRequest = mongoose.model("LeaveRequest", LeaveRequestSchema);
export default LeaveRequest;
