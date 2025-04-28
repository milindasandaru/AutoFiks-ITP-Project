// routes/salaryRoutes.js
import express from "express";
import {
  generateSalary,
  getEmployeeSalaries,
  getSalaryById,
  getAllSalaries,
  updateSalaryStatus,
  generateTestSalaryData
} from "../controllers/salaryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Apply authentication to all routes
router.use(verifyToken);

// Employee routes
router.get("/my-salaries", getEmployeeSalaries);
router.get("/detail/:id", getSalaryById);

// Admin routes
router.post("/generate", generateSalary);
router.get("/all", getAllSalaries);
router.patch("/:id/status", updateSalaryStatus);

// Test data generation route (for demo purposes)
router.post("/generate-test-data", generateTestSalaryData);

export default router;
