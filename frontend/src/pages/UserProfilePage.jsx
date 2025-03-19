import Sidebar from "../components/UserDashboardNavBar";
import { motion } from "framer-motion";
import { useUserStore } from "../store/userStore.js";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const UserProfilePage = () => {
  const { fetchProfile, user, isLoading, deleteProfile } = useUserStore();
  const { checkAuth } = useAuthStore();
  const navigate = useNavigate();

  let date = new Date();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUserDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      await deleteProfile();
    }
    checkAuth();
  };

  // Chatbot States
  const [vehicleName, setVehicleName] = useState("");
  const [model, setModel] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChatSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8070/api/ai/vehicle-info",
        {
          vehicleName,
          model,
        }
      );
      setChatResponse(response.data.message);
    } catch (error) {
      console.error("Error fetching vehicle information", error);
      setChatResponse("Failed to retrieve vehicle information.");
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar />

      <div className="flex-1 flex items-start p-8 overflow-y-auto max-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 w-full h-max">
          <div className="font-black text-[#000000] text-3xl">
            Welcome {user?.name || "NA"},
          </div>
          <div className="font-medium text-[#a3a3a3] mb-[65px]">
            {date.toDateString()}
          </div>
          <div className="flex items-center justify-center mb-[65px]">
            <FontAwesomeIcon
              icon={faCircleUser}
              className="text-6xl text-gray-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <strong className="text-gray-800">Name:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.name || "N/A"}
              </div>
            </div>
            <div>
              <strong className="text-gray-800">Email:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.mail || "N/A"}
              </div>
            </div>
            <div>
              <strong className="text-gray-800">Username:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.username || "N/A"}
              </div>
            </div>
            <div>
              <strong className="text-gray-800">Phone:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.phone || "N/A"}
              </div>
            </div>
            <div className="col-span-2">
              <strong className="text-gray-800">Address:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.address || "N/A"}
              </div>
            </div>
            <div>
              <strong className="text-gray-800">NIC:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.NIC || "N/A"}
              </div>
            </div>
            <div>
              <strong className="text-gray-800">Verified:</strong>
              <div className="bg-gray-200 p-2 rounded-md">
                {user?.isVerified ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-max py-3 px-4 mt-[20px] mr-[10px] bg-[#2563eb] text-white font-bold rounded-lg shadow-lg transition duration-200"
            type="submit"
            disabled={isLoading}
            onClick={() => navigate("/edit-user-profile")}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Edit Profile"
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUserDelete}
            className="w-max py-3 px-4 mt-[20px] ml-[10px] bg-red-600 text-white font-bold rounded-lg shadow-lg transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Delete Profile"
            )}
          </motion.button>

          {/* Chatbot Section */}
          <div className="mt-6 p-6 border rounded-md bg-gray-50">
            <h3 className="font-bold text-lg mb-2">
              Vehicle Information Chatbot
            </h3>

            <input
              type="text"
              placeholder="Enter Vehicle Name"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="p-2 border rounded-md mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Enter Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="p-2 border rounded-md mb-2 w-full"
            />
            <button
              onClick={handleChatSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Get Vehicle Info"}
            </button>

            {chatResponse && (
              <p className="mt-4 text-gray-800">{chatResponse}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
