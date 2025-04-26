import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaveRequestsAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [processingId, setProcessingId] = useState(null);
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const leaveTypeLabels = {
    sick: 'Sick Leave',
    casual: 'Casual Leave',
    annual: 'Annual Leave',
    other: 'Other Leave'
  };
  
  useEffect(() => {
    fetchLeaveRequests();
  }, []);
  
  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:8070/api/leave-requests',
        { withCredentials: true }
      );
      
      setLeaveRequests(response.data.leaveRequests);
      setError(null);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Failed to load leave requests. Please try again.');
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (id, status) => {
    if (!adminRemarks.trim() && status === 'rejected') {
      toast.warning('Please provide remarks for rejection');
      return;
    }
    
    setProcessingId(id);
    
    try {
      const response = await axios.patch(
        `http://localhost:8070/api/leave-requests/${id}/status`,
        { 
          status, 
          adminRemarks: adminRemarks.trim() || `Request ${status} by admin`
        },
        { withCredentials: true }
      );
      
      // Update the leave request in the state
      setLeaveRequests(prev => 
        prev.map(req => req._id === id ? response.data.leaveRequest : req)
      );
      
      toast.success(`Leave request ${status} successfully`);
      setSelectedRequest(null);
      setAdminRemarks('');
    } catch (error) {
      console.error('Error updating leave request status:', error);
      toast.error(error.response?.data?.message || 'Failed to update leave request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter leave requests based on status and search term
  const filteredRequests = leaveRequests.filter(request => {
    // Filter by status
    if (filterStatus !== 'all' && request.status !== filterStatus) {
      return false;
    }
    
    // Filter by search term (employee name or ID)
    if (searchTerm) {
      const employeeName = request.employeeId?.name?.toLowerCase() || '';
      const employeeId = request.employeeId?.employeeId?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return employeeName.includes(searchLower) || employeeId.includes(searchLower);
    }
    
    return true;
  });
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading leave requests...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchLeaveRequests}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Manage Leave Requests</h2>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/3">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="md:w-2/3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Employee
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name or ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Leave Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No leave requests found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.employeeId?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.employeeId?.employeeId || 'No ID'} • {request.employeeId?.position || 'No Position'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {leaveTypeLabels[request.leaveType]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'} • Requested on {formatDate(request.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[request.status]}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'pending' ? (
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={processingId === request._id}
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Leave Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">
                  Leave Request Details
                </h3>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminRemarks('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Employee Information</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Name:</span> {selectedRequest.employeeId?.name || 'Unknown'}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">ID:</span> {selectedRequest.employeeId?.employeeId || 'No ID'}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Position:</span> {selectedRequest.employeeId?.position || 'No Position'}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Email:</span> {selectedRequest.employeeId?.mail || 'No Email'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Leave Information</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Type:</span> {leaveTypeLabels[selectedRequest.leaveType]}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Period:</span> {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Duration:</span> {selectedRequest.totalDays} {selectedRequest.totalDays === 1 ? 'day' : 'days'}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${statusColors[selectedRequest.status]}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Reason for Leave</h4>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                  {selectedRequest.reason}
                </p>
              </div>
              
              {selectedRequest.documents && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Supporting Documents</h4>
                  <a 
                    href={selectedRequest.documents} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Document
                  </a>
                </div>
              )}
              
              {selectedRequest.adminRemarks && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Admin Remarks</h4>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedRequest.adminRemarks}
                  </p>
                </div>
              )}
              
              {selectedRequest.status === 'pending' && (
                <div className="mt-6">
                  <label htmlFor="admin-remarks" className="block text-sm font-medium text-gray-700">
                    Admin Remarks
                  </label>
                  <textarea
                    id="admin-remarks"
                    rows="3"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add your comments or reasons for approval/rejection"
                  ></textarea>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminRemarks('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest._id, 'rejected')}
                      disabled={processingId === selectedRequest._id}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                        processingId === selectedRequest._id ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingId === selectedRequest._id ? 'Processing...' : 'Reject'}
                    </button>
                    
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest._id, 'approved')}
                      disabled={processingId === selectedRequest._id}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        processingId === selectedRequest._id ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingId === selectedRequest._id ? 'Processing...' : 'Approve'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsAdmin;
