// routes/userDashboardRoutes.js
import express from 'express';
import { getUserDashboardData, generateUserDemoData } from '../controllers/userDashboardController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get dashboard data for authenticated user
router.get('/', getUserDashboardData);

// Generate demo data for testing
router.post('/generate-demo-data', generateUserDemoData);

export default router;
