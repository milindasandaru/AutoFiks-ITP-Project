import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  sparePart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SparePart",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
