import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task, 
  isEditing, 
  onChange, 
  onDateChange,
  onSubmit, 
  employees,
  submitting,
  error
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl transform transition-all duration-300 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Update Service Task' : 'Create New Service Task'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none transition-colors"
              disabled={submitting}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task Information */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Task Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={onChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Enter detailed service description"
                    required
                  ></textarea>
                </div>
              </div>
              
              {/* Vehicle Information */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Vehicle Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                      type="text"
                      name="vehicleInfo.make"
                      value={task.vehicleInfo.make}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Toyota, Honda, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="vehicleInfo.model"
                      value={task.vehicleInfo.model}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Corolla, Civic, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      name="vehicleInfo.year"
                      value={task.vehicleInfo.year}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="2023"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                      type="text"
                      name="vehicleInfo.licensePlate"
                      value={task.vehicleInfo.licensePlate}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="ABC-123"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                    <input
                      type="text"
                      name="vehicleInfo.vin"
                      value={task.vehicleInfo.vin}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Vehicle Identification Number"
                    />
                  </div>
                </div>
              </div>
              
              {/* Customer Information */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={task.customerName}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Customer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                    <input
                      type="text"
                      name="customerPhone"
                      value={task.customerPhone}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
              
              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Service Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    name="serviceType"
                    value={task.serviceType}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={task.status}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="on hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              {/* Assignment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Assignment Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To Employee <span className="text-red-500">*</span></label>
                  <select
                    name="employeeId"
                    value={task.employeeId}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    required
                  >
                    <option value="">Select an employee</option>
                    {employees && employees.length > 0 ? (
                      employees.map(employee => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.position || 'Employee'}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No employees available</option>
                    )}
                  </select>
                  {employees && employees.length === 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      No employees found. Please add employees first.
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    name="estimatedTime"
                    value={task.estimatedTime}
                    onChange={onChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Estimated time in minutes"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <DatePicker
                    selected={task.dueDate}
                    onChange={onDateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholderText="Select due date"
                    dateFormat="MMMM d, yyyy"
                    isClearable
                  />
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 mt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Task' : 'Create Task'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;