import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSparePart } from "../../services/sparePartService.js";

const CreateNewSparePart = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: 0,
    quantity: 0,
    description: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const navigate = useNavigate();

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

    if (
      !name ||
      !brand ||
      price <= 0 ||
      quantity <= 0 ||
      !description ||
      !image
    ) {
      setError("All fields are required");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("brand", brand);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("description", description);
    data.append("image", image); // ✅ key must match upload.single('image')

    try {
      setLoading(true);
      const res = await createSparePart(data); // expects FormData
      if (res.data) {
        setGeneratedId(res.data.sparePartId);
        setTimeout(() => navigate("/spare_parts"), 2000);
      }
    } catch (error) {
      console.error("Error:", error.response);
      setError(error.response?.data?.message || "Error creating spare part");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-8 bg-white rounded-2xl">
      <h1 className="text-3xl font-semibold">Create New Spare Part</h1>
      <p className="text-gray-600">
        In order to create a new spare part, please provide the following:
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
            min={2}
            max={10}
            maxLength={10}
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
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {generatedId && (
          <p className="text-green-500">
            Spare part created successfully. Id: {generatedId}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Spare Part"}
        </button>
      </form>
    </div>
  );
};

export default CreateNewSparePart;
