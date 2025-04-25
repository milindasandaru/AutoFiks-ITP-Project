import mongoose from "mongoose";


// Define a schema for user and vehicle data
const bookingSchema = new mongoose.Schema({

    model: { type: String, required: true},
    year: { type: Number, required: true},
    registrationNumber: { type: String, required: true},
    serviceType: { type: String, required: true },// New field for service type
    selectedDateTime: { type: Date, required: true }},
     {timestamps: true }); 

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;