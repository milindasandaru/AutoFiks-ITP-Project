/*import express from "express";
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, getLoggedInEmployee} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/me", getLoggedInEmployee);

router.post("/", createEmployee); // Create Employee
router.get("/", getEmployees); // Read All Employees
router.get("/:id", getEmployeeById); // Read Single Employee
router.put("/:id", updateEmployee); // Update Employee
router.delete("/:id", deleteEmployee); // Delete Employee 


export default router;*/

import express from "express";
import { 
  createEmployee, 
  getEmployees, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee, 
  getLoggedInEmployee,
  clockIn,
  clockOut,
  getAttendanceHistory
} from "../controllers/employeeController.js";

const router = express.Router();

// Employee profile routes
router.get("/me", getLoggedInEmployee);

// CRUD operations
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

// Attendance tracking routes
router.post("/attendance/clock-in", clockIn);
router.post("/attendance/clock-out", clockOut);
router.get("/attendance/:employeeId", getAttendanceHistory);

export default router;