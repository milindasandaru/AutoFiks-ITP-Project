import express from "express";
import { 
  createEmployee, 
  getEmployees, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee, 
  getEmployeeProfile
} from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected route - requires authentication
router.get("/profile", verifyToken, getEmployeeProfile);

// Admin routes (these would typically be protected by admin middleware in a real app)
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
