import Booking from "../models/booking.js"

// Example for createBooking
export const createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            userId: req.userID, // Add the user ID from the token
            status: "Not Started",  // Ensure default status is set
        };
        
        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: "Error creating booking", error });
    }
  };

// Example for deleteBooking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        // No need for user role or userId check, just delete the booking based on bookingId
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error });
    }
  };

  
// Example for updateBooking
export const updateBooking = async (req, res) => {
  try {
      const booking = await Booking.findById(req.params.id);
      
      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the booking belongs to the logged-in user
      if (booking.userId.toString() !== req.userID) {
          return res.status(403).json({ message: "Not authorized to update this booking" });
      }
      
      const updatedBooking = await Booking.findByIdAndUpdate(
          req.params.id, 
          req.body, 
          { new: true }
      );
      
      res.json(updatedBooking);
  } catch (error) {
      res.status(500).json({ message: "Error updating booking", error });
  }
};
