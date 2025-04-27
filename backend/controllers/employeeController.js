import { Employee } from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
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
    
    // Generate QR code data URL
    const qrCodeDataURL = await QRCode.toDataURL(employeeId);
    
    // Create Employee with the actual QR code data URL
    const employee = new Employee({ 
      ...req.body, 
      employeeId, 
      qrCode: qrCodeDataURL // Store the actual QR code data URL
    });
    
    await employee.save();
    
    res.status(201).json({
      ...employee.toObject(),
      qrCode: qrCodeDataURL
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
      
      // No need to regenerate QR codes, just return what's stored
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
      
      // No need to regenerate QR code, just return what's stored
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Update Employee
export const updateEmployee = async (req, res) => {
    try {
      // If updating employeeId, regenerate QR code
      let updateData = { ...req.body };
      
      if (updateData.employeeId) {
        const qrCodeDataURL = await QRCode.toDataURL(updateData.employeeId);
        updateData.qrCode = qrCodeDataURL;
      }
      
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        { new: true }
      );
      
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.status(200).json(updatedEmployee);
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

// Get employee profile using token
export const getEmployeeProfile = async (req, res) => {
  try {
    console.log("Employee profile route handler triggered");
    
    // Get the userID from the token (set by verifyToken middleware)
    const employeeID = req.userID;
    console.log("Fetching employee with ID:", employeeID);

    if (!employeeID) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const employee = await Employee.findById(employeeID).select("-password");
    
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // If QR code is missing for some reason, generate it on the fly
    let employeeData = employee.toObject();
    
    if (!employeeData.qrCode) {
      console.log("QR code missing, generating new one");
      const qrCodeDataURL = await QRCode.toDataURL(employee.employeeId);
      
      // Update the employee record with the new QR code
      employee.qrCode = qrCodeDataURL;
      await employee.save();
      
      employeeData.qrCode = qrCodeDataURL;
    }

    console.log("Employee found:", employee.name);
    console.log("QR code available:", !!employeeData.qrCode);
    
    res.status(200).json({ 
      success: true, 
      employee: employeeData 
    });
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
