import express from "express";
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee); // Create Employee
router.get("/", getEmployees); // Read All Employees
router.get("/:id", getEmployeeById); // Read Single Employee
router.put("/:id", updateEmployee); // Update Employee
router.delete("/:id", deleteEmployee); // Delete Employee 

export default router;