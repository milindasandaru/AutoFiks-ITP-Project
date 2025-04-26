import { motion } from "framer-motion";
import Input from "../../components/user/Input";
import { Mail, User, AlertCircle, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/AMS_logo2.png";
import axios from "axios";

const AddInquiry = () => {
  const [mail, setMail] = useState("");
  const [userName, setUserName] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [type, setType] = useState("feedback");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("normal");
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch next service ID on mount
  useEffect(() => {
    const fetchServiceID = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/api/inquiries/next-service-id",
          { withCredentials: true }
        );
        if (response.data.success) {
          setServiceID(response.data.nextServiceID);
        }
      } catch (error) {
        console.error("Error fetching next service ID:", error);
      }
    };

    fetchServiceID();
  }, []);

  const validateFields = () => {
    let newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      newErrors.mail = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8070/api/inquiries",
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
        navigate("/overview/inquiries/manage", { replace: true });
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img src={logo} className="h-[75px]" alt="Logo" />
          </div>
          <h2 className="text-2xl font-medium font-poppins mb-6 text-center bg-black text-transparent bg-clip-text">
            Submit an Inquiry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentSection === 1 && (
              <div className="space-y-4">
                <div>
                  <p className="text-[#a3a3a3] mb-2">Email</p>
                  <Input
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                  {errors.mail && (
                    <p className="text-red-500 text-sm mt-1">{errors.mail}</p>
                  )}
                </div>

                <div>
                  <p className="text-[#a3a3a3] mb-2">Full Name</p>
                  <Input
                    icon={User}
                    type="text"
                    placeholder="Full Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-[#a3a3a3] mb-2">Service ID</p>
                  <Input
                    icon={AlertCircle}
                    type="text"
                    placeholder="Service ID"
                    value={serviceID}
                    disabled // Make read-only
                  />
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNextSection}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} />
                  </motion.button>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-4">
                <div>
                  <p className="text-[#a3a3a3] mb-2">Inquiry Type</p>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="feedback">Feedback</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                {type === "complaint" && (
                  <div>
                    <p className="text-[#a3a3a3] mb-2">Complaint Status</p>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="very important">Very Important</option>
                    </select>
                  </div>
                )}

                <div>
                  <p className="text-[#a3a3a3] mb-2">Message</p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPreviousSection}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </motion.button>
                  <motion.button
                    className="px-6 py-2 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin mx-auto" size={24} />
                    ) : (
                      "Submit Inquiry"
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddInquiry;