import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8070/api/auth";

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: { isVerified: false },
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (mail, password, name, username, phone, NIC, address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        mail,
        password,
        name,
        username,
        phone,
        NIC,
        address,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verifyemail`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log("API Response from verify email:", response.data);
      return response.data;
    } catch (error) {
      console.error("Verification Error:", error.response.data);
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/checkauth`);
      console.log("API Response from checkauth:", response.data);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        isVerified: true,
      });
    } catch (error) {
      console.log(error);
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  login: async (mail, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        mail,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error login in",
        isLoading: false,
      });
      console.error(error);
      throw error;
    }
  },
}));
