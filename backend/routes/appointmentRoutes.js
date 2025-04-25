import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import Booking from "../models/Booking.js";
const router = express.Router();

// POST route for creating an appointment
router.post('/', bookingController.createBooking);

// GET route for fetching all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Booking.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
});

export default router;