import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteSparePart, getSpareParts } from "../../services/sparePartService";

const SparePart = () => {
  const [spareparts, setSpareparts] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpareparts();
  }, []);

  const fetchSpareparts = async () => {
    try {
      const { data } = await getSpareParts();
      setSpareparts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching spareparts:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sparepart?")) {
      try {
        await deleteSparePart(id);
        fetchSpareparts();
      } catch (error) {
        console.error("Error deleting sparepart:", error);
      }
    }
  };

  return (
    <div className="mx-auto p-3">
      <h1 className="text-3xl font-semibold mb-8">Spareparts Management</h1>
      <Link
        to="/create-new-sparepart"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 justify-end mb-5"
      >
        + Add New Sparepart
      </Link>
      {loading ? (
        <p>Loading spareparts...</p>
      ) : (
        <div className="mt-3 overflow-auto rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Image
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Name
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Description
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Price
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Quantity
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Brand
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {spareparts.map((sparepart) => (
                <tr
                  key={sparepart._id}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <img
                      src={
                        sparepart.image
                          ? `http://localhost:8070${sparepart.image}`
                          : "https://via.placeholder.com/48"
                      }
                      alt={sparepart.name}
                      className="w-25 h-25 rounded-md object-cover"
                    />
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {sparepart.name}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {sparepart.description.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {sparepart.price}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {sparepart.quantity}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {sparepart.brand}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <Link
                      to={`/update-sparepart/${sparepart._id}`}
                      className="p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-md bg-opacity-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(sparepart._id)}
                      className="text-red-500 px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SparePart;
