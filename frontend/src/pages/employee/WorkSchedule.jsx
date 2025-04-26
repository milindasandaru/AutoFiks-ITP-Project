import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeTaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const navigate = useNavigate();

  // Base URL for API requests
  const API_BASE_URL = 'http://localhost:8070/api';

  // Status color styles
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'on hold': 'bg-gray-100 text-gray-800'
  };

  // Priority color styles
  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-red-100 text-red-800',
    'urgent': 'bg-purple-100 text-purple-800'
  };

  // Fetch employee profile and tasks
  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        // First get the employee profile using the authentication token
        const profileResponse = await axios.get(`${API_BASE_URL}/employees/profile`, {
          withCredentials: true // Important to send the auth cookie
        });
        
        if (!profileResponse.data.success) {
          throw new Error(profileResponse.data.message || 'Failed to fetch employee profile');
        }
        
        const employeeData = profileResponse.data.employee;
        setEmployeeInfo(employeeData);
        
        // Then fetch tasks for this employee
        const tasksResponse = await axios.get(
          `${API_BASE_URL}/tasks/employee/${employeeData._id}`,
          { withCredentials: true }
        );
        
        // Ensure tasks is always an array
        const tasksData = Array.isArray(tasksResponse.data) ? tasksResponse.data : 
                         (tasksResponse.data && tasksResponse.data.tasks ? tasksResponse.data.tasks : []);
        
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        
        // Handle authentication errors
        if (err.response && err.response.status === 401) {
          setError('Authentication required. Please log in again.');
          // Redirect to login after a short delay
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(err.message || 'Failed to load data. Please try again.');
        }
        
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [API_BASE_URL, navigate]);

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Check status filter
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    
    // Check priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    
    // Check search term
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Task status update handler
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}/status`, 
        { 
          status: newStatus,
          note: `Status updated to ${newStatus} by employee`
        },
        { withCredentials: true }
      );
      
      // Update local state with the updated task
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg font-semibold text-gray-700">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            {employeeInfo && (
              <p className="text-gray-600 mt-1">
                Welcome, {employeeInfo.name} ({employeeInfo.position})
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">My Tasks:</span>
            <span className="text-sm font-bold text-gray-700">{tasks.length}</span>
            
            <div className="ml-6 flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">Pending:</span>
              <span className="text-sm font-bold text-yellow-600">
                {tasks.filter(task => task.status === 'pending').length}
              </span>
            </div>
            
            <div className="ml-6 flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">In Progress:</span>
              <span className="text-sm font-bold text-blue-600">
                {tasks.filter(task => task.status === 'in progress').length}
              </span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="on hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                id="priority-filter"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Tasks Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-gray-600">No tasks found matching your criteria</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task._id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                  task.priority === 'high' ? 'border-red-500' : 
                  task.priority === 'medium' ? 'border-blue-500' : 
                  task.priority === 'urgent' ? 'border-purple-500' :
                  'border-gray-500'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    
                    {task.serviceType && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {task.serviceType}
                      </span>
                    )}
                  </div>
                  
                  {task.dueDate && (
                    <div className="mb-3 text-sm">
                      <span className="font-medium text-gray-700">Due Date: </span>
                      <span className={`${
                        new Date(task.dueDate) < new Date() && task.status !== 'completed' 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-600'
                      }`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {task.estimatedTime && (
                    <div className="mb-3 text-sm">
                      <span className="font-medium text-gray-700">Estimated Time: </span>
                      <span className="text-gray-600">
                        {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                      </span>
                    </div>
                  )}
                  
                  {/* Customer Info */}
                  {task.customerName && (
                    <div className="mb-3 text-sm">
                      <span className="font-medium text-gray-700">Customer: </span>
                      <span className="text-gray-600">
                        {task.customerName} {task.customerPhone && `(${task.customerPhone})`}
                      </span>
                    </div>
                  )}
                  
                  {/* Vehicle Info */}
                  {task.vehicleInfo && (
                    <div className="mb-3 text-sm">
                      <span className="font-medium text-gray-700">Vehicle: </span>
                      <span className="text-gray-600">
                        {task.vehicleInfo.make} {task.vehicleInfo.model} {task.vehicleInfo.year}
                        {task.vehicleInfo.licensePlate && ` (${task.vehicleInfo.licensePlate})`}
                      </span>
                    </div>
                  )}
                  
                  {/* Status Update */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <label htmlFor={`status-${task._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Update Status:
                    </label>
                    <select
                      id={`status-${task._id}`}
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="on hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                {/* Notes Section */}
                {task.notes && task.notes.length > 0 && (
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                      {task.notes.slice(0, 3).map((note, index) => (
                        <li key={index} className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                          {note.text}
                          <div className="text-gray-400 text-xs mt-1">
                            {new Date(note.createdAt).toLocaleString()} • {note.createdBy}
                          </div>
                        </li>
                      ))}
                      {task.notes.length > 3 && (
                        <li className="text-xs text-blue-500 italic">+ {task.notes.length - 3} more notes</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Task Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Task Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Total Tasks</h4>
              <p className="text-2xl font-bold text-blue-800">{tasks.length}</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <h4 className="text-sm font-medium text-yellow-700 mb-2">Pending</h4>
              <p className="text-2xl font-bold text-yellow-800">
                {tasks.filter(task => task.status === 'pending').length}
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h4 className="text-sm font-medium text-indigo-700 mb-2">In Progress</h4>
              <p className="text-2xl font-bold text-indigo-800">
                {tasks.filter(task => task.status === 'in progress').length}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h4 className="text-sm font-medium text-green-700 mb-2">Completed</h4>
              <p className="text-2xl font-bold text-green-800">
                {tasks.filter(task => task.status === 'completed').length}
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Status Breakdown</h4>
              <div className="space-y-2">
                {['pending', 'in progress', 'on hold', 'completed'].map(status => {
                  const count = tasks.filter(task => task.status === status).length;
                  const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                  
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium capitalize">{status}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'in progress' ? 'bg-blue-500' :
                            status === 'on hold' ? 'bg-gray-500' :
                            'bg-green-500'
                          }`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Priority Breakdown</h4>
              <div className="space-y-2">
                {['low', 'medium', 'high', 'urgent'].map(priority => {
                  const count = tasks.filter(task => task.priority === priority).length;
                  const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                  
                  return (
                    <div key={priority}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium capitalize">{priority}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            priority === 'low' ? 'bg-gray-500' :
                            priority === 'medium' ? 'bg-blue-500' :
                            priority === 'high' ? 'bg-red-500' :
                            'bg-purple-500'
                          }`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskDashboard;
