import Employee from "../models/Employee.js";
//import QRCode from "qrcode";
//import { v4 as uuidv4 } from "uuid";

// Auto generated employee Id
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

  let newIdNumber = 12345; // Default if no employees exist
  if (lastEmployee && lastEmployee.employeeId) {
    const lastIdNumber = parseInt(
      lastEmployee.employeeId.replace("EMP", ""),
      10
    );
    newIdNumber = lastIdNumber + 1;
  }

  return `EMP${newIdNumber.toString().padStart(5, "0")}`;
};

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    const employee = new Employee({ ...req.body, employeeId });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
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
