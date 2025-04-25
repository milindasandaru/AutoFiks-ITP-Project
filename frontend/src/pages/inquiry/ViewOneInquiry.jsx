import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, ArrowLeft,Trash } from "lucide-react";
import axios from "axios";
import logo from "../../assets/images/AMS_logo2.png";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';

const ViewOneInquiry = () => {
  const { id } = useParams(); // Get the inquiry ID from the URL
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete an inquiry
  
    /*const handleDelete = async (id) => {
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
    };*/

  // Fetch the inquiry details
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/api/inquiries/${id}`
        );
        if (response.data.success) {
          setInquiry(response.data.inquiry);
        }
      } catch (error) {
        setError("Failed to fetch inquiry details.");
        console.error("Error fetching inquiry:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Inquiry not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full h-max mt-[40px] mb-[40px] bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="pt-8 pr-8 pl-8 h-max">
        <div className="w-max-content h-20 place-items-center">
          <img src={logo} className="h-[75px]" alt="Logo" />
        </div>
        <h2 className="text-2xl font-medium font-poppins mb-6 text-center bg-black text-transparent bg-clip-text">
          Inquiry Details
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-[#a3a3a3]">Email</p>
            <p className="text-black">{inquiry.mail}</p>
          </div>

          <div>
            <p className="text-[#a3a3a3]">Full Name</p>
            <p className="text-black">{inquiry.userName}</p>
          </div>

          <div>
            <p className="text-[#a3a3a3]">Service ID</p>
            <p className="text-black">{inquiry.serviceID}</p>
          </div>

          <div>
            <p className="text-[#a3a3a3]">Inquiry Type</p>
            <p className="text-black capitalize">{inquiry.type}</p>
          </div>

          {inquiry.type === "complaint" && (
            <div>
              <p className="text-[#a3a3a3]">Complaint Status</p>
              <p
                className={`font-semibold ${
                  inquiry.status === "very important"
                    ? "text-red-600"
                    : inquiry.status === "important"
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {inquiry.status}
              </p>
            </div>
          )}

          <div>
            <p className="text-[#a3a3a3]">Message</p>
            <p className="text-black">{inquiry.message}</p>
          </div>

          <div>
            <p className="text-[#a3a3a3]">Created At</p>
            <p className="text-black">
              {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <Link to={`/inquries/edit/${inquiry._id}`} title="Edit">
                       <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" /> </Link>
                       {/* Delete Button */}
                    {/*<motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(inquiry._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash size={20} />
                    </motion.button>*/}
         <Link to={`/inquries/manage`} title="Edit">
         <AiOutlineEye className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" /> </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mt-6 w-full py-3 px-4 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          <ArrowLeft size={20} className="inline-block mr-2" />
          Go Back
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ViewOneInquiry;