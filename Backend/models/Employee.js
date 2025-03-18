import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, trim: true },
    nic: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true},
    createdAt: { type: Date, default: Date.now },
    qrCode:{ type:String, unique: true, required:true}
});

export default mongoose.model("Employee", employeeSchema);

