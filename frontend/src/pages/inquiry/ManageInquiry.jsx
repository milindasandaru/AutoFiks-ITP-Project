import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader, Trash, Edit, Plus } from "lucide-react";
import axios from "axios";
import logo from "../../assets/images/AMS_logo2.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ManageInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user's inquiries
  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/inquiries", {
        withCredentials: true,
      });
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8070/api/inquiries/${id}`, // Add the ID here
          { withCredentials: true }
        );
        if (response.data.success) {
          setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
        }
        toast.success("Succesfully deleted!")
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img src={logo} className="h-[75px]" alt="Logo" />
          </div>
          <h2 className="text-2xl font-medium font-poppins mb-6 text-center bg-black text-transparent bg-clip-text">
            My Inquiries
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No inquiries found. Click the + button to add a new inquiry.
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <motion.div
                    key={inquiry._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <p className="text-lg font-semibold">
                            {inquiry.userName}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inquiry.type === "complaint"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {inquiry.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {inquiry.mail}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Service ID: {inquiry.serviceID}
                        </p>
                        {inquiry.status && (
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
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/overview/inquiries/edit/${inquiry._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit size={20} />
                          </motion.button>
                        </Link>
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
                    <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {inquiry.message}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/overview/inquiries/add")}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
};

export default ManageInquiry; 