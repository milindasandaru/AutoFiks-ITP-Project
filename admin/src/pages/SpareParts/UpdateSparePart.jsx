import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSparePartById,
  updateSparePart,
} from "../../services/sparePartService.js";

const UpdateSparePart = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: 0,
    quantity: 0,
    description: "",
    image: "https://via.placeholder.com/150",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { sparePartId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const { data } = await getSparePartById(sparePartId);
        setFormData({
          name: data.name,
          brand: data.brand,
          price: data.price,
          quantity: data.quantity,
          description: data.description,
          image: data.image,
        });
      } catch (error) {
        console.error("Error fetching spare part:", error);
        setError("Error fetching spare part data");
      }
    };

    fetchSparePart();
  }, [sparePartId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, brand, price, quantity, description, image } = formData;

    if (!name || !brand || price <= 0 || quantity <= 0 || !description) {
      setError("All fields are required");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("brand", brand);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("description", description);

    // Only append new image if selected (optional)
    if (image && typeof image !== "string") {
      data.append("image", image);
    }

    try {
      setLoading(true);
      const res = await updateSparePart(sparePartId, data); // API must support FormData
      if (res.data) {
        setTimeout(() => navigate("/spare_parts"), 2000);
      }
    } catch (error) {
      console.error("Error response:", error.response);
      setError(error.response?.data?.message || "Error updating spare part");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-8 bg-white rounded-2xl">
      <h1 className="text-3xl font-semibold">Update Spare Part</h1>
      <p className="text-gray-600">
        Please update the spare part information below:
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 my-10">
        <div>
          <label className="block mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="brand">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            id="brand"
            value={formData.brand}
            onChange={handleChange}
            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md"
          />
          {formData.image && typeof formData.image === "string" && (
            <img
              src={`http://localhost:8070${formData.image}`}
              alt="Current"
              className="w-32 h-32 mt-2 rounded-md object-cover"
            />
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Spare Part"}
        </button>
      </form>
    </div>
  );
};

export default UpdateSparePart;
