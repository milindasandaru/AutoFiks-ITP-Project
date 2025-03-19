import express from "express";
import { getVehicleInfo } from "../controllers/userai.controller.js";

const router = express.Router();

// Route for fetching vehicle information
router.post("/vehicle-info", getVehicleInfo);

export default router;
