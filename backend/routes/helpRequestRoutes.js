import express from 'express';
import { 
  getAllHelpRequests, 
  getEmployeeHelpRequests,
  createHelpRequest, 
  getHelpRequestById, 
  addResponse, 
  updateHelpRequestStatus
} from '../controllers/helpRequestController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all help requests (admin only)
router.get('/', getAllHelpRequests);

// Get help requests for authenticated employee
router.get('/employee', getEmployeeHelpRequests);

// Create a new help request
router.post('/', createHelpRequest);

// Get a single help request
router.get('/details/:id', getHelpRequestById);

// Add a response to a help request
router.post('/:id/responses', addResponse);

// Update help request status
router.patch('/:id/status', updateHelpRequestStatus);

export default router;
