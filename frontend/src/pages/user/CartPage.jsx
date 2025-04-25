import { useEffect, useState } from "react";

import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../services/cartService";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removeLoadingItemId, setRemoveLoadingItemId] = useState(null);
  const [error, setError] = useState("");
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data.cart);
    } catch (error) {
      setError("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (sparePartId) => {
    try {
      setRemoveLoadingItemId(true);
      const response = await removeFromCart(sparePartId);
      if (response.status === 200) {
        alert("Item removed from cart");
        fetchCart();
      } else {
        alert("Failed to remove item from cart");
      }
      setRemoveLoadingItemId(false);
      fetchCart();
    } catch {
      alert("Failed to remove item");
      setRemoveLoadingItemId(false);
    }
  };

  const handleQuantityChange = async (sparePartId, quantity) => {
    if (quantity < 1) return;
    try {
      setLoadingItemId(sparePartId);
      const response = await updateCartItemQuantity(sparePartId, quantity);
      if (response.status !== 200) {
        alert(response.data.message);
      }

      fetchCart();
    } catch {
      alert("Failed to update quantity");
    } finally {
      setLoadingItemId(null);
    }
  };

  const getTotal = () => {
    return cart?.items.reduce(
      (sum, item) => sum + item.quantity * item.sparePart.price,
      0
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg w-full h-max">
        <h1 className="text-3xl font-semibold mb-4 text-center">Your Cart</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center w-full gap-4 bg-white p-4 rounded-lg shadow animate-pulse"
              >
                <div className="h-20 w-20 bg-gray-300 rounded"></div>
                <div className="flex-1 h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cart && cart?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <i className="fas fa-shopping-cart text-5xl mb-4"></i>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cart?.items?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
              >
                <Link to={`/overview/spare-part/${item.sparePart._id}`}>
                  <img
                    src={`http://localhost:8070${item.sparePart.image}`}
                    alt={item.sparePart.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </Link>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.sparePart.name}
                  </h2>
                  <p className="text-gray-600">{item.sparePart.brand}</p>
                  <p className="text-gray-800 font-medium">
                    Rs. {item.sparePart.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.sparePart._id,
                        item.quantity - 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    disabled={loadingItemId === item.sparePart._id}
                  >
                    −
                  </button>

                  {loadingItemId === item.sparePart._id ? (
                    <span className="px-3 text-blue-600 text-sm">...</span>
                  ) : (
                    <span className="px-3">{item.quantity}</span>
                  )}

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.sparePart._id,
                        item.quantity + 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    disabled={loadingItemId === item.sparePart._id}
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right font-semibold text-gray-800">
                  Rs. {(item.sparePart.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(item.sparePart._id)}
                  className="text-red-500 hover:text-red-700 ml-4 disabled:text-red-500"
                  disabled={removeLoadingItemId === item.sparePart._id}
                >
                  {removeLoadingItemId === item.sparePart._id ? (
                    "..."
                  ) : (
                    <FaTrash clssName="text-red-500 hover:text-red-700" />
                  )}
                </button>
              </div>
            ))}

            <div className="text-right mt-6">
              <h2 className="text-xl font-semibold">
                Total: Rs. {getTotal().toFixed(2)}
              </h2>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
