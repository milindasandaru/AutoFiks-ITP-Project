import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEmployees,
  deleteEmployee,
  formatLKR
} from "../../services/employeeService.js";
import { 
  FaUserPlus, 
  FaTasks, 
  FaCalendarAlt, 
  FaHeadset, 
  FaMoneyBillWave, 
  FaQrcode, 
  FaChartBar 
} from "react-icons/fa";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await getEmployees();
      setEmployees(data);
      setError("");
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Management</h2>
        
        {/* Navigation Card with Icons */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            <Link
              to="/createEmployee"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 text-blue-600"
            >
              <FaUserPlus className="text-xl mb-1" />
              <span className="text-xs font-medium">Add Employee</span>
            </Link>
            
            <Link
              to="/taskManagement"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100 text-indigo-600"
            >
              <FaTasks className="text-xl mb-1" />
              <span className="text-xs font-medium">Tasks</span>
            </Link>
            
            <Link
              to="/leaveManagementAdmin"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-100 text-purple-600"
            >
              <FaCalendarAlt className="text-xl mb-1" />
              <span className="text-xs font-medium">Leave</span>
            </Link>
            
            <Link
              to="/adminHelpRequests"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-100 text-teal-600"
            >
              <FaHeadset className="text-xl mb-1" />
              <span className="text-xs font-medium">Help Center</span>
            </Link>
            
            <Link
              to="/adminSalaryManagement"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-100 text-green-600"
            >
              <FaMoneyBillWave className="text-xl mb-1" />
              <span className="text-xs font-medium">Salary</span>
            </Link>
            
            <Link
              to="/attendancePage"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-100 text-amber-600"
            >
              <FaQrcode className="text-xl mb-1" />
              <span className="text-xs font-medium">QR Scanner</span>
            </Link>
            
            <Link
              to="/attendanceReport"
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-100 text-orange-600"
            >
              <FaChartBar className="text-xl mb-1" />
              <span className="text-xs font-medium">Attendance</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {employees.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No employees found. Add your first employee!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {emp.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {emp.mail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {emp.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {emp.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatLKR(emp.salary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/updateEmployee/${emp._id}`}
                        className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </Link>
                      
                      {deleteConfirm === emp._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(emp._id)}
                          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
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
