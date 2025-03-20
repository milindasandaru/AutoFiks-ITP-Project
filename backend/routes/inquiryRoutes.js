import express from 'express';
import {
  addInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiriesByType,
} from '../controllers/inquiryController.js'; // Corrected import path

const router = express.Router();

// Create a new inquiry
router.post('/', addInquiry);

// Get all inquiries
router.get('/', getAllInquiries);

// Get a single inquiry by ID
router.get('/:id', getInquiryById);

// Update an inquiry by ID
router.put('/:id', updateInquiry);

// Delete an inquiry by ID
router.delete('/:id', deleteInquiry);

// Get inquiries by type (feedback or complaint)
router.get('/type/:type', getInquiriesByType);

export default router;