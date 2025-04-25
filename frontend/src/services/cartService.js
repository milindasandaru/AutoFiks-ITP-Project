import axios from "axios";

const BASE_URL = "http://localhost:8070/api/cart";

const config = {
  withCredentials: true, // for cookies/auth
};

//  Add item to cart (or increase quantity)
export const addToCart = (userId, sparePartId, quantity = 1) => {
    console.log(userId, sparePartId, quantity);
  return axios.post(
    `${BASE_URL}/add`,
    {
      userId,
      sparePartId,
      quantity,
    },
    config
  );
};

//  Get user's cart
export const getCart = () => {
  return axios.get(`${BASE_URL}/my-cart`, config);
};

// ✅ Remove specific item from cart
export const removeFromCart = (sparePartId) => {
  return axios.put(
    `${BASE_URL}/remove`,
    {
      
      sparePartId,
    },
    config
  );
};

// ✅ Clear entire cart
export const clearCart = () => {
  return axios.delete(`${BASE_URL}/clear`, config);
};

// ✅ Update quantity of an item in cart (optional if not using add logic repeatedly)
export const updateCartItemQuantity = (sparePartId, newQuantity) => {
  return axios.put(
    `${BASE_URL}/update-quantity`,
    {
      
      sparePartId,
      quantity: newQuantity,
    },
    config
  );
};
