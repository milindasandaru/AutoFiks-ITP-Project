import express from "express";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/mark", async (req, res) => {
    try {
        const { qrCode } = req.body;

        const employee = await Employee.findOne({ qrCode });

        if( !employee ) {
            return res.status(404).json({ message: "Invalid QR Code" });
        }
    
        const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
        
        // Check if attendance record already exists for today
        let attendance = await Attendance.findOne({
          employeeId: employee.employeeId,
          date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59.999Z") },
        });
    
        if (!attendance) {
          // First scan (Clock-In)
          attendance = new Attendance({
            employeeId: employee.employeeId,
            clockIn: new Date(),
          });
        } else if (!attendance.clockOut) {
          // Second scan (Clock-Out)
          attendance.clockOut = new Date();
        } else {
          return res.status(400).json({ message: "Already marked attendance today" });
        }
    
        await attendance.save();
        res.status(200).json({ message: "Attendance recorded", attendance });
      } catch (error) {
        res.status(500).json({ message: "Error marking attendance" });
      }
    });
    
    export default router;