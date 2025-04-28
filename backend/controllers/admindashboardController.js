// controllers/dashboardController.js
import { Employee } from "../models/Employee.js";
import LeaveRequest from "../models/LeaveRequest.js";
import SparePart from "../models/sparepart.model.js";
import Booking from "../models/booking.js";
import Attendance from "../models/Attendance.js";
import HelpRequest from "../models/HelpRequestModel.js";
import Salary from "../models/SalaryModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this week's date range
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // End of week (Saturday)

    // Employee stats
    const totalEmployees = await Employee.countDocuments();
    
    // Attendance stats for today
    const todayAttendance = await Attendance.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform attendance data to a more usable format
    const attendanceStats = {
      present: 0,
      absent: 0,
      late: 0,
      "half-day": 0
    };

    todayAttendance.forEach(stat => {
      attendanceStats[stat._id] = stat.count;
    });

    // Calculate absent employees
    attendanceStats.absent = totalEmployees - (attendanceStats.present + attendanceStats.late + attendanceStats["half-day"]);

    // Leave request stats
    const pendingLeaveRequests = await LeaveRequest.countDocuments({ status: "pending" });
    const approvedLeaveRequests = await LeaveRequest.countDocuments({ status: "approved" });
    const recentLeaveRequests = await LeaveRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('employeeId', 'name position')
      .lean();

    // Inventory stats
    const totalParts = await SparePart.countDocuments();
    const lowStockParts = await SparePart.countDocuments({ quantity: { $lt: 10 }, isActive: true });
    const recentParts = await SparePart.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Service bookings stats
    const todayBookings = await Booking.countDocuments({ 
      selectedDateTime: { $gte: today, $lt: tomorrow }
    });
    const pendingBookings = await Booking.countDocuments({ status: "Not Started" });
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Help center stats
    const openHelpRequests = await HelpRequest.countDocuments({ status: "open" });
    
    // Salary stats
    const recentSalaries = await Salary.find()
      .sort({ "period.endDate": -1 })
      .limit(5)
      .populate('employeeId', 'name position')
      .lean();
    
    const draftSalaries = await Salary.countDocuments({ status: "draft" });
    
    // Return all stats
    res.status(200).json({
      success: true,
      data: {
        employees: {
          total: totalEmployees,
          attendance: attendanceStats
        },
        leaves: {
          pending: pendingLeaveRequests,
          approved: approvedLeaveRequests,
          recent: recentLeaveRequests
        },
        inventory: {
          total: totalParts,
          lowStock: lowStockParts,
          recent: recentParts
        },
        services: {
          today: todayBookings,
          pending: pendingBookings,
          recent: recentBookings
        },
        helpCenter: {
          open: openHelpRequests
        },
        salaries: {
          draft: draftSalaries,
          recent: recentSalaries
        }
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};
