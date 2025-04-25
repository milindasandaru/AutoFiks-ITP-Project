import { useState } from "react";
import { addToCart } from "../../services/cartService";

const AddToCartButton = ({ userId, sparePartId }) => {
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await addToCart(userId, sparePartId, 1);
      if (response.status === 200) {
        alert(response.data.message);
      } else {
        alert("Failed to add item to cart");
      }
      setLoading(false)
    } catch (error) {
      setLoading(false);
      console.error("Add to cart error:", error);
      alert("Failed to add item to cart");
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-blue-600 mt-2 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full disabled:opacity-75 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <i className="fas fa-spinner animate-spin mr-2"></i>
          Adding...
        </>
      ) : (
        <>
          <i className="fas fa-shopping-cart mr-2"></i>
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
