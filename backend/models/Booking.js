import mongoose from "mongoose";

// Define a schema for user and vehicle data
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    registrationNumber: { type: String, required: true },
    serviceType: { type: String, required: true }, // New field for service type
    selectedDateTime: { type: Date, required: true },
    status: { type: String, default: "Not Started" }  // New status field with default value
}, {timestamps: true});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
