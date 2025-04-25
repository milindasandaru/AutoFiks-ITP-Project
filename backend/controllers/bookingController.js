import Booking from "../models/Booking.js";

// Create an appointment
export const createBooking = async (req, res) => {
  const { model, year, registrationNumber, serviceType, selectedDateTime } = req.body;

  if (!model || !year || !registrationNumber || !serviceType || !selectedDateTime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Ensure selectedDateTime is a valid Date
  const parsedDate = new Date(selectedDateTime);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    // Create a new Booking instance
    const newBooking = new Booking({
      model,
      year,
      registrationNumber,
      serviceType,
      selectedDateTime: parsedDate
    });

    // Save the appointment to the database
    const savedBooking = await newBooking.save();

    // Respond with the saved appointment data
    res.status(201).json({
      message: 'Appointment booked successfully!',
      booking: savedBooking
    });

  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ message: 'Error booking the appointment' });
  }
};

// Get all appointments
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Get an appointment by ID
export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ booking }); // Fixed: return booking, not appointment
  } catch (error) {
    console.error('Error fetching appointment by ID:', error);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
};

// Update an appointment (e.g., for changing status or modifying details)
export const updateBooking = async (req, res) => { // Fixed: renamed to updateBooking
  const { id } = req.params;
  const { model, year, registrationNumber, serviceType, selectedDateTime } = req.body;

  try {
    let updateData = { model, year, registrationNumber, serviceType };
    
    // Handle date update if provided
    if (selectedDateTime) {
      const parsedDate = new Date(selectedDateTime);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      updateData.selectedDateTime = parsedDate;
    }

    const updatedBooking = await Booking.findByIdAndUpdate( // Fixed: using Booking model
      id,
      updateData,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ 
      message: 'Appointment updated successfully', 
      booking: updatedBooking // Fixed: consistent naming
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
};

// Delete an appointment
export const deleteBooking = async (req, res) => { // Fixed: renamed to deleteBooking
  const { id } = req.params;

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id); // Fixed: using Booking model
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};
