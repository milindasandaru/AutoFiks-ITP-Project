import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8070/api/user";

axios.defaults.withCredentials = true;

export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({ user: response.data.user, isLoading: true });
      console.log("User profile fetched.");
    } catch (error) {
      set({
        error: error.response.data.message || "Error fetching profile",
        isLoading: false,
      });
      console.error("Error fetching profile:", error);
    }
  },
}));
