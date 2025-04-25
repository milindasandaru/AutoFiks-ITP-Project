import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/user/UserDashboardNavBar";
import AddToCartButton from "../../components/user/AddToCartButton";
import { useUserStore } from "../../store/userStore";
import { IoCartOutline } from "react-icons/io5"; // Import IoCartOutline;
const SparePartViewPage = () => {
  const { id } = useParams();
  const [sparePart, setSparePart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUserStore();
  const [relatedParts, setRelatedParts] = useState([]);

  useEffect(() => {
    const fetchRelatedParts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/api/sparepart/get-spareparts"
        );
        const filtered = response.data.filter((p) => p._id !== id); // exclude current
        setRelatedParts(filtered.slice(0, 5)); // limit to 4
      } catch (err) {
        console.log("Error loading related parts", err);
      }
    };

    fetchRelatedParts();
  }, [id]);


  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/api/sparepart/get-sparepart/${id}`
        );
        setSparePart(response.data);
      } catch (err) {
        setError("Spare part not found", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSparePart();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-1">Spare Part Details</h1>
        <p className="text-gray-600">
          Here you can view the details of a specific spare part.
        </p>
        <div className="max-w-4xl mx-auto bg-white shadow-xs rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={
                  sparePart.image
                    ? `http://localhost:8070${sparePart.image}`
                    : "https://via.placeholder.com/200"
                }
                alt={sparePart.name}
                className="w-full h-150 object-cover rounded-md"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{sparePart.name}</h1>
              <p className="text-gray-600 text-lg mb-1">{sparePart.brand}</p>
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-yellow-500 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.048 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1.002 1.002 0 00.95.691h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.379-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118l-3.38-2.455c-.782-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.691l1.287-3.957z"
                    />
                  </svg>
                ))}
              </div>

              <p className="text-2xl text-blue-600 font-semibold mb-2">
                LKR {sparePart.price}
              </p>
              <p
                className={`mb-4 ${
                  sparePart.quantity > 0
                    ? "text-green-600"
                    : "text-red-500 font-medium"
                }`}
              >
                {sparePart.quantity > 0
                  ? `${sparePart.quantity} In Stock`
                  : "Out of Stock"}
              </p>

              <p className="text-gray-500 text-sm mb-4">
                {sparePart.description}
              </p>

              <AddToCartButton
                userId={user?._id || "67dd2a3c442028edfc53a7bb"}
                sparePartId={sparePart._id}
              />
              <Link
                to="/cart"
                className="block bg-slate-200 border-gray-500 py-2 rounded-md w-full mt-2 text-center text-slate-600 hover:text-slate-700"
              >
                <IoCartOutline className="inline-block mr-2 size-5" />
                View Cart
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">You may also like</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 hide-scroll">
            {relatedParts.map((part) => (
              <div
                key={part._id}
                className="min-w-[220px] bg-white border border-gray-200 rounded-md shadow-sm p-3 hover:shadow-md transition"
              >
                <Link to={`/spare-part/${part._id}`}>
                  <img
                    src={
                      part.image
                        ? `http://localhost:8070${part.image}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={part.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </Link>

                <h3 className="mt-2 font-semibold text-md line-clamp-1">
                  {part.name}
                </h3>
                <p className="text-sm text-gray-500">{part.brand}</p>
                <div className="flex justify-between items-center">
                  <p className="text-green-500 my-1">
                    {part.quantity > 0
                      ? `${part.quantity} In Stock`
                      : "No Stock"}
                  </p>
                  <div className="bg-blue-100 border border-blue-400 px-1 rounded-md">
                    <p className="text-md text-blue-600">LKR {part.price}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <AddToCartButton
                    userId={user?._id || "67dd2a3c442028edfc53a7bb"}
                    sparePartId={part._id}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparePartViewPage;
