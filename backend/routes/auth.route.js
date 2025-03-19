import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//When page is refreshed to see if the user is auhtenticated or not
router.get("/checkauth", verifyToken, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verifyemail", verifyEmail);

router.post("/forgotpassword", forgotPassword);

router.post("/resetpassword/:token", resetPassword);

export default router;
