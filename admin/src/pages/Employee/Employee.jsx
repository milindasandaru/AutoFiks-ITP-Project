import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEmployees,
  deleteEmployee,
} from "../../services/employeeService.js";
import { HiOutlineUserPlus } from "react-icons/hi2";

const Employee = () => {
  const [employees, setEmployees] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="mx-auto p-3">
      <Link
        to="/createEmployee"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add +
      </Link>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div className="mt-3 overflow-auto rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Name
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Email
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Phone
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Position
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Salary
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp._id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {emp.name}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {emp.email}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {emp.phone}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {emp.position}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {emp.salary}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <Link
                      to={`/updateEmployee/${emp._id}`}
                      className="p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-md bg-opacity-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(emp._id)}
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

export default Employee;
