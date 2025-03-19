/*import Employee from "../models/Employee.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

// Auto generated employee Id
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

  let newIdNumber = 12345; // Default if no employees exist
  if (lastEmployee && lastEmployee.employeeId) {
      const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""), 10);
      newIdNumber = lastIdNumber + 1;
  }

  return `EMP${newIdNumber.toString().padStart(5, '0')}`;
}; 

// Create Employee

export const createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();

    // Generate QR Code (Using Employee ID)
    const qrCodeDataURL = await QRCode.toDataURL(employeeId);

    if (!qrCodeDataURL) {
      return res.status(500).json({ message: "QR Code generation failed" });
    }

    // Create Employee with QR Code
    const employee = new Employee({ ...req.body, employeeId, qrCode: qrCodeDataURL });
    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Error creating employee" });
  }
};

// Get All Employees
export const getEmployees = async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Get Single Employee
export const getEmployeeById = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Update Employee
export const updateEmployee = async (req, res) => {
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Delete Employee
export const deleteEmployee = async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Get single employee by employee Id
/*export const getEmployeeByID = async (req, res) => {
  try{
    const employee = await Employee.findById(req.user.id);
    if (!employee) return res.status(404).json({message: "Employee not found"});

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

// Get Logged-in Employee (For Testing Without Login)
export const getLoggedInEmployee = async (req, res) => {
  try {
    const employeeId = "EMP12347"; // 🔹 Manually set an existing employee ID for testing
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
*/

import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js"; // Import attendance model
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

// Auto generated employee Id
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

  let newIdNumber = 12345; // Default if no employees exist
  if (lastEmployee && lastEmployee.employeeId) {
      const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""), 10);
      newIdNumber = lastIdNumber + 1;
  }

  return `EMP${newIdNumber.toString().padStart(5, '0')}`;
}; 

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    
    // Instead of storing the full QR code, just store the unique ID
    // QR code will be generated on demand
    const qrCodeIdentifier = uuidv4();
    
    // Create Employee with QR Code identifier instead of full data URL
    const employee = new Employee({ 
      ...req.body, 
      employeeId, 
      qrCode: qrCodeIdentifier 
    });
    
    await employee.save();
    
    // Generate QR for response but don't store it
    const qrCodeDataURL = await QRCode.toDataURL(employeeId);
    
    res.status(201).json({
      ...employee.toObject(),
      qrCode: qrCodeDataURL // Send QR in response
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ 
      message: "Error creating employee", 
      error: error.message 
    });
  }
};

// Get All Employees
export const getEmployees = async (req, res) => {
    try {
      const employees = await Employee.find();
      
      // Generate QR codes for each employee
      const employeesWithQR = await Promise.all(
        employees.map(async (employee) => {
          const qrCodeDataURL = await QRCode.toDataURL(employee.employeeId);
          return {
            ...employee.toObject(),
            qrCode: qrCodeDataURL
          };
        })
      );
      
      res.status(200).json(employeesWithQR);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Get Single Employee
export const getEmployeeById = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      
      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(employee.employeeId);
      
      res.status(200).json({
        ...employee.toObject(),
        qrCode: qrCodeDataURL
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Update Employee
export const updateEmployee = async (req, res) => {
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      );
      
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(updatedEmployee.employeeId);
      
      res.status(200).json({
        ...updatedEmployee.toObject(),
        qrCode: qrCodeDataURL
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Delete Employee
export const deleteEmployee = async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      // Also delete related attendance records
      await Attendance.deleteMany({ employeeId: employee.employeeId });
      
      res.status(200).json({ message: "Employee and related records deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Get Logged-in Employee (For Testing Without Login)
export const getLoggedInEmployee = async (req, res) => {
  try {
    // TODO: Replace with actual user session once available
    const employeeId = "EMP12347"; // Manually set for testing
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(employee.employeeId);
    
    res.status(200).json({
      ...employee.toObject(),
      qrCode: qrCodeDataURL
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// NEW: Clock In functionality
export const clockIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    
    // Find the employee
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    // Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's already an attendance record for today
    let attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (attendance) {
      // If already clocked in but not out, prevent duplicate clock-in
      if (attendance.clockIn && !attendance.clockOut) {
        return res.status(400).json({ 
          message: "Already clocked in. Please clock out first." 
        });
      }
      
      // If already clocked out, prevent further actions for the day
      if (attendance.clockOut) {
        return res.status(400).json({ 
          message: "Already completed your shift for today" 
        });
      }
      
      // Update with clock in time
      attendance.clockIn = new Date();
      await attendance.save();
    } else {
      // Create new attendance record
      attendance = new Attendance({
        employeeId,
        date: today,
        clockIn: new Date()
      });
      await attendance.save();
    }
    
    res.status(200).json({ 
      message: "Clock in successful", 
      time: attendance.clockIn 
    });
  } catch (error) {
    console.error("Clock in error:", error);
    res.status(500).json({ 
      message: "Error processing clock in",
      error: error.message
    });
  }
};

// NEW: Clock Out functionality
export const clockOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    
    // Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!attendance) {
      return res.status(404).json({ message: "No clock-in record found for today" });
    }
    
    if (!attendance.clockIn) {
      return res.status(400).json({ message: "Must clock in before clocking out" });
    }
    
    if (attendance.clockOut) {
      return res.status(400).json({ message: "Already clocked out for today" });
    }
    
    // Update with clock out time
    attendance.clockOut = new Date();
    await attendance.save();
    
    // Calculate duration in hours
    const durationMs = attendance.clockOut - attendance.clockIn;
    const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(2);
    
    res.status(200).json({ 
      message: "Clock out successful", 
      time: attendance.clockOut,
      hoursWorked: durationHours
    });
  } catch (error) {
    console.error("Clock out error:", error);
    res.status(500).json({ 
      message: "Error processing clock out",
      error: error.message
    });
  }
};

// NEW: Get employee attendance history
export const getAttendanceHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    
    // Find the employee
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    // Get attendance history
    const history = await Attendance.find({ employeeId })
      .sort({ date: -1 }) // newest first
      .limit(30); // last 30 days
    
    // Calculate hours worked for each day
    const attendanceWithHours = history.map(record => {
      let hoursWorked = null;
      if (record.clockIn && record.clockOut) {
        const durationMs = record.clockOut - record.clockIn;
        hoursWorked = (durationMs / (1000 * 60 * 60)).toFixed(2);
      }
      
      return {
        date: record.date,
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        hoursWorked
      };
    });
    
    res.status(200).json(attendanceWithHours);
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ 
      message: "Error retrieving attendance history",
      error: error.message
    });
  }
};