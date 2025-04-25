import { useState, useEffect } from "react";
import Sidebar from "../../components/user/UserDashboardNavBar";
import axios from "axios";
import AddToCartButton from "../../components/user/AddToCartButton";
import { useUserStore } from "../../store/userStore.js";
import { Link } from "react-router-dom";

const StorePage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search term state
  const { user } = useUserStore();

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/api/sparepart/get-spareparts"
        );
        setSpareParts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching spare parts", error);
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  //  Filtered spare parts based on search term
  const filteredParts = spareParts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold">Spare Parts Store</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the Spare Parts Store. Here you can find a wide range of
          spare parts for your vehicle.
        </p>

        {/* ✅ Search input */}
        <div className="my-6">
          <input
            type="text"
            placeholder="Search spare parts by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded-lg animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300 rounded-md"></div>
                <div className="mt-4 h-6 bg-gray-300 rounded-md"></div>
                <div className="mt-2 h-4 bg-gray-300 rounded-md"></div>
                <div className="mt-2 h-4 bg-gray-300 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {/* ✅ Show filtered results */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredParts.length > 0 ? (
            filteredParts.map((part) => (
              <div
                key={part._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Link to={`/spare-part/${part._id}`}>
                  <img
                    src={
                      part.image
                        ? `http://localhost:8070${part.image}`
                        : "https://via.placeholder.com/48"
                    }
                    alt={part.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </Link>
                <h3 className="mt-4 text-xl font-semibold line-clamp-1">
                  {part.name}
                </h3>
                <p className="text-gray-500 mt-1 text-sm">{part.brand}</p>
                <div className="flex justify-between items-center">
                  <p className="text-blue-900 my-1">
                    {part.quantity > 0
                      ? `${part.quantity} In Stock`
                      : "No Stock"}
                  </p>
                  <div className="bg-blue-100 border border-blue-400 px-1 rounded-md">
                    <p className="text-md text-blue-600">LKR {part.price}</p>
                  </div>
                </div>
                <AddToCartButton
                  userId={user?._id || "67dd2a3c442028edfc53a7bb"}
                  sparePartId={part._id}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No spare parts match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
