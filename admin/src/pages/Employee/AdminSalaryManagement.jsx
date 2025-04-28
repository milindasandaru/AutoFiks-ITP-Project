import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSalary, setActiveSalary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  // Base URL for API requests
  const API_BASE_URL = 'http://localhost:8070/api';

  // Fetch employees and salaries
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch employees
        // Fetch employees
        const employeesResponse = await axios.get(
            `${API_BASE_URL}/employees`,
            { withCredentials: true }
          );
          
          // The API directly returns the array of employees
          if (Array.isArray(employeesResponse.data)) {
            setEmployees(employeesResponse.data);
          } else {
            // Fallback in case response format changes in the future
            console.warn('Unexpected employees response format:', employeesResponse.data);
            setEmployees([]);
                }
        
        // Fetch salaries
        const salariesResponse = await axios.get(
          `${API_BASE_URL}/salary/all`,
          { withCredentials: true }
        );
        
        if (salariesResponse.data.success) {
          setSalaries(salariesResponse.data.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  // Fetch salary details
  const fetchSalaryDetails = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/salary/detail/${id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setActiveSalary(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to load salary details');
      }
    } catch (err) {
      console.error('Error fetching salary details:', err);
      setError(err.message || 'Failed to load salary details. Please try again.');
    }
  };

  // Generate salary
  const handleGenerateSalary = async () => {
    if (!selectedEmployee || !dateRange.startDate || !dateRange.endDate) {
      setGenerationError('Please select an employee and date range');
      return;
    }
    
    setGenerating(true);
    setGenerationError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/salary/generate`,
        {
          employeeId: selectedEmployee,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          customLabel: `${new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} Salary`
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Add new salary to the list
        setSalaries([response.data.salary, ...salaries]);
        setSelectedEmployee('');
        setDateRange({ startDate: '', endDate: '' });
        setShowGenerateForm(false);
        // Show the newly generated salary details
        setActiveSalary(response.data.salary);
      } else {
        throw new Error(response.data.message || 'Failed to generate salary');
      }
    } catch (err) {
      console.error('Error generating salary:', err);
      setGenerationError(err.response?.data?.message || err.message || 'Failed to generate salary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Generate test data
  const handleGenerateTestData = async () => {
    if (!selectedEmployee) {
      setGenerationError('Please select an employee');
      return;
    }
    
    setGenerating(true);
    setGenerationError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/salary/generate-test-data`,
        {
          employeeId: selectedEmployee,
          days: 7 // One week of test data
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Add new salary to the list
        setSalaries([response.data.salary, ...salaries]);
        setSelectedEmployee('');
        setShowGenerateForm(false);
        // Show the newly generated salary details
        setActiveSalary(response.data.salary);
      } else {
        throw new Error(response.data.message || 'Failed to generate test data');
      }
    } catch (err) {
      console.error('Error generating test data:', err);
      setGenerationError(err.response?.data?.message || err.message || 'Failed to generate test data. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Update salary status
  const handleUpdateStatus = async (newStatus) => {
    if (!activeSalary) return;
    
    setUpdatingStatus(true);
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/salary/${activeSalary._id}/status`,
        {
          status: newStatus,
          paymentDate: newStatus === 'paid' ? new Date() : null
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update salary in the list
        setSalaries(salaries.map(salary => 
          salary._id === activeSalary._id ? response.data.data : salary
        ));
        // Update active salary
        setActiveSalary(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to update salary status');
      }
    } catch (err) {
      console.error('Error updating salary status:', err);
      setError(err.message || 'Failed to update salary status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg font-semibold text-gray-700">Loading salary data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setShowGenerateForm(!showGenerateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
            >
              {showGenerateForm ? 'Cancel' : 'Generate Salary'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {/* Generate Salary Form */}
        {showGenerateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Generate Salary</h2>
            
            {generationError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p>{generationError}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  id="employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.position})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleGenerateTestData}
                disabled={generating || !selectedEmployee}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : "Generate Test Data (1 Week)"}
              </button>
              
              <button
                onClick={handleGenerateSalary}
                disabled={generating || !selectedEmployee || !dateRange.startDate || !dateRange.endDate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : "Generate Salary"}
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Salary List */}
          <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeSalary ? 'hidden md:block md:col-span-1' : 'col-span-3'}`}>
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800">Salary Records</h2>
            </div>
            
            {salaries.length === 0 ? (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="mt-4 text-gray-600">No salary records available yet.</p>
                <button
                  onClick={() => setShowGenerateForm(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Generate First Salary
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {salaries.map((salary) => (
                  <li 
                    key={salary._id} 
                    className={`p-4 hover:bg-gray-50 transition duration-150 cursor-pointer ${activeSalary && activeSalary._id === salary._id ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchSalaryDetails(salary._id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {salary.employeeId?.name || 'Employee'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {salary.period.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(salary.period.startDate)} - {formatDate(salary.period.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{formatCurrency(salary.calculations.netSalary)}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          salary.status === 'finalized' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Salary Details */}
          {activeSalary && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
              <div className="p-4 md:flex md:justify-between md:items-center bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-gray-800">Salary Details</h2>
                <div className="mt-2 md:mt-0 flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveSalary(null)}
                    className="text-gray-600 hover:text-gray-800 md:hidden"
                  >
                    ← Back to list
                  </button>
                  
                  {/* Status update buttons for admin */}
                  {activeSalary.status !== 'paid' && (
                    <div className="ml-auto flex space-x-2">
                      {activeSalary.status === 'draft' && (
                        <button
                          onClick={() => handleUpdateStatus('finalized')}
                          disabled={updatingStatus}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition duration-200 disabled:opacity-50"
                        >
                          Finalize
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus('paid')}
                        disabled={updatingStatus}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded transition duration-200 disabled:opacity-50"
                      >
                        Mark as Paid
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      {activeSalary.employeeId?.name || 'Employee'} - {activeSalary.period.label}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {formatDate(activeSalary.period.startDate)} - {formatDate(activeSalary.period.endDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      activeSalary.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      activeSalary.status === 'finalized' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activeSalary.status.charAt(0).toUpperCase() + activeSalary.status.slice(1)}
                    </span>
                    {activeSalary.paymentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Paid on: {formatDate(activeSalary.paymentDate)}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Salary Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Basic Salary</p>
                      <p className="text-lg font-semibold text-gray-800">{formatCurrency(activeSalary.basicSalary)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Deductions</p>
                      <p className="text-lg font-semibold text-red-600">
                        -{formatCurrency(
                          activeSalary.calculations.deductions.absences +
                          activeSalary.calculations.deductions.leaves +
                          activeSalary.calculations.deductions.tax +
                          activeSalary.calculations.deductions.other
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Salary</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(activeSalary.calculations.netSalary)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Attendance Summary */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Attendance Summary</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Working Days</p>
                        <p className="text-lg font-semibold text-gray-800">{activeSalary.workingDays.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Present</p>
                        <p className="text-lg font-semibold text-green-600">{activeSalary.workingDays.present}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Half Day</p>
                        <p className="text-lg font-semibold text-yellow-600">{activeSalary.workingDays.halfDay}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Absent</p>
                        <p className="text-lg font-semibold text-red-600">{activeSalary.workingDays.absent}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Late</p>
                        <p className="text-lg font-semibold text-orange-600">{activeSalary.workingDays.late}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Leave Summary */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Leave Summary</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total Leave</p>
                        <p className="text-lg font-semibold text-gray-800">{activeSalary.workingDays.leave.approved}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Sick</p>
                        <p className="text-lg font-semibold text-blue-600">{activeSalary.workingDays.leave.sick}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Casual</p>
                        <p className="text-lg font-semibold text-purple-600">{activeSalary.workingDays.leave.casual}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Annual</p>
                        <p className="text-lg font-semibold text-green-600">{activeSalary.workingDays.leave.annual}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Other</p>
                        <p className="text-lg font-semibold text-gray-600">{activeSalary.workingDays.leave.other}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Salary Breakdown */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Salary Breakdown</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      <div className="p-4 flex justify-between">
                        <p className="text-gray-700">Basic Salary</p>
                        <p className="font-medium text-gray-900">{formatCurrency(activeSalary.calculations.basicPayment)}</p>
                      </div>
                      
                      <div className="p-4 bg-red-50">
                        <p className="text-gray-700 font-medium mb-2">Deductions</p>
                        
                        <div className="ml-4 space-y-2">
                          <div className="flex justify-between">
                            <p className="text-gray-600">Absent/Late/Half-day</p>
                            <p className="font-medium text-red-600">-{formatCurrency(activeSalary.calculations.deductions.absences)}</p>
                          </div>
                          
                          <div className="flex justify-between">
                            <p className="text-gray-600">Tax</p>
                            <p className="font-medium text-red-600">-{formatCurrency(activeSalary.calculations.deductions.tax)}</p>
                          </div>
                          
                          {activeSalary.calculations.deductions.other > 0 && (
                            <div className="flex justify-between">
                              <p className="text-gray-600">Other Deductions</p>
                              <p className="font-medium text-red-600">-{formatCurrency(activeSalary.calculations.deductions.other)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 flex justify-between font-bold">
                        <p className="text-gray-800">Total Net Salary</p>
                        <p className="text-green-600">{formatCurrency(activeSalary.calculations.netSalary)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Working Hours */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Working Hours</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Hours Worked</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {activeSalary.workingHours.total.toFixed(2)} hours
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Daily Average</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {(activeSalary.workingHours.total / (activeSalary.workingDays.present + activeSalary.workingDays.halfDay)).toFixed(2)} hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Admin Actions */}
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Admin Actions</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-200 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-6 8v4h6v-4H7z" clipRule="evenodd" />
                      </svg>
                      Print
                    </button>
                    
                    {activeSalary.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus('finalized')}
                          disabled={updatingStatus}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 inline-flex items-center disabled:opacity-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Finalize
                        </button>
                      </>
                    )}
                    
                    {activeSalary.status !== 'paid' && (
                      <button
                        onClick={() => handleUpdateStatus('paid')}
                        disabled={updatingStatus}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 inline-flex items-center disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Additional Notes */}
                {activeSalary.notes && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-700">{activeSalary.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSalaryManagement;

                    
