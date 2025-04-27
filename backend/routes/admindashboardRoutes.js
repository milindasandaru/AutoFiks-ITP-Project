// routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/admindashboardController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get dashboard statistics
router.get("/stats", verifyToken, getDashboardStats);

export default router;
