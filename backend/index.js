import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import userAIRoutes from "./routes/userai.route.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import sparePartRoutes from "./routes/sparepart.route.js";
import cartRouter from "./routes/cart.route.js";
import adminUserRoutes from "./routes/adminuser.route.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import leaveRequestRoutes from "./routes/leaveRequestRoutes.js";
import helpRequestRoutes from "./routes/helpRequestRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser()); 
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", userAIRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/sparepart", sparePartRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/admin/user", adminUserRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/salary", salaryRoutes);

app.listen(8070, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});
