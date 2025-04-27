import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaveRequestForm = ({ onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    documents: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate total days for client-side validation
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((end - start) / oneDay)) + 1;
      
      // Prepare data with properly formatted dates
      const requestData = {
        ...formData,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalDays: diffDays // Include totalDays in the request
      };
      
      console.log("Submitting leave request data:", requestData);
      
      const response = await axios.post(
        'http://localhost:8070/api/leave-requests',
        requestData,
        { withCredentials: true }
      );
      
      console.log("Leave request response:", response.data);
      
      toast.success('Leave request submitted successfully');
      
      // Reset form
      setFormData({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
        documents: ''
      });
      
      // Notify parent component
      if (onRequestSubmitted) {
        onRequestSubmitted(response.data.leaveRequest);
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      console.error('Error response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Failed to submit leave request';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.leaveType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="annual">Annual Leave</option>
            <option value="other">Other</option>
          </select>
          {errors.leaveType && (
            <p className="mt-1 text-sm text-red-500">{errors.leaveType}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Leave
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please provide details about your leave request"
          ></textarea>
          {errors.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Documents (Optional)
          </label>
          <input
            type="text"
            name="documents"
            value={formData.documents}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add URL to any supporting documents"
          />
          <p className="mt-1 text-xs text-gray-500">
            For sick leave, please provide medical certificates if available
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;

