import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaveRequestList = ({ refreshTrigger }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
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
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:8070/api/leave-requests/my-requests',
          { withCredentials: true }
        );
        
        setLeaveRequests(response.data.leaveRequests);
        setError(null);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setError('Failed to load your leave requests. Please try again.');
        toast.error('Failed to load leave requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaveRequests();
  }, [refreshTrigger]);
  
  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }
    
    try {
      await axios.delete(
        `http://localhost:8070/api/leave-requests/${id}`,
        { withCredentials: true }
      );
      
      // Remove the deleted request from state
      setLeaveRequests(prev => prev.filter(request => request._id !== id));
      toast.success('Leave request deleted successfully');
    } catch (error) {
      console.error('Error deleting leave request:', error);
      toast.error(error.response?.data?.message || 'Failed to delete leave request');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
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
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  if (leaveRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">You haven't submitted any leave requests yet.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {leaveTypeLabels[request.leaveType]}
                  </div>
                  <div className="text-xs text-gray-500">
                    Requested on {formatDate(request.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[request.status]}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {request.adminRemarks || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleDeleteRequest(request._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Leave Request Details
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Leave Information</h4>
                  <p className="text-sm text-gray-900 mb-2">
                    <span className="font-medium">Type:</span> {leaveTypeLabels[selectedRequest.leaveType]}
                  </p>
                  <p className="text-sm text-gray-900 mb-2">
                    <span className="font-medium">Period:</span> {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Duration:</span> {selectedRequest.totalDays} {selectedRequest.totalDays === 1 ? 'day' : 'days'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <span className={`px-3 py-1 inline-flex text-sm rounded-full font-semibold ${statusColors[selectedRequest.status]}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    Requested on {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Reason for Leave</h4>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                  {selectedRequest.reason}
                </p>
              </div>

              {selectedRequest.adminRemarks && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Admin Remarks</h4>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedRequest.adminRemarks}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;
