import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader, Trash, Edit, AlertCircle } from "lucide-react";
import axios from "axios";
import logo from "../../assets/images/AMS_logo2.png";

const ManageInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all inquiries
  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/inquiries");
      if (response.data.success) {
        setInquiries(response.data.inquiries);
      }
    } catch (error) {
      setError("Failed to fetch inquiries.");
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an inquiry
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8070/api/inquiries/${id}`
      );
      if (response.data.success) {
        setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  // Update inquiry status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8070/api/inquiries/${id}`,
        { status: newStatus }
      );
      if (response.data.success) {
        setInquiries(
          inquiries.map((inquiry) =>
            inquiry._id === id ? { ...inquiry, status: newStatus } : inquiry
          )
        );
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl w-full h-max mt-[40px] mb-[40px] bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="pt-8 pr-8 pl-8 h-max">
        <div className="w-max-content h-20 place-items-center">
          <img src={logo} className="h-[75px]" alt="Logo" />
        </div>
        <h2 className="text-2xl font-medium font-poppins mb-6 text-center bg-black text-transparent bg-clip-text">
          Manage Inquiries
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <motion.div
                key={inquiry._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                  <p className="text-sm text-gray-600">Inquiry ID: {inquiry._id}</p>
                    <p className="text-lg font-semibold">{inquiry.userName}</p>
                    <p className="text-sm text-gray-600">{inquiry.mail}</p>
                    <p className="text-sm text-gray-600">
                      Service ID: {inquiry.serviceID}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: {inquiry.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          inquiry.status === "very important"
                            ? "text-red-600"
                            : inquiry.status === "important"
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {/* Update Status Dropdown */}
                    {inquiry.type === "complaint" && (
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          handleUpdateStatus(inquiry._id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="very important">Very Important</option>
                      </select>
                    )}

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(inquiry._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash size={20} />
                    </motion.button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{inquiry.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageInquiry;