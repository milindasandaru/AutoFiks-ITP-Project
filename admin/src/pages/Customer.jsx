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

    const tableColumn = ["Name", "Email", "Username", "Phone"];
    const tableRows = [];

    users.forEach((user) => {
      const userData = [user.name, user.mail, user.username, user.phone];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("User_Details.pdf");
  };

  return (
    <div className="p-6 font-[Poppins]">
      <h2 className="text-2xl font-semibold mb-4">Customer List</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.mail}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={generatePDF}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded cursor-pointer"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Customer;
