import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8070/api/employees";

// Ensure credentials are sent with requests (for cookies)
axios.defaults.withCredentials = true;

export const useEmployeeStore = create((set, get) => ({
  employee: null,
  isLoading: false,
  error: null,

  fetchEmployeeProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching employee profile...");
      // Use the protected profile endpoint
      const response = await axios.get(`${API_URL}/profile`);
      
      console.log("Profile response:", response.data);
      
      if (response.data.success) {
        // Validate QR code
        const employee = response.data.employee;
        if (!employee.qrCode || !employee.qrCode.startsWith('data:image')) {
          console.warn("Invalid QR code in employee data:", employee.qrCode);
        }
        
        set({ 
          employee: employee, 
          isLoading: false 
        });
        console.log("Employee profile fetched successfully");
      } else {
        set({
          error: response.data.message || "Failed to fetch profile",
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        set({
          error: "Authentication required. Please log in again.",
          isLoading: false,
          employee: null
        });
      } else {
        set({
          error: error.response?.data?.message || "Error fetching employee profile",
          isLoading: false
        });
      }
    }
  },
  
  // You can add more functions here for other employee operations
  downloadQRCode: (qrCodeDataURL) => {
    if (!qrCodeDataURL || !qrCodeDataURL.startsWith('data:image')) {
      console.error("Invalid QR code data URL");
      return;
    }
    
    const employee = get().employee;
    const fileName = employee?.name 
      ? `${employee.name.replace(/\s+/g, '-')}-QR.png` 
      : 'employee-qr-code.png';
    
    const link = document.createElement('a');
    link.href = qrCodeDataURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}));