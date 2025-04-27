import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import Booking from "../models/booking.js";
import {User} from "../models/user.model.js";
import { brevoTransporter, sender } from '../mails/brevo.config.js';

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST route for creating an appointment - protected
router.post('/', verifyToken, bookingController.createBooking);

// GET route for fetching all appointments - protected
router.get('/', verifyToken, async (req, res) => {
    try {
        // Filter by the logged-in user's ID
        const appointments = await Booking.find({ userId: req.userID });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
});

// GET route for fetching all appointments (admin only)
router.get('/all', async (req, res) => {
    try {
        const appointments = await Booking.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
});

// In your router file (e.g., bookingRouter.js)

router.put('/update-status/:id', async (req, res) => {
    try {
      // Get the booking by ID
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Update the status of the booking
      booking.status = req.body.status;
  
      // Save the updated booking
      const updatedBooking = await booking.save();
  
      // Send an email notification to the user
      const user = await User.findById(booking.userId); // Assuming there's a user reference in the booking
      if (user) {
        const mailOptions = {
          from: sender.email,
          to: user.mail, // User's email
          subject: `Your appointment status has been updated`,
          text: `Hello ${user.name},\n\nYour appointment for the service "${booking.serviceType}" has been updated to: ${booking.status}.\n\nThank you for choosing our service!\n\nBest regards,\nAutofiks Team`,
        };
  
        // Send the email using Brevo
        await brevoTransporter.sendMail(mailOptions);
      }
  
      // Return the updated booking
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error updating status", error });
    }
  });


  

// Delete and update routes - protected
router.delete('/:id', verifyToken, bookingController.deleteBooking);
router.put('/:id', verifyToken, bookingController.updateBooking); 

export default router;
