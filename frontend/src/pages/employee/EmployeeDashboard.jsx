// EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiClipboard, 
  FiCheckCircle,
  FiXCircle, 
  FiAlertCircle, 
  FiBarChart2, 
  FiBriefcase,
  FiTool, 
  FiTruck, 
  FiActivity,
  FiInfo,
  FiArrowRight,
  FiRefreshCw,
  FiPlus,
  FiFileText,
  FiHelpCircle,
  FiRotateCw
} from 'react-icons/fi';

// Component for stats card
const StatsCard = ({ icon, title, value, color, bgColor, borderColor, onClick, buttonText }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${borderColor} p-4 hover:shadow-md transition-shadow`}>
    <div className="flex items-center mb-3">
      <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
        {icon}
      </div>
      <h3 className="text-gray-700 font-medium">{title}</h3>
    </div>
    <div className="flex justify-between items-end">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {buttonText && (
        <button 
          onClick={onClick} 
          className={`text-sm ${color} hover:underline flex items-center`}
        >
          {buttonText} <FiArrowRight className="ml-1" size={14} />
        </button>
      )}
    </div>
  </div>
);

const EmployeeDashboard = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [generateLoading, setGenerateLoading] = useState(false);

  // API base URL
  const API_BASE_URL = 'http://localhost:8070/api';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/employee-dashboard`, { 
        withCredentials: true 
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate demo data for testing
  const generateDemoData = async () => {
    setGenerateLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/employee-dashboard/generate-demo-data`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Refetch data after generation
        fetchDashboardData();
      } else {
        throw new Error(response.data.message || 'Failed to generate demo data');
      }
    } catch (err) {
      console.error('Error generating demo data:', err);
      setError('Failed to generate demo data. Please try again.');
    } finally {
      setGenerateLoading(false);
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate task counts by status
  const getTaskCounts = () => {
    if (!dashboardData?.tasks) return { pending: 0, inProgress: 0, completed: 0, onHold: 0 };
    
    const counts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0
    };
    
    dashboardData.tasks.forEach(task => {
      if (task.status === 'pending') counts.pending++;
      else if (task.status === 'in progress') counts.inProgress++;
      else if (task.status === 'completed') counts.completed++;
      else if (task.status === 'on hold') counts.onHold++;
    });
    
    return counts;
  };

  // Calculate attendance summary
  const getAttendanceSummary = () => {
    if (!dashboardData?.monthAttendance) return { present: 0, late: 0, halfDay: 0, absent: 0 };
    
    const summary = {
      present: 0,
      late: 0,
      halfDay: 0,
      absent: 0
    };
    
    dashboardData.monthAttendance.forEach(record => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      else if (record.status === 'absent') summary.absent++;
    });
    
    return summary;
  };

  // Get help request counts
  const getHelpRequestCounts = () => {
    if (!dashboardData?.helpRequests) return { open: 0, inProgress: 0, resolved: 0, closed: 0 };
    
    const counts = {
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0
    };
    
    dashboardData.helpRequests.forEach(request => {
      if (request.status === 'open') counts.open++;
      else if (request.status === 'in-progress') counts.inProgress++;
      else if (request.status === 'resolved') counts.resolved++;
      else if (request.status === 'closed') counts.closed++;
    });
    
    return counts;
  };

  // Get pending leave requests count
  const getPendingLeaveCount = () => {
    if (!dashboardData?.leaveRequests) return 0;
    return dashboardData.leaveRequests.filter(req => req.status === 'pending').length;
  };

  const taskCounts = getTaskCounts();
  const attendanceSummary = getAttendanceSummary();
  const helpRequestCounts = getHelpRequestCounts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg font-medium text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {dashboardData?.employee?.name || 'Employee'}!
            </h1>
            <p className="text-gray-600">
              {dashboardData?.employee?.position || 'Staff'} • ID: {dashboardData?.employee?.employeeId || 'EMP12345'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {dashboardData?.todayAttendance ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Today's Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    dashboardData.todayAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                    dashboardData.todayAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                    dashboardData.todayAttendance.status === 'half-day' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {dashboardData.todayAttendance.status.charAt(0).toUpperCase() + dashboardData.todayAttendance.status.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dashboardData.todayAttendance.checkInTime && (
                    <span>Check In: {formatTime(dashboardData.todayAttendance.checkInTime)}</span>
                  )}
                  {dashboardData.todayAttendance.checkOutTime && (
                    <span className="ml-2">• Check Out: {formatTime(dashboardData.todayAttendance.checkOutTime)}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-200 flex items-center">
                <FiAlertCircle className="mr-2" />
                <span className="text-sm font-medium">Not checked in today</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Demo data generator button (for testing) */}
        <div className="mt-4 border-t border-blue-100 pt-4">
          <button 
            onClick={generateDemoData}
            disabled={generateLoading}
            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-md flex items-center"
          >
            {generateLoading ? (
              <>
                <FiRotateCw className="animate-spin mr-1" />
                Generating...
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-1" />
                Generate Sample Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <FiBarChart2 className="mr-2" />
            Overview
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'tasks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            <FiClipboard className="mr-2" />
            My Tasks
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'attendance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('attendance')}
          >
            <FiClock className="mr-2" />
            Attendance
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'leave' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('leave')}
          >
            <FiCalendar className="mr-2" />
            Leave
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'help' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('help')}
          >
            <FiHelpCircle className="mr-2" />
            Help Center
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              icon={<FiClipboard className="text-blue-600" />}
              title="Pending Tasks"
              value={taskCounts.pending}
              color="text-blue-600"
              bgColor="bg-blue-50"
              borderColor="border-blue-100"
              buttonText="View tasks"
              onClick={() => setActiveTab('tasks')}
            />
            <StatsCard
              icon={<FiCheckCircle className="text-green-600" />}
              title="Attendance Rate"
              value={`${Math.round((attendanceSummary.present / (dashboardData?.monthAttendance?.length || 1)) * 100)}%`}
              color="text-green-600"
              bgColor="bg-green-50"
              borderColor="border-green-100"
              buttonText="View details"
              onClick={() => setActiveTab('attendance')}
            />
            <StatsCard
              icon={<FiCalendar className="text-purple-600" />}
              title="Leave Requests"
              value={getPendingLeaveCount()}
              color="text-purple-600"
              bgColor="bg-purple-50"
              borderColor="border-purple-100"
              buttonText="Manage leave"
              onClick={() => setActiveTab('leave')}
            />
            <StatsCard
              icon={<FiHelpCircle className="text-red-600" />}
              title="Help Requests"
              value={helpRequestCounts.open}
              color="text-red-600"
              bgColor="bg-red-50"
              borderColor="border-red-100"
              buttonText="Get help"
              onClick={() => setActiveTab('help')}
            />
          </div>
          
          {/* Recent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiClipboard className="mr-2 text-blue-600" />
                  Recent Tasks
                </h2>
                <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {!dashboardData?.tasks?.length ? (
                  <div className="text-center py-6 text-gray-500">
                    No tasks assigned to you
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.tasks.slice(0, 4).map(task => (
                      <div key={task._id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{task.description.substring(0, 60)}...</div>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <FiTruck className="mr-1" />
                            {task.vehicleInfo?.make} {task.vehicleInfo?.model}
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-50 text-red-700' :
                              task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                              task.priority === 'urgent' ? 'bg-purple-50 text-purple-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Attendance Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiActivity className="mr-2 text-green-600" />
                  Attendance Overview
                </h2>
                <Link to="/attendance" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {/* Today's Status */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Today's Status</h3>
                  {dashboardData?.todayAttendance ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex flex-col items-center">
                        <span className="text-xs text-blue-700 mb-1">Status</span>
                        <span className={`text-sm font-semibold ${
                          dashboardData.todayAttendance.status === 'present' ? 'text-green-700' :
                          dashboardData.todayAttendance.status === 'late' ? 'text-yellow-700' :
                          dashboardData.todayAttendance.status === 'half-day' ? 'text-orange-700' :
                          'text-red-700'
                        }`}>
                          {dashboardData.todayAttendance.status.charAt(0).toUpperCase() + dashboardData.todayAttendance.status.slice(1)}
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100 flex flex-col items-center">
                        <span className="text-xs text-green-700 mb-1">Check In</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {dashboardData.todayAttendance.checkInTime ? formatTime(dashboardData.todayAttendance.checkInTime) : 'N/A'}
                        </span>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-100 flex flex-col items-center">
                        <span className="text-xs text-red-700 mb-1">Check Out</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {dashboardData.todayAttendance.checkOutTime ? formatTime(dashboardData.todayAttendance.checkOutTime) : 'Not yet'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center text-red-700">
                      <FiAlertCircle className="inline-block mr-1" />
                      Not checked in today
                    </div>
                  )}
                </div>
                
                {/* Recent Attendance */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Records</h3>
                  {!dashboardData?.monthAttendance?.length ? (
                    <div className="text-center py-4 text-gray-500">
                      No attendance records found
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dashboardData.monthAttendance.slice(0, 4).map(record => (
                        <div key={record._id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                            record.status === 'present' ? 'bg-green-100 text-green-700' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                            record.status === 'half-day' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {record.status === 'present' ? <FiCheckCircle /> :
                             record.status === 'late' ? <FiClock /> :
                             record.status === 'half-day' ? <FiAlertCircle /> :
                             <FiXCircle />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{formatDate(record.createdAt)}</p>
                            <p className="text-xs text-gray-500">
                              {record.checkInTime && `In: ${formatTime(record.checkInTime)}`}
                              {record.checkInTime && record.checkOutTime && ' • '}
                              {record.checkOutTime && `Out: ${formatTime(record.checkOutTime)}`}
                            </p>
                          </div>
                          <div className="ml-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                              record.status === 'half-day' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Leave and Help Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiCalendar className="mr-2 text-purple-600" />
                  Leave Requests
                </h2>
                <Link to="/leave-requests" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {/* Leave Balance */}
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dashboardData?.leaveStats && Object.entries(dashboardData.leaveStats).map(([type, stats]) => (
                    <div key={type} className={`p-3 rounded-lg ${
                      type === 'annual' ? 'bg-blue-50 border border-blue-100' :
                      type === 'sick' ? 'bg-red-50 border border-red-100' :
                      type === 'casual' ? 'bg-green-50 border border-green-100' :
                      'bg-purple-50 border border-purple-100'
                    } text-center`}>
                      <p className="text-xs capitalize mb-1 text-gray-700">{type}</p>
                      <p className="text-sm font-semibold">
                        {stats.remaining} / {stats.total}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Recent Leave Requests */}
                {!dashboardData?.leaveRequests?.length ? (
                  <div className="text-center py-6 text-gray-500">
                    No leave requests found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.leaveRequests.slice(0, 3).map(leave => (
                      <div key={leave._id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-800 capitalize">{leave.leaveType} Leave</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatDate(leave.startDate)} to {formatDate(leave.endDate)} ({leave.totalDays} {leave.totalDays > 1 ? 'days' : 'day'})
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          Reason: {leave.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Request Leave Button */}
                <div className="mt-4 text-center">
                  <Link to="/leave-requests/new" className="inline-flex items-center text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors">
                    <FiPlus className="mr-1" />
                    Request Leave
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Help Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiHelpCircle className="mr-2 text-red-600" />
                  Help Center
                </h2>
                <Link to="/help-center" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {/* Help Request Stats */}
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-center">
                    <p className="text-xs text-yellow-700 mb-1">Open</p>
                    <p className="text-sm font-semibold">{helpRequestCounts.open}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-center">
                    <p className="text-xs text-blue-700 mb-1">In Progress</p>
                    <p className="text-sm font-semibold">{helpRequestCounts.inProgress}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-center">
                    <p className="text-xs text-green-700 mb-1">Resolved</p>
                    <p className="text-sm font-semibold">{helpRequestCounts.resolved}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <p className="text-xs text-gray-700 mb-1">Closed</p>
                    <p className="text-sm font-semibold">{helpRequestCounts.closed}</p>
                  </div>
                </div>
                
                {/* Recent Help Requests */}
                {!dashboardData?.helpRequests?.length ? (
                  <div className="text-center py-6 text-gray-500">
                    No help requests found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.helpRequests.slice(0, 3).map(request => (
                      <div key={request._id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-800">{request.title}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {request.description}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {formatDate(request.createdAt)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            request.priority === 'high' ? 'bg-red-50 text-red-700' :
                            request.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {request.priority} priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Get Help Button */}
                <div className="mt-4 text-center">
                  <Link to="/help-center/new" className="inline-flex items-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors">
                    <FiPlus className="mr-1" />
                    Create Help Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tasks Tab Content */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">My Tasks</h2>
            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Go to Task Manager <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          {/* Task Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
              <p className="text-yellow-800 text-2xl font-bold">{taskCounts.pending}</p>
              <p className="text-yellow-700 text-sm">Pending</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
              <p className="text-blue-800 text-2xl font-bold">{taskCounts.inProgress}</p>
              <p className="text-blue-700 text-sm">In Progress</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
              <p className="text-green-800 text-2xl font-bold">{taskCounts.completed}</p>
              <p className="text-green-700 text-sm">Completed</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-800 text-2xl font-bold">{taskCounts.onHold}</p>
              <p className="text-gray-700 text-sm">On Hold</p>
            </div>
          </div>
          
          {/* Task List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">All Tasks</h3>
            </div>
            {!dashboardData?.tasks?.length ? (
              <div className="text-center py-8 text-gray-500">
                <FiFileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-lg font-medium text-gray-600 mb-1">No tasks found</p>
                <p className="text-sm text-gray-500">You don't have any tasks assigned yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.tasks.map(task => (
                      <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500">{task.customerName || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            task.priority === 'urgent' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {task.serviceType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Add other tab contents (attendance, leave, help center) similarly */}
    </div>
  );
};

export default EmployeeDashboard;
