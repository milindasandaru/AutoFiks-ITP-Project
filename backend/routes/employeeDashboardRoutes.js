// routes/employeeDashboardRoutes.js
import express from 'express';
import { getEmployeeDashboard, generateDemoData } from '../controllers/employeeDashboardController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply authentication middleware 
router.use(verifyToken);

// Get dashboard data
router.get('/', getEmployeeDashboard);

// Generate demo data for testing
router.post('/generate-demo-data', generateDemoData);

export default router;
