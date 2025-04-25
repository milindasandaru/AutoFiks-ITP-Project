import Cart from "../models/cart.model.js";
import SparePart from "../models/sparepart.model.js";

export const addToCart = async (req, res) => {
  const { sparePartId, quantity } = req.body;
  const userId = req.userID;

  try {
    const sparePart = await SparePart.findById(sparePartId);
    if (!sparePart) {
      return res.status(404).json({ message: "Spare part not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // New cart, check quantity
      if (quantity > sparePart.quantity) {
        return res.status(200).json({ message: "Not enough stock available" });
      }

      cart = new Cart({
        userId,
        items: [{ sparePart: sparePartId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.sparePart.toString() === sparePartId
      );

      if (itemIndex > -1) {
        const currentQty = cart.items[itemIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > sparePart.quantity) {
          return res
            .status(200)
            .json({ message: "Not enough stock available" });
        }

        cart.items[itemIndex].quantity = newQty;
      } else {
        if (quantity > sparePart.quantity) {
          return res
            .status(200)
            .json({ message: "Not enough stock available" });
        }

        cart.items.push({ sparePart: sparePartId, quantity });
      }
    }

    await cart.save();
    
    // Populate the spare part details before sending response
    const populatedCart = await Cart.findById(cart._id).populate('items.sparePart');
    res.status(200).json({ 
      success: true,
      message: "Item added to cart successfully", 
      cart: populatedCart 
    });
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userID }).populate(
      "items.sparePart"
    );
    console.log(req.userID);
    
    if (!cart) {
      // Return empty cart structure if no cart exists
      return res.status(200).json({
        success: true,
        cart: {
          userId: req.userID,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
    res.status(200).json({
      success: true,
      cart
    });
  } catch (err) {
    console.error("Error in getCart:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
  const { sparePartId } = req.body;
  const userId = req.userID;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.sparePart.toString() !== sparePartId
    );
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.userID });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const { sparePartId, quantity } = req.body;
  const userId = req.userID;

  if (!sparePartId || typeof quantity !== "number") {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  try {
    const sparePart = await SparePart.findById(sparePartId);
    if (!sparePart) {
      return res.status(404).json({ message: "Spare part not found" });
    }

    if (quantity > sparePart.quantity) {
      return res
        .status(200)
        .json({ message: "Quantity exceeds available stock" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.sparePart.toString() === sparePartId
    );
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Item quantity updated successfully", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

