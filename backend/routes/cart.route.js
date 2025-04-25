import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/my-cart", verifyToken, getCart);
router.put("/remove", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);
router.put("/update-quantity", verifyToken, updateCartItemQuantity);

export default router;
