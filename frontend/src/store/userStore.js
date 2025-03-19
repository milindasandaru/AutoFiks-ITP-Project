import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8070/api/user";

axios.defaults.withCredentials = true;

export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({ user: response.data.user });
      console.log("User profile fetched.");
    } catch (error) {
      set({
        error: error.response.data.message || "Error fetching profile",
        isLoading: false,
      });
      console.error("Error fetching profile:", error);
    }
  },

  updateProfile: async (updatedData, navigate) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`${API_URL}/profile`, updatedData);
      set({ user: response.data.user, isLoading: false });
      console.log("Profile updated successfully.");
      navigate("/user-profile");
      toast.success("Profile updated succesfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating profile",
        isLoading: false,
      });
      console.error("Error updating profile:", error);
    }
  },

  deleteProfile: async () => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_URL}/profile`);
      set({ user: null, isLoading: false });
      console.log("Profile deleted successfully.");
      toast.success("Profile deleted succesfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting profile",
        isLoading: false,
      });
      console.error("Error deleting profile:", error);
    }
  },
}));
