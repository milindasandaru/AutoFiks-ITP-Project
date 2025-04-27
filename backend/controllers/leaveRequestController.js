import LeaveRequest from "../models/LeaveRequest.js";
import { Employee } from "../models/Employee.js";

// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    console.log("Leave request body:", req.body);
    const { leaveType, startDate, endDate, reason, documents } = req.body;
    const employeeId = req.userID; // From authentication middleware
    
    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }
    
    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }
    
    // Parse dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    
    // Calculate total days
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((parsedEndDate - parsedStartDate) / oneDay)) + 1;
    
    console.log("Start date:", parsedStartDate);
    console.log("End date:", parsedEndDate);
    console.log("Total days calculated:", diffDays);
    
    // Create new leave request with calculated total days
    const leaveRequest = new LeaveRequest({
      employeeId,
      leaveType,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalDays: diffDays, // Set the calculated value
      reason,
      documents
    });
    
    await leaveRequest.save();
    
    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leaveRequest
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to submit leave request", 
      error: error.message 
    });
  }
};

// Get all leave requests (admin only)
export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate('employeeId', 'name employeeId position mail')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: leaveRequests.length,
      leaveRequests
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leave requests", 
      error: error.message 
    });
  }
};

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (req, res) => {
  try {
    const employeeId = req.userID; // From authentication middleware
    
    const leaveRequests = await LeaveRequest.find({ employeeId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: leaveRequests.length,
      leaveRequests
    });
  } catch (error) {
    console.error("Error fetching employee leave requests:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leave requests", 
      error: error.message 
    });
  }
};

// Get a single leave request by ID
export const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leaveRequest = await LeaveRequest.findById(id)
      .populate('employeeId', 'name employeeId position mail');
    
    if (!leaveRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Leave request not found" 
      });
    }
    
    // Check if the request belongs to the authenticated employee or is being accessed by admin
    // This would need role-based authentication which you can implement based on your auth system
    
    res.status(200).json({
      success: true,
      leaveRequest
    });
  } catch (error) {
    console.error("Error fetching leave request:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leave request", 
      error: error.message 
    });
  }
};

// Update leave request status (admin only)
export const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    
    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }
    
    const leaveRequest = await LeaveRequest.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Leave request not found" 
      });
    }
    
    // Update the leave request
    leaveRequest.status = status;
    leaveRequest.adminRemarks = adminRemarks || "";
    
    await leaveRequest.save();
    
    // Populate employee details for the response
    const updatedLeaveRequest = await LeaveRequest.findById(id)
      .populate('employeeId', 'name employeeId position mail');
    
    res.status(200).json({
      success: true,
      message: `Leave request ${status} successfully`,
      leaveRequest: updatedLeaveRequest
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update leave request", 
      error: error.message 
    });
  }
};

// Delete a leave request (only if it's pending)
export const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.userID; // From authentication middleware
    
    const leaveRequest = await LeaveRequest.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Leave request not found" 
      });
    }
    
    // Check if the request belongs to the authenticated employee
    if (leaveRequest.employeeId.toString() !== employeeId) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to delete this leave request" 
      });
    }
    
    // Check if the request is still pending
    if (leaveRequest.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete leave request that has been processed" 
      });
    }
    
    await LeaveRequest.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete leave request", 
      error: error.message 
    });
  }
};

// Get leave statistics for an employee
export const getLeaveStatistics = async (req, res) => {
  try {
    const employeeId = req.userID; // From authentication middleware
    
    // Get all leave requests for the employee
    const leaveRequests = await LeaveRequest.find({ employeeId });
    
    // Calculate statistics
    const totalRequests = leaveRequests.length;
    const approved = leaveRequests.filter(req => req.status === "approved").length;
    const rejected = leaveRequests.filter(req => req.status === "rejected").length;
    const pending = leaveRequests.filter(req => req.status === "pending").length;
    
    // Calculate total days by leave type (only for approved leaves)
    const approvedLeaves = leaveRequests.filter(req => req.status === "approved");
    
    const leaveTypeStats = {
      sick: 0,
      casual: 0,
      annual: 0,
      other: 0
    };
    
    approvedLeaves.forEach(leave => {
      leaveTypeStats[leave.leaveType] += leave.totalDays;
    });
    
    // Calculate total days taken
    const totalDaysTaken = approvedLeaves.reduce((total, leave) => total + leave.totalDays, 0);
    
    res.status(200).json({
      success: true,
      statistics: {
        totalRequests,
        approved,
        rejected,
        pending,
        totalDaysTaken,
        leaveTypeStats
      }
    });
  } catch (error) {
    console.error("Error fetching leave statistics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch leave statistics", 
      error: error.message 
    });
  }
};
