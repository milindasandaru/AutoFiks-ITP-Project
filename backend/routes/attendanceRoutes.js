import express from "express";
import { 
  markAttendance,
  getEmployeeAttendance,
  getAllAttendance
} from "../controllers/attendanceController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public route for QR scanner (no token needed for admin)
router.post("/mark", markAttendance);

// Add routes for clock-in/clock-out to match your frontend
router.post("/clock-in", markAttendance);
router.post("/clock-out", markAttendance);

// Get all attendance records (admin)
router.get("/all", getAllAttendance);

// Get attendance for specific employee
router.get("/employee/:id", getEmployeeAttendance);

export default router;
