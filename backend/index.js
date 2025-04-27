import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import bookingRoutes from "./routes/appointmentRoutes.js";
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
import http from "http"; // 🆕 For creating HTTP server
import { Server as SocketServer } from "socket.io"; // 🆕 For Socket.IO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new SocketServer(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Match your frontend ports
    credentials: true,
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io available inside routes (optional, but nice)
app.set('io', io);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(cookieParser()); 
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", userAIRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/sparepart", sparePartRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/admin/user", adminUserRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/salary", salaryRoutes);

// Start server
server.listen(PORT, () => {
  connectDB();
  console.log("🚀 Server running on port", PORT);
});
