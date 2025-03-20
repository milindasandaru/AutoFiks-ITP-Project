import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8070/api/admin/user";

axios.defaults.withCredentials = true;

export const useAdminUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/userdetails`);
      set({ users: response.data.users });
      toast.success("Users fetched successfully");
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/deleteuser/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      toast.success("User deleted successfully");
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
