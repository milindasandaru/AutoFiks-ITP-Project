import express from "express";
import {
  getUserDetails,
  deleteUser,
} from "../controllers/adminuser.controller.js";

const router = express.Router();

router.get("/userdetails", getUserDetails);
router.delete("/deleteuser/:id", deleteUser);

export default router;
