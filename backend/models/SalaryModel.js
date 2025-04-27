// models/SalaryModel.js
import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    period: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      label: {
        type: String, // e.g., "April 2025", "Custom Period 15-25 April"
        required: true,
      },
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    workingDays: {
      total: Number,
      present: Number,
      halfDay: Number,
      absent: Number,
      late: Number,
      leave: {
        approved: Number,
        sick: Number,
        casual: Number,
        annual: Number,
        other: Number,
      },
    },
    workingHours: {
      total: Number,
      regular: Number,
    },
    calculations: {
      basicPayment: Number,
      deductions: {
        leaves: Number,
        absences: Number,
        tax: Number,
        other: Number,
      },
      netSalary: Number,
    },
    status: {
      type: String,
      enum: ["draft", "finalized", "paid"],
      default: "draft",
    },
    paymentDate: Date,
    notes: String,
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;
