import { motion } from "framer-motion";
import Input from "../../components/user/Input";
import { Mail, User, MessageSquare, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/AMS_logo2.png";
import axios from "axios";

const AddInquiry = () => {
  const [mail, setMail] = useState("");
  const [userName, setUserName] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [type, setType] = useState("feedback"); // Default to feedback
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("normal"); // Only for complaints
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validateFields = () => {
    let newErrors = {};

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      newErrors.mail = "Please enter a valid email address.";
    }

    // Service ID Validation
    if (!serviceID) {
      newErrors.serviceID = "Service ID is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFields()) return; // Prevent submission if validation fails
  
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://localhost:8070/api/inquiries", {
        mail,
        userName,
        serviceID,
        type,
        message,
        status: type === "complaint" ? status : undefined, // Only include status for complaints
      });
  
      if (response.data.success) {
        // Redirect to the view page of the newly created inquiry
        navigate(`/inquiries/view/${response.data.inquiry._id}`);
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextSection = () => {
    if (validateFields()) {
      setCurrentSection(2);
    }
  };

  const goToPreviousSection = () => {
    setCurrentSection(1);
  };

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
          Submit an Inquiry
        </h2>
        <form onSubmit={handleSubmit}>
          {/* First Section */}
          {currentSection === 1 && (
            <>
              <p className="text-[#a3a3a3] mt-4">Email</p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
              {errors.mail && <p className="text-red-500">{errors.mail}</p>}

              <p className="text-[#a3a3a3] mt-4">Full Name</p>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <p className="text-[#a3a3a3] mt-4">Service ID</p>
              <Input
                icon={AlertCircle}
                type="text"
                placeholder="Service ID"
                value={serviceID}
                onChange={(e) => setServiceID(e.target.value)}
              />
              {errors.serviceID && (
                <p className="text-red-500">{errors.serviceID}</p>
              )}

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToNextSection}
                className="mt-4 text-right cursor-pointer mb-4"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[#2563eb] text-xl"
                />
              </motion.div>
            </>
          )}

          {/* Second Section */}
          {currentSection === 2 && (
            <>
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

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToPreviousSection}
                className="mt-4 text-left cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-[#2563eb] text-xl"
                />
              </motion.div>
              <motion.button
                className="mt-5 mb-4 w-full py-3 px-4 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" size={24} />
                ) : (
                  "Submit Inquiry"
                )}
              </motion.button>
            </>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default AddInquiry;