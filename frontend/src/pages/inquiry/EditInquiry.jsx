import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/images/AMS_logo2.png";

const EditInquiry = () => {
  const { id } = useParams(); // Get the inquiry ID from the URL
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [userName, setUserName] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [type, setType] = useState("feedback");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("normal");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the inquiry details
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/api/inquiries/${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          const inquiry = response.data.inquiry;
          setMail(inquiry.mail);
          setUserName(inquiry.userName);
          setServiceID(inquiry.serviceID);
          setType(inquiry.type);
          setMessage(inquiry.message);
          setStatus(inquiry.status || "normal");
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8070/api/inquiries/${id}`,
        {
          mail,
          userName,
          serviceID,
          type,
          message,
          status: type === "complaint" ? status : undefined,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Inquiry updated successfully!");
        navigate(`/overview/inquiries/manage`);
      } else {
        console.error("Update failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating inquiry:", error.response?.data || error);
    }
  };

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
          Edit Inquiry
        </h2>
        <form onSubmit={handleSubmit}>
          <p className="text-[#a3a3a3] mt-4">Email</p>
          <input
            type="email"
            placeholder="Email Address"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled // Email is read-only
          />

          <p className="text-[#a3a3a3] mt-4">Full Name</p>
          <input
            type="text"
            placeholder="Full Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled // Name is read-only
          />

          <p className="text-[#a3a3a3] mt-4">Service ID</p>
          <input
            type="text"
            placeholder="Service ID"
            value={serviceID}
            onChange={(e) => setServiceID(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled // Service ID is read-only
          />

          <p className="text-[#a3a3a3] mt-4">Inquiry Type</p>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="feedback">Feedback</option>
            <option value="complaint">Complaint</option>
          </select>

          {type === "complaint" && (
            <>
              <p className="text-[#a3a3a3] mt-4">Complaint Status</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="very important">Very Important</option>
              </select>
            </>
          )}

          <p className="text-[#a3a3a3] mt-4">Message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <motion.button
            className="mt-5 mb-4 w-full py-3 px-4 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            <Save size={20} className="inline-block mr-2" />
            Save Changes
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditInquiry;