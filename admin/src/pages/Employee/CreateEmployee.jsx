import React, { useState } from "react";
import { createEmployee } from "../../services/employeeService.js";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    mail: "", // Using mail to match backend model
    password: "",
    phone: "",
    dob: "",
    gender: "",
    nic: "",
    position: "",
    salary: ""
  });
  
  const [generatedId, setGeneratedId] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.mail) {
      errors.mail = "Email is required";
    } else if (!emailRegex.test(formData.mail)) {
      errors.mail = "Invalid email format";
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }
    
    // Date of birth validation
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        errors.dob = "Employee must be at least 18 years old";
      }
    }
    
    // Gender validation
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    
    // NIC validation
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!formData.nic) {
      errors.nic = "NIC is required";
    } else if (!nicRegex.test(formData.nic)) {
      errors.nic = "Invalid NIC format";
    }
    
    // Position validation
    if (!formData.position) {
      errors.position = "Position is required";
    }
    
    // Salary validation
    if (!formData.salary) {
      errors.salary = "Salary is required";
    } else if (Number(formData.salary) < 50000) {
      errors.salary = "Salary must be at least LKR 50,000";
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
      const { data } = await createEmployee(formData);
      setGeneratedId(data.employeeId);
      setError("");
      
      // Show success message and redirect
      setTimeout(() => navigate("/Employee"), 2000);
    } catch (error) {
      console.error("Error creating employee:", error);
      setError(error.response?.data?.message || "Error creating employee");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Employee</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {generatedId && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Employee created successfully! ID: {generatedId}
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
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Password"
          />
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
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
          <label className="block text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.dob ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.dob && <p className="text-red-500 text-sm mt-1">{formErrors.dob}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.gender ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">NIC</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.nic ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="National ID Number"
          />
          {formErrors.nic && <p className="text-red-500 text-sm mt-1">{formErrors.nic}</p>}
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
            placeholder="Minimum LKR 50,000"
            min="50000"
          />
          {formErrors.salary && <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>}
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Employee
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
