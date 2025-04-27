import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHelpRequests = () => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [newResponse, setNewResponse] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Base URL for API requests
  const API_BASE_URL = 'http://localhost:8070/api';

  // Category and priority styling
  const categoryColors = {
    'technical': 'bg-blue-100 text-blue-800',
    'hr': 'bg-purple-100 text-purple-800',
    'operations': 'bg-green-100 text-green-800',
    'other': 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    'open': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800'
  };

  // Fetch all help requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/help-requests`,
          { withCredentials: true }
        );
        
        // Ensure help requests is always an array
        const requestsData = Array.isArray(response.data) ? response.data : [];
        
        setHelpRequests(requestsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching help requests:', err);
        setError(err.message || 'Failed to load help requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [API_BASE_URL]);

  // Fetch request details
  const fetchRequestDetails = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/help-requests/details/${id}`,
        { withCredentials: true }
      );
      
      setActiveRequest(response.data);
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to load request details. Please try again.');
    }
  };

  // Submit response to help request
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.trim() || !activeRequest) return;
    
    setSubmittingResponse(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/help-requests/${activeRequest._id}/responses`,
        { 
          text: newResponse,
          userName: 'Admin',
          isAdmin: true
        },
        { withCredentials: true }
      );
      
      // Update the active request with the new response
      setActiveRequest(response.data);
      
      // Also update the request in the list
      setHelpRequests(helpRequests.map(req => 
        req._id === activeRequest._id ? response.data : req
      ));
      
      setNewResponse('');
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit your response. Please try again.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Update request status
  const updateRequestStatus = async (status) => {
    if (!activeRequest) return;
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/help-requests/${activeRequest._id}/status`,
        { 
          status,
          isAdmin: true 
        },
        { withCredentials: true }
      );
      
      // Update the active request with the new status
      setActiveRequest(response.data);
      
      // Also update the request in the list
      setHelpRequests(helpRequests.map(req => 
        req._id === activeRequest._id ? response.data : req
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  // Filter help requests based on status
  const filteredRequests = helpRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  // Search functionality
  const searchedRequests = filteredRequests.filter(request => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      request.title.toLowerCase().includes(searchLower) ||
      request.description.toLowerCase().includes(searchLower) ||
      (request.employeeId?.name && request.employeeId.name.toLowerCase().includes(searchLower))
    );
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg font-semibold text-gray-700">Loading help requests...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Help Request Management</h1>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Help Requests List */}
          <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeRequest ? 'hidden md:block md:col-span-1' : 'col-span-3'}`}>
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex flex-col md:flex-row justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Help Requests</h2>
                <div className="flex space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            {helpRequests.length === 0 ? (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-600">No help requests available.</p>
              </div>
            ) : searchedRequests.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No requests match your search criteria.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {searchedRequests.map((request) => (
                  <li 
                    key={request._id} 
                    className={`p-4 hover:bg-gray-50 transition duration-150 cursor-pointer ${activeRequest && activeRequest._id === request._id ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchRequestDetails(request._id)}
                  >
                    <div className="flex flex-col mb-2">
                      <h3 className="text-lg font-medium text-gray-800">{request.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
                          {request.status.replace('-', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[request.category]}`}>
                          {request.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                    
                    <div className="text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Created: {formatDate(request.createdAt)}</span>
                        <span>By: {request.employeeId?.name || 'Unknown'}</span>
                      </div>
                      
                      {request.responses && request.responses.length > 0 && (
                        <div className="mt-2 text-xs">
                          <span className="text-blue-600">{request.responses.length} response{request.responses.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Help Request Details */}
          {activeRequest && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
              <div className="p-4 md:flex md:justify-between md:items-center bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-gray-800">Request Details</h2>
                <button 
                  onClick={() => setActiveRequest(null)}
                  className="mt-2 md:mt-0 text-gray-600 hover:text-gray-800 md:hidden"
                >
                  ← Back to list
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-800">{activeRequest.title}</h1>
                  <div className="mt-3 md:mt-0 flex space-x-2">
                    {activeRequest.status !== 'closed' && (
                      <div className="relative group">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          Update Status
                        </button>
                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                          {activeRequest.status !== 'open' && (
                            <button 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => updateRequestStatus('open')}
                            >
                              Mark as Open
                            </button>
                          )}
                          {activeRequest.status !== 'in-progress' && (
                            <button 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => updateRequestStatus('in-progress')}
                            >
                              Mark as In Progress
                            </button>
                          )}
                          {activeRequest.status !== 'resolved' && (
                            <button 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => updateRequestStatus('resolved')}
                            >
                              Mark as Resolved
                            </button>
                          )}
                          {activeRequest.status !== 'closed' && (
                            <button 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => updateRequestStatus('closed')}
                            >
                              Close Request
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${statusColors[activeRequest.status]}`}>
                      {activeRequest.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500 mb-4">
                  <div>
                    <div><strong>Employee:</strong> {activeRequest.employeeId?.name || 'Unknown'}</div>
                    <div><strong>Created:</strong> {formatDate(activeRequest.createdAt)}</div>
                    {activeRequest.resolvedAt && (
                      <div><strong>Resolved:</strong> {formatDate(activeRequest.resolvedAt)}</div>
                    )}
                  </div>
                  <div className="mt-3 md:mt-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activeRequest.category]}`}>
                      {activeRequest.category}
                    </span>
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {activeRequest.priority}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description:</h3>
                  <p className="text-gray-800 whitespace-pre-line">{activeRequest.description}</p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Responses</h3>
                
                {activeRequest.responses && activeRequest.responses.length > 0 ? (
                  <div className="space-y-4 mb-6 max-h-[calc(100vh-500px)] overflow-y-auto">
                    {activeRequest.responses.map((response, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${response.isAdmin ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <p className="text-gray-800 whitespace-pre-line">{response.text}</p>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                          <span>
                            {response.isAdmin ? (
                              <span className="text-blue-600 font-medium">{response.createdBy} (Admin)</span>
                            ) : (
                              <span>{response.createdBy}</span>
                            )}
                          </span>
                          <span>{formatDate(response.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2 text-gray-600">No responses yet</p>
                  </div>
                )}
                
                {/* Add Response Form - only show if request is not closed */}
                {activeRequest.status !== 'closed' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Add a Response:</h3>
                    <form onSubmit={handleSubmitResponse}>
                      <div className="mb-3">
                        <textarea
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Type your response here..."
                          required
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingResponse}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
                        >
                          {submittingResponse ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : "Submit Response"}
                        </button>
                      </div>
                    </form>
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

export default AdminHelpRequests;
