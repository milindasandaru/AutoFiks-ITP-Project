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
export const getCart = (userId) => {
  return axios.get(`${BASE_URL}/${userId}`, config);
};

// ✅ Remove specific item from cart
export const removeFromCart = (userId, sparePartId) => {
  return axios.put(
    `${BASE_URL}/remove`,
    {
      userId,
      sparePartId,
    },
    config
  );
};

// ✅ Clear entire cart
export const clearCart = (userId) => {
  return axios.delete(`${BASE_URL}/clear/${userId}`, config);
};

// ✅ Update quantity of an item in cart (optional if not using add logic repeatedly)
export const updateCartItemQuantity = (userId, sparePartId, newQuantity) => {
  return axios.put(
    `${BASE_URL}/update-quantity`,
    {
      userId,
      sparePartId,
      quantity: newQuantity,
    },
    config
  );
};
