import express from "express";
import { 
  createLeaveRequest,
  getAllLeaveRequests,
  getEmployeeLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequestStatus,
  deleteLeaveRequest,
  getLeaveStatistics
} from "../controllers/leaveRequestController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Employee routes (protected by authentication)
router.post("/", verifyToken, createLeaveRequest);
router.get("/my-requests", verifyToken, getEmployeeLeaveRequests);
router.get("/statistics", verifyToken, getLeaveStatistics);
router.delete("/:id", verifyToken, deleteLeaveRequest);

// Admin routes (these would typically be protected by admin middleware)
router.get("/", verifyToken, getAllLeaveRequests);
router.get("/:id", verifyToken, getLeaveRequestById);
router.patch("/:id/status", verifyToken, updateLeaveRequestStatus);

export default router;
