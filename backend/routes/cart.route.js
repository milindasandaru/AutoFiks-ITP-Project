import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/remove", removeFromCart);
router.delete("/clear/:userId", clearCart);
router.put("/update-quantity", updateCartItemQuantity);

export default router;
