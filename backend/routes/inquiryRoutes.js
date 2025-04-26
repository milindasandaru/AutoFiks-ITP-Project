import express from 'express';
import {
  addInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiriesByType,
  getNextServiceID,
  sendInquiryReply
} from '../controllers/inquiryController.js'; // Corrected import path
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/next-service-id", getNextServiceID);

// Create a new inquiry
router.post('/', verifyToken, addInquiry);

// Get all inquiries
router.get('/', verifyToken, getAllInquiries);

// Get a single inquiry by ID
router.get('/:id', verifyToken, getInquiryById);

// Update an inquiry by ID
router.put('/:id', verifyToken, updateInquiry);

// Delete an inquiry by ID
router.delete('/:id', verifyToken, deleteInquiry);

// Get inquiries by type (feedback or complaint)
router.get('/type/:type', verifyToken, getInquiriesByType);

router.post("/reply", verifyToken, sendInquiryReply);



export default router;