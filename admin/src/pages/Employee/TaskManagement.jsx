import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskNote from '../../components/TaskNote';
import TaskModal from '../../components/TaskModal';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    employeeId: '',
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      vin: ''
    },
    serviceType: 'maintenance',
    customerName: '',
    customerPhone: '',
    estimatedTime: 60,
    dueDate: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Base URL for API requests
  const API_BASE_URL = 'http://localhost:8070/api';

  // Fetch employees separately to ensure we have them
  useEffect(() => {
    const fetchEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/employees`);
        console.log("Employees data:", response.data);
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setEmployees(response.data.data);
        } else {
          console.warn("Unexpected employee data format:", response.data);
          setEmployees([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please check if the employee API is working.");
        setEmployees([]);
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
  }, [API_BASE_URL]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        console.log("Tasks data:", response.data);
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setTasks(response.data.data);
        } else {
          console.warn("Unexpected task data format:", response.data);
          setTasks([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [API_BASE_URL]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested vehicleInfo fields
    if (name.startsWith('vehicleInfo.')) {
      const field = name.split('.')[1];
      setCurrentTask({
        ...currentTask,
        vehicleInfo: {
          ...currentTask.vehicleInfo,
          [field]: value
        }
      });
    } else {
      setCurrentTask({
        ...currentTask,
        [name]: value
      });
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setCurrentTask({
      ...currentTask,
      dueDate: date
    });
  };

  // Open modal for creating a new task
  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      employeeId: employees.length > 0 ? employees[0]._id : '',
      vehicleInfo: {
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        vin: ''
      },
      serviceType: 'maintenance',
      customerName: '',
      customerPhone: '',
      estimatedTime: 60,
      dueDate: null
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a task
  const openEditModal = (task) => {
    setIsEditing(true);
    setCurrentTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      employeeId: task.employeeId._id || task.employeeId,
      vehicleInfo: task.vehicleInfo || {
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        vin: ''
      },
      serviceType: task.serviceType || 'maintenance',
      customerName: task.customerName || '',
      customerPhone: task.customerPhone || '',
      estimatedTime: task.estimatedTime || 60,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      notes: task.notes || []
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  // Save task (create or update)
  const saveTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      console.log("Saving task with data:", currentTask);
      
      // Validate required fields
      if (!currentTask.title || !currentTask.description || !currentTask.employeeId) {
        setError("Title, description, and employee are required fields");
        setSubmitting(false);
        return;
      }
      
      let response;
      
      if (isEditing) {
        console.log(`Updating task ${currentTask._id}`);
        response = await axios.put(`${API_BASE_URL}/tasks/${currentTask._id}`, currentTask);
        console.log("Update response:", response.data);
        setTasks(tasks.map(task => task._id === currentTask._id ? response.data : task));
      } else {
        console.log("Creating new task");
        response = await axios.post(`${API_BASE_URL}/tasks`, currentTask);
        console.log("Create response:", response.data);
        setTasks([...tasks, response.data]);
      }
      
      closeModal();
      
      // Refresh tasks after creation/update
      const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`);
      if (Array.isArray(tasksResponse.data)) {
        setTasks(tasksResponse.data);
      } else if (tasksResponse.data && Array.isArray(tasksResponse.data.data)) {
        setTasks(tasksResponse.data.data);
      }
      
    } catch (err) {
      console.error('Error saving task:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error data:", err.response.data);
        console.error("Response error status:", err.response.status);
        setError(`Server error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Request error:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  // Update task status
  // Update task status
const updateTaskStatus = async (id, newStatus) => {
  try {
    // Show loading indicator or disable UI elements if needed
    
    const response = await axios.patch(`${API_BASE_URL}/tasks/${id}/status`, { 
      status: newStatus 
    });
    
    console.log("Status update response:", response.data);
    
    // Update local state with the updated task
    setTasks(tasks.map(task => task._id === id ? response.data : task));
    
    return response.data; // Return the updated task
  } catch (err) {
    console.error('Error updating task status:', err);
    
    // More detailed error handling
    let errorMessage = 'Failed to update task status. Please try again.';
    
    if (err.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error("Response error data:", err.response.data);
      console.error("Response error status:", err.response.status);
      errorMessage = `Server error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`;
    } else if (err.request) {
      // The request was made but no response was received
      console.error("Request error:", err.request);
      errorMessage = "No response from server. Please check your connection.";
    }
    
    // Set error state if you have one
    setError(errorMessage);
    
    // Re-throw the error so the component can handle it
    throw new Error(errorMessage);
  }
}; 

  // Filter tasks
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  // Group tasks by status
  const groupedTasks = {
    'pending': filteredTasks.filter(task => task.status === 'pending'),
    'in progress': filteredTasks.filter(task => task.status === 'in progress'),
    'completed': filteredTasks.filter(task => task.status === 'completed'),
    'on hold': filteredTasks.filter(task => task.status === 'on hold')
  };

  if (loading && employeesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold p-8 bg-white rounded-lg shadow-md flex items-center space-x-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading task board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-gray-800">Vehicle Service Task Board</h1>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="filter" className="mr-2 text-gray-600">Filter:</label>
              <select 
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on hold">On Hold</option>
              </select>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 shadow-md flex items-center space-x-2"
              disabled={employees.length === 0}
              title={employees.length === 0 ? "Please add employees first" : "Create new task"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>New Service Task</span>
            </button>
          </div>
        </div>

        {employees.length === 0 && !employeesLoading && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>No employees found. Please add employees before creating tasks.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`p-4 ${
                status === 'pending' ? 'bg-yellow-50' : 
                status === 'in progress' ? 'bg-blue-50' : 
                status === 'completed' ? 'bg-green-50' : 
                'bg-gray-50'
              }`}>
                <h2 className="text-lg font-semibold capitalize flex items-center">
                  {status === 'pending' && (
                    <svg className="h-5 w-5 mr-2 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  )}
                  {status === 'in progress' && (
                    <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  {status === 'completed' && (
                    <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {status === 'on hold' && (
                    <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {status} <span className="ml-2 text-sm font-normal text-gray-500">({statusTasks.length})</span>
                </h2>
              </div>
              
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-4">
                  {statusTasks.length === 0 ? (
                    <div className="text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No tasks in this category</p>
                    </div>
                  ) : (
                    statusTasks.map(task => (
                      <TaskNote 
                        key={task._id}
                        task={task}
                        onEdit={openEditModal}
                        onDelete={deleteTask}
                        onStatusChange={updateTaskStatus}
                        employees={employees}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          task={currentTask}
          isEditing={isEditing}
          onChange={handleInputChange}
          onDateChange={handleDateChange}
          onSubmit={saveTask}
          employees={employees}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  );
};

export default TaskBoard;
