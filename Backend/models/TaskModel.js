/*import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },

    description: {
      type: String,
      default: "Description",
    },

    dueDate: {
      type: Date,
      default: () => Date.now(),
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    vehicleType: {
      type: String,
      required: true,
    },

    numberPlate: {
      type: String,
      required: true,
      unique: true,
    },

    serviceType: {
      type: String,
      required: true,
    },

    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "Employee",
    },

    estimatedCompletionTime: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", TaskSchema);
export default TaskModel;
*/

import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },

    description: {
      type: String,
      default: "Description",
    },

    dueDate: {
      type: Date,
      default: () => Date.now(),
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    vehicleType: {
      type: String,
      required: true,
    },

    numberPlate: {
      type: String,
      required: true,
      unique: true,
    },

    serviceType: {
      type: String,
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "Employee",
    },

    estimatedCompletionTime: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", TaskSchema);
export default TaskModel;
