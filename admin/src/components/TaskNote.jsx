import React, { useState } from 'react';

const TaskNote = ({ task, onEdit, onDelete, onStatusChange, employees }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);

  // Background colors based on status
  const statusColors = {
    'pending': 'bg-yellow-100 border-yellow-300',
    'in progress': 'bg-blue-100 border-blue-300',
    'completed': 'bg-green-100 border-green-300',
    'on hold': 'bg-gray-100 border-gray-300'
  };

  // Border colors based on priority
  const priorityColors = {
    'low': 'border-l-4 border-l-gray-400',
    'medium': 'border-l-4 border-l-blue-500',
    'high': 'border-l-4 border-l-red-500',
    'urgent': 'border-l-4 border-l-purple-500'
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Find employee name
  const getEmployeeName = () => {
    if (task.employeeId && typeof task.employeeId === 'object') {
      return task.employeeId.name;
    }
    
    const employee = employees.find(emp => emp._id === task.employeeId);
    return employee ? employee.name : 'Unknown';
  };

  // Format estimated time
  const formatTime = (minutes) => {
    if (!minutes) return 'Not set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Handle status change with loading state
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdatingStatus(true);
    setStatusError(null);
    
    try {
      await onStatusChange(task._id, newStatus);
    } catch (error) {
      console.error('Status update failed:', error);
      setStatusError('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div
      className={`rounded-lg shadow-sm ${statusColors[task.status]} ${priorityColors[task.priority]} hover:shadow-md transition duration-200 relative overflow-hidden`}
    >
      <div className="p-4">
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-600 hover:text-blue-600 bg-white p-1 rounded-full shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-600 hover:text-red-600 bg-white p-1 rounded-full shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <h3 className="font-bold text-lg mb-2 pr-14">{task.title}</h3>
        
        <div className="mb-2">
          <p className="text-gray-700 text-sm mb-1 line-clamp-2">{task.description}</p>
          
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {task.vehicleInfo && (
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Vehicle Information:</h4>
                  <p className="text-xs text-gray-600">
                    {task.vehicleInfo.make} {task.vehicleInfo.model} {task.vehicleInfo.year}
                    {task.vehicleInfo.licensePlate && ` • License: ${task.vehicleInfo.licensePlate}`}
                  </p>
                </div>
              )}
              
              {task.customerName && (
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Customer:</h4>
                  <p className="text-xs text-gray-600">
                    {task.customerName} {task.customerPhone && `• ${task.customerPhone}`}
                  </p>
                </div>
              )}
              
              {task.notes && task.notes.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Notes:</h4>
                  <ul className="text-xs text-gray-600 space-y-1 mt-1">
                    {task.notes.slice(0, 3).map((note, index) => (
                      <li key={index} className="bg-white bg-opacity-50 p-1 rounded">
                        {note.text}
                        <span className="block text-gray-400 text-xs">
                          {new Date(note.createdAt).toLocaleString()} • {note.createdBy}
                        </span>
                      </li>
                    ))}
                    {task.notes.length > 3 && (
                      <li className="text-blue-500 italic">+ {task.notes.length - 3} more notes</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 text-xs hover:underline mt-1 focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
        
        <div className="flex flex-wrap justify-between items-center text-xs gap-2">
          <div className="flex flex-wrap gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.priority === 'high' ? 'bg-red-100 text-red-800' : 
              task.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
              task.priority === 'urgent' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.priority}
            </span>
            
            {task.serviceType && (
              <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                {task.serviceType}
              </span>
            )}
          </div>
          
          <div className="text-gray-500 text-xs flex flex-col items-end">
            <span>Assigned: {getEmployeeName()}</span>
            {task.estimatedTime && <span>Est. time: {formatTime(task.estimatedTime)}</span>}
            {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
          {statusError && (
            <div className="text-red-500 text-xs mr-2 self-center">{statusError}</div>
          )}
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdatingStatus}
            className={`text-xs border rounded-md p-1 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="on hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          {isUpdatingStatus && (
            <div className="ml-2">
              <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskNote;
