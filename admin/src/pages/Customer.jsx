import React, { useEffect } from "react";
import { useAdminUserStore } from "../services/customerStore.js";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const Customer = () => {
  const { users, fetchUsers, deleteUser, isLoading, error } =
    useAdminUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.text("User Details Report", 14, 10);

    const tableColumn = [
      "Name",
      "Email",
      "Username",
      "Phone",
      "Address",
      "NIC",
    ];
    const tableRows = users.map((user) => [
      user.name,
      user.mail,
      user.username,
      user.phone,
      user.address,
      user.NIC,
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("User_Details.pdf");
  };

  return (
    <div className="p-6 font-[Poppins] bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6 mx-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Customer List
        </h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">NIC</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`p-4 transition-all ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.mail}</td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.address || "N/A"}</td>
                    <td className="p-3">{user.NIC || "N/A"}</td>
                    <td className="p-3">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={generatePDF}
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Customer;
