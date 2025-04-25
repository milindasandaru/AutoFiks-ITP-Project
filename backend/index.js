import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import userAIRoutes from "./routes/userai.route.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import adminUserRoutes from "./routes/adminuser.route.js";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser()); //allows us to parse incoming cookies
app.use(express.json()); //allows us to parse incoming requests:req.body

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", userAIRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin/user", adminUserRoutes);

app.listen(8070, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});
