// controllers/employeeDashboardController.js
import { Employee } from "../models/Employee.js";
import Task from "../models/TaskModel.js";
import Attendance from "../models/Attendance.js";
import LeaveRequest from "../models/LeaveRequest.js";
import HelpRequest from "../models/HelpRequestModel.js";

// Get employee dashboard data
export const getEmployeeDashboard = async (req, res) => {
  try {
    // Get employee ID from authentication middleware
    const employeeId = req.userID;
    
    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    // Get employee profile
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    // Get current date and month boundaries
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get today's attendance
    const todayAttendance = await Attendance.findOne({
      employeeId: employee._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    // Get month attendance
    const monthAttendance = await Attendance.find({
      employeeId: employee._id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ createdAt: -1 });
    
    // Get tasks assigned to employee
    const tasks = await Task.find({
      employeeId: employee._id
    }).sort({ updatedAt: -1 });
    
    // Get leave requests
    const leaveRequests = await LeaveRequest.find({
      employeeId: employee._id
    }).sort({ createdAt: -1 });
    
    // Get help requests
    const helpRequests = await HelpRequest.find({
      employeeId: employee._id
    }).sort({ createdAt: -1 });
    
    // Calculate leave statistics
    const leaveStats = {
      annual: { total: 14, used: 0, remaining: 14 },
      sick: { total: 7, used: 0, remaining: 7 },
      casual: { total: 5, used: 0, remaining: 5 },
      other: { total: 2, used: 0, remaining: 2 }
    };
    
    // Calculate used leave days
    leaveRequests.forEach(leave => {
      if (leave.status === 'approved' && leaveStats[leave.leaveType]) {
        leaveStats[leave.leaveType].used += leave.totalDays;
        leaveStats[leave.leaveType].remaining = 
          Math.max(0, leaveStats[leave.leaveType].total - leaveStats[leave.leaveType].used);
      }
    });
    
    // Return dashboard data
    res.status(200).json({
      success: true,
      data: {
        employee,
        todayAttendance,
        monthAttendance,
        tasks,
        leaveRequests,
        helpRequests,
        leaveStats
      }
    });
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

export const generateDemoData = async (req, res) => {
  try {
    // Get employee ID from authentication middleware
    const employeeId = req.userID;
    
    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    // Get employee profile
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    // Generate mock data
    await generateMockData(employee._id);
    
    res.status(200).json({
      success: true,
      message: "Demo data generated successfully"
    });
    
  } catch (error) {
    console.error("Error generating demo data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate demo data",
      error: error.message
    });
  }
};

// Helper function to generate mock data for demonstration
async function generateMockData(employeeId) {
  // Clear existing data for this employee
  await Task.deleteMany({ employeeId });
  await Attendance.deleteMany({ employeeId });
  await LeaveRequest.deleteMany({ employeeId });
  await HelpRequest.deleteMany({ employeeId });
  
  // Generate tasks
  const taskStatuses = ['pending', 'in progress', 'completed', 'on hold'];
  const taskPriorities = ['low', 'medium', 'high', 'urgent'];
  const serviceTypes = ['maintenance', 'repair', 'inspection', 'other'];
  
  for (let i = 0; i < 10; i++) {
    const task = new Task({
      title: `Task ${i+1}: ${['Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Diagnostics', 'Transmission Service'][Math.floor(Math.random() * 5)]}`,
      description: `This is a sample task description for task ${i+1}. It contains details about what needs to be done.`,
      employeeId,
      status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)],
      priority: taskPriorities[Math.floor(Math.random() * taskPriorities.length)],
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      customerName: `Customer ${i+1}`,
      customerPhone: `+94 7${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      vehicleInfo: {
        make: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi'][Math.floor(Math.random() * 5)],
        model: ['Corolla', 'Civic', 'Sunny', 'Swift', 'Lancer'][Math.floor(Math.random() * 5)],
        year: (2010 + Math.floor(Math.random() * 13)).toString(),
        licensePlate: `ABC-${Math.floor(Math.random() * 10000)}`
      },
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 86400000),
      notes: [{
        text: "Initial task assignment",
        createdBy: "Admin",
        createdAt: new Date()
      }]
    });
    
    await task.save();
  }
  
  // Generate attendance records for the last 30 days
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const recordDate = new Date();
    recordDate.setDate(today.getDate() - i);
    
    // Skip weekends
    if (recordDate.getDay() === 0 || recordDate.getDay() === 6) {
      continue;
    }
    
    // 80% chance of being present
    if (Math.random() < 0.8) {
      const status = Math.random() < 0.7 ? 'present' : 
                     Math.random() < 0.5 ? 'late' : 'half-day';
      
      const checkInHour = status === 'late' ? 9 + Math.floor(Math.random() * 2) : 8;
      const checkInMinute = Math.floor(Math.random() * 60);
      
      const checkInTime = new Date(recordDate);
      checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
      
      const workDuration = status === 'half-day' ? 4 + Math.random() : 8 + Math.random();
      
      const checkOutTime = new Date(checkInTime);
      checkOutTime.setHours(checkOutTime.getHours() + Math.floor(workDuration));
      checkOutTime.setMinutes(checkOutTime.getMinutes() + Math.floor((workDuration % 1) * 60));
      
      const attendance = new Attendance({
        employeeId,
        checkInTime,
        checkOutTime,
        status,
        location: "Main Office",
        createdAt: recordDate,
        updatedAt: recordDate
      });
      
      await attendance.save();
    }
  }
  
  // Generate leave requests
  const leaveTypes = ['annual', 'sick', 'casual', 'other'];
  const leaveStatuses = ['pending', 'approved', 'rejected'];
  
  for (let i = 0; i < 5; i++) {
    const startDate = new Date();
    startDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
    
    const totalDays = 1 + Math.floor(Math.random() * 3);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays - 1);
    
    const leaveRequest = new LeaveRequest({
      employeeId,
      leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
      startDate,
      endDate,
      totalDays,
      reason: `Sample leave request ${i+1} for demonstration purposes.`,
      status: leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)],
      adminRemarks: Math.random() < 0.5 ? "Approved based on leave balance" : ""
    });
    
    await leaveRequest.save();
  }
  
  // Generate help requests
  const helpCategories = ['technical', 'hr', 'operations', 'other'];
  const helpPriorities = ['low', 'medium', 'high'];
  const helpStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  
  for (let i = 0; i < 5; i++) {
    const helpRequest = new HelpRequest({
      title: `Help Request ${i+1}: ${['Computer Issue', 'Leave Question', 'Tool Request', 'Process Guidance', 'Other Inquiry'][Math.floor(Math.random() * 5)]}`,
      description: `This is a sample help request description for request ${i+1}. It describes the issue in detail.`,
      employeeId,
      category: helpCategories[Math.floor(Math.random() * helpCategories.length)],
      priority: helpPriorities[Math.floor(Math.random() * helpPriorities.length)],
      status: helpStatuses[Math.floor(Math.random() * helpStatuses.length)],
      responses: Math.random() < 0.7 ? [{
        text: "We're looking into this issue and will get back to you soon.",
        createdBy: "Support Team",
        isAdmin: true,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000))
      }] : []
    });
    
    await helpRequest.save();
  }
}
