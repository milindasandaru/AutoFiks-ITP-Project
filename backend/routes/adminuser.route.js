import express from "express";
import {
  getUserDetails,
  deleteUser,
  getUserStats,
} from "../controllers/adminuser.controller.js";

const router = express.Router();

router.get("/userdetails", getUserDetails);
router.delete("/deleteuser/:id", deleteUser);
router.get("/stats", getUserStats);

export default router;
