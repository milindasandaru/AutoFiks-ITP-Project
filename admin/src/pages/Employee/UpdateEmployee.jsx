import React, { useEffect, useState } from "react";
import {
  getEmployeeById,
  updateEmployee,
  formatLKR
} from "../../services/employeeService.js";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployee = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    mail: "", // Changed from email to mail to match backend model
    phone: "",
    position: "",
    salary: "",
    // Other fields might be needed but not shown in the form
    gender: "",
    dob: "",
    nic: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const { data } = await getEmployeeById(id);
        
        // Make sure we're using the correct field names
        setFormData({
          name: data.name || "",
          mail: data.mail || "", // Use mail instead of email
          phone: data.phone || "",
          position: data.position || "",
          salary: data.salary || "",
          gender: data.gender || "",
          dob: data.dob ? data.dob.split('T')[0] : "", // Format date for input
          nic: data.nic || ""
        });
        
        setError("");
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError("Failed to load employee details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id]);

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.mail) {
      errors.mail = "Email is required";
    } else if (!emailRegex.test(formData.mail)) {
      errors.mail = "Invalid email format";
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
    
    // Position validation
    if (!formData.position) {
      errors.position = "Position is required";
    }
    
    // Salary validation
    if (!formData.salary) {
      errors.salary = "Salary is required";
    } else if (Number(formData.salary) < 35000) {
      errors.salary = "Salary must be at least LKR 35,000";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setError("Please correct the errors in the form");
      return;
    }
    
    try {
      await updateEmployee(id, formData);
      setSuccess(true);
      setError("");
      
      // Show success message and redirect
      setTimeout(() => navigate("/Employee"), 1500);
    } catch (error) {
      console.error("Error updating employee:", error);
      setError(error.response?.data?.message || "Error updating employee");
      setSuccess(false);
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
      <h2 className="text-2xl font-bold mb-4">Update Employee</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Employee updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Full Name"
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.mail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Email Address"
          />
          {formErrors.mail && <p className="text-red-500 text-sm mt-1">{formErrors.mail}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Phone Number"
          />
          {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.position ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Job Position"
          />
          {formErrors.position && <p className="text-red-500 text-sm mt-1">{formErrors.position}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Salary (LKR)</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.salary ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Minimum LKR 35,000"
            min="35000"
          />
          {formErrors.salary && <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>}
        </div>
        
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Employee
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/Employee")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
