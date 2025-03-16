import Sidebar from "../components/UserDashboardNavBar";
import { useUserStore } from "../store/userStore.js";
import { useEffect } from "react";

const UserProfilePage = () => {
  const { fetchProfile, user } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full h-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            User Profile
          </h2>

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
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
