// controllers/attendanceController.js
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

// Mark attendance when QR code is scanned
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, location } = req.body;
    
    // Find employee by ID
    let employee;
    
    try {
      // Try finding by MongoDB ObjectId
      employee = await Employee.findById(employeeId);
    } catch (error) {
      // If not a valid ObjectId, try finding by employeeId field
      employee = await Employee.findOne({ employeeId: employeeId });
    }
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found with ID: " + employeeId,
      });
    }
    
    // Check if employee has already checked in today
    // Use local timezone for consistent date boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    
    // Prepare employee details to return to frontend
    const employeeDetails = {
      name: employee.name,
      position: employee.position,
      employeeId: employee.employeeId
    };
    
    // Get current time with precise timestamp
    const currentTime = new Date();
    
    if (!attendance) {
      // First check-in for the day
      attendance = new Attendance({
        employeeId: employee._id,
        checkInTime: currentTime,
        location: location || "Office",
        status: "present", // Initially mark as present
      });
      
      await attendance.save();
      
      return res.status(200).json({
        success: true,
        message: `Check-in successful at ${currentTime.toLocaleTimeString()}`,
        attendance,
        employee: employeeDetails,
        isCheckIn: true
      });
    } else if (!attendance.checkOutTime) {
      // Check-out
      // Ensure check-out time is after check-in time
      if (currentTime <= new Date(attendance.checkInTime)) {
        return res.status(400).json({
          success: false,
          message: "Check-out time cannot be earlier than check-in time",
          employee: employeeDetails
        });
      }
      
      attendance.checkOutTime = currentTime;
      
      // Calculate work duration in hours (more precise calculation)
      const checkInTime = new Date(attendance.checkInTime);
      const checkOutTime = new Date(attendance.checkOutTime);
      const workDurationMs = checkOutTime.getTime() - checkInTime.getTime();
      const workDuration = workDurationMs / (1000 * 60 * 60); // Convert to hours
      
      // Set status based on duration
      if (workDuration >= 8) {
        attendance.status = "present";
      } else if (workDuration >= 4) {
        attendance.status = "half-day";
      } else {
        attendance.status = "late";
      }
      
      await attendance.save();
      
      // Calculate work hours and minutes for display
      const hours = Math.floor(workDuration);
      const minutes = Math.floor((workDuration - hours) * 60);
      
      return res.status(200).json({
        success: true,
        message: `Check-out successful. Total work time: ${hours}h ${minutes}m`,
        attendance,
        employee: employeeDetails,
        isCheckIn: false,
        workDuration: {
          hours,
          minutes,
          total: workDuration,
          milliseconds: workDurationMs // Add raw milliseconds for precise calculations
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "You have already completed your attendance for today",
        employee: employeeDetails
      });
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error: " + error.message,
      error: error.toString()
    });
  }
};

// Get attendance records for a specific employee
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) {
      // Ensure start date begins at start of day in local timezone
      dateFilter.$gte = new Date(startDate);
      dateFilter.$gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      // Ensure end date ends at end of day in local timezone
      dateFilter.$lte = new Date(endDate);
      dateFilter.$lte.setHours(23, 59, 59, 999);
    }

    const query = { employeeId: id };
    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("employeeId", "name position employeeId")
      .sort({ createdAt: -1 });

    if (attendanceRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No attendance records found for the selected date range",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get all attendance records with pagination
export const getAllAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) {
      // Ensure start date begins at start of day in local timezone
      dateFilter.$gte = new Date(startDate);
      dateFilter.$gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      // Ensure end date ends at end of day in local timezone
      dateFilter.$lte = new Date(endDate);
      dateFilter.$lte.setHours(23, 59, 59, 999);
    }

    const query = {};
    if (Object.keys(dateFilter).length > 0) {
      query.createdAt = dateFilter;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('employeeId', 'name position employeeId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error: " + error.message 
    });
  }
};
