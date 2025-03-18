import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore.js";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditUserProfilePage = () => {
  const { fetchProfile, user, isLoading, updateProfile } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Populate the form when the user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.mail || "",
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleEditProfile = () => {
    updateProfile(formData, navigate);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 flex items-start p-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full h-max">
          <h2 className="font-black text-[#000000] text-3xl mb-4">
            Edit Profile
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="text-gray-800">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 rounded-md"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-800">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 rounded-md"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-gray-800">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 rounded-md"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-800">Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 rounded-md"
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="text-gray-800">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2 rounded-md"
              />
            </div>
          </div>

          {/* Edit Profile Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEditProfile}
            className="w-max py-3 px-4 mt-4 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfilePage;
