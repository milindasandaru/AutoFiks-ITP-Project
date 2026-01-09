// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const EmployeeHelpCenter = () => {
//   const [helpRequests, setHelpRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showNewRequestForm, setShowNewRequestForm] = useState(false);
//   const [newRequest, setNewRequest] = useState({
//     title: '',
//     description: '',
//     category: 'other',
//     priority: 'medium'
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [employeeInfo, setEmployeeInfo] = useState(null);
//   const [activeRequest, setActiveRequest] = useState(null);
//   const [newResponse, setNewResponse] = useState('');
//   const [submittingResponse, setSubmittingResponse] = useState(false);
//   const navigate = useNavigate();

//   // Base URL for API requests
//   const API_BASE_URL = 'http://localhost:8070/api';

//   // Category and priority styling
//   const categoryColors = {
//     'technical': 'bg-blue-100 text-blue-800',
//     'hr': 'bg-purple-100 text-purple-800',
//     'operations': 'bg-green-100 text-green-800',
//     'other': 'bg-gray-100 text-gray-800'
//   };

//   const statusColors = {
//     'open': 'bg-yellow-100 text-yellow-800',
//     'in-progress': 'bg-blue-100 text-blue-800',
//     'resolved': 'bg-green-100 text-green-800',
//     'closed': 'bg-gray-100 text-gray-800'
//   };

//   // Fetch employee profile and help requests
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // First get the employee profile using the authentication token
//         const profileResponse = await axios.get(`${API_BASE_URL}/employees/profile`, {
//           withCredentials: true
//         });
        
//         if (!profileResponse.data.success) {
//           throw new Error(profileResponse.data.message || 'Failed to fetch employee profile');
//         }
        
//         const employeeData = profileResponse.data.employee;
//         setEmployeeInfo(employeeData);
        
//         // Then fetch help requests for this employee
//         const requestsResponse = await axios.get(
//           `${API_BASE_URL}/help-requests/employee`,
//           { withCredentials: true }
//         );
        
//         // Ensure help requests is always an array
//         const requestsData = Array.isArray(requestsResponse.data) ? requestsResponse.data : [];
        
//         setHelpRequests(requestsData);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
        
//         // Handle authentication errors
//         if (err.response && err.response.status === 401) {
//           setError('Authentication required. Please log in again.');
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           setError(err.message || 'Failed to load data. Please try again.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [API_BASE_URL, navigate]);

//   // Handle new request input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRequest({
//       ...newRequest,
//       [name]: value
//     });
//   };

//   // Submit new help request
//   const handleSubmitRequest = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/help-requests`,
//         newRequest,
//         { withCredentials: true }
//       );
      
//       // Add the new request to the state
//       setHelpRequests([response.data, ...helpRequests]);
      
//       // Reset form and hide it
//       setNewRequest({
//         title: '',
//         description: '',
//         category: 'other',
//         priority: 'medium'
//       });
//       setShowNewRequestForm(false);
//     } catch (err) {
//       console.error('Error submitting help request:', err);
//       setError('Failed to submit request. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Fetch request details
//   const fetchRequestDetails = async (id) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/help-requests/details/${id}`,
//         { withCredentials: true }
//       );
      
//       setActiveRequest(response.data);
//     } catch (err) {
//       console.error('Error fetching request details:', err);
//       setError('Failed to load request details. Please try again.');
//     }
//   };

//   // Submit response to help request
//   const handleSubmitResponse = async (e) => {
//     e.preventDefault();
//     if (!newResponse.trim() || !activeRequest) return;
    
//     setSubmittingResponse(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/help-requests/${activeRequest._id}/responses`,
//         { 
//           text: newResponse,
//           userName: employeeInfo?.name || 'Employee'
//         },
//         { withCredentials: true }
//       );
      
//       // Update the active request with the new response
//       setActiveRequest(response.data);
      
//       // Also update the request in the list
//       setHelpRequests(helpRequests.map(req => 
//         req._id === activeRequest._id ? response.data : req
//       ));
      
//       setNewResponse('');
//     } catch (err) {
//       console.error('Error submitting response:', err);
//       setError('Failed to submit your response. Please try again.');
//     } finally {
//       setSubmittingResponse(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <div className="ml-4 text-lg font-semibold text-gray-700">Loading help center...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Help Center</h1>
//             {employeeInfo && (
//               <p className="text-gray-600 mt-1">
//                 Welcome, {employeeInfo.name}. How can we help you today?
//               </p>
//             )}
//           </div>
//           <button
//             onClick={() => setShowNewRequestForm(!showNewRequestForm)}
//             className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             {showNewRequestForm ? 'Cancel' : 'New Request'}
//           </button>
//         </div>
        
//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
//             <p>{error}</p>
//           </div>
//         )}
        
//         {/* New Help Request Form */}
//         {showNewRequestForm && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-lg font-semibold mb-4">Submit a New Help Request</h2>
//             <form onSubmit={handleSubmitRequest}>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
//                   <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     value={newRequest.title}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Brief summary of your question"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={newRequest.description}
//                     onChange={handleInputChange}
//                     required
//                     rows="4"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Please provide details about your question or issue"
//                   ></textarea>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                     <select
//                       id="category"
//                       name="category"
//                       value={newRequest.category}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="technical">Technical</option>
//                       <option value="hr">HR</option>
//                       <option value="operations">Operations</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                     <select
//                       id="priority"
//                       name="priority"
//                       value={newRequest.priority}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-end pt-4">
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-300 flex items-center"
//                   >
//                     {submitting ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Submitting...
//                       </>
//                     ) : "Submit Request"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Help Requests List */}
//           <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeRequest ? 'hidden md:block md:col-span-1' : 'col-span-3'}`}>
//             <div className="p-4 bg-blue-50 border-b border-blue-100">
//               <h2 className="text-lg font-semibold text-gray-800">Your Help Requests</h2>
//             </div>
            
//             {helpRequests.length === 0 ? (
//               <div className="p-8 text-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="mt-4 text-gray-600">You haven't submitted any help requests yet.</p>
//                 <button
//                   onClick={() => setShowNewRequestForm(true)}
//                   className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
//                 >
//                   Submit Your First Request
//                 </button>
//               </div>
//             ) : (
//               <ul className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
//                 {helpRequests.map((request) => (
//                   <li 
//                     key={request._id} 
//                     className={`p-4 hover:bg-gray-50 transition duration-150 cursor-pointer ${activeRequest && activeRequest._id === request._id ? 'bg-blue-50' : ''}`}
//                     onClick={() => fetchRequestDetails(request._id)}
//                   >
//                     <div className="flex flex-col mb-2">
//                       <h3 className="text-lg font-medium text-gray-800">{request.title}</h3>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
//                           {request.status.replace('-', ' ')}
//                         </span>
//                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[request.category]}`}>
//                           {request.category}
//                         </span>
//                       </div>
//                     </div>
                    
//                     <p className="text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                    
//                     <div className="text-sm text-gray-500">
//                       <span>Created: {formatDate(request.createdAt)}</span>
                      
//                       {request.responses && request.responses.length > 0 && (
//                         <div className="mt-2 text-xs">
//                           <span className="text-blue-600">{request.responses.length} response{request.responses.length > 1 ? 's' : ''}</span>
//                         </div>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
          
//           {/* Help Request Details */}
//           {activeRequest && (
//             <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
//               <div className="p-4 md:flex md:justify-between md:items-center bg-blue-50 border-b border-blue-100">
//                 <h2 className="text-lg font-semibold text-gray-800">Request Details</h2>
//                 <button 
//                   onClick={() => setActiveRequest(null)}
//                   className="mt-2 md:mt-0 text-gray-600 hover:text-gray-800 md:hidden"
//                 >
//                   ← Back to list
//                 </button>
//               </div>
              
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//                   <h1 className="text-xl font-bold text-gray-800">{activeRequest.title}</h1>
//                   <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${statusColors[activeRequest.status]}`}>
//                     {activeRequest.status.replace('-', ' ')}
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500 mb-4">
//                   <div>
//                     <span>Created: {formatDate(activeRequest.createdAt)}</span>
//                     {activeRequest.resolvedAt && (
//                       <span className="ml-4">Resolved: {formatDate(activeRequest.resolvedAt)}</span>
//                     )}
//                   </div>
//                   <div className="mt-2 md:mt-0">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activeRequest.category]}`}>
//                       {activeRequest.category}
//                     </span>
//                     <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       {activeRequest.priority}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Description:</h3>
//                   <p className="text-gray-800 whitespace-pre-line">{activeRequest.description}</p>
//                 </div>
                
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Responses</h3>
                
//                 {activeRequest.responses && activeRequest.responses.length > 0 ? (
//                   <div className="space-y-4 mb-6 max-h-[calc(100vh-500px)] overflow-y-auto">
//                     {activeRequest.responses.map((response, index) => (
//                       <div 
//                         key={index} 
//                         className={`p-4 rounded-lg border ${response.isAdmin ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
//                       >
//                         <p className="text-gray-800 whitespace-pre-line">{response.text}</p>
//                         <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
//                           <span>
//                             {response.isAdmin ? (
//                               <span className="text-blue-600 font-medium">{response.createdBy} (Admin)</span>
//                             ) : (
//                               <span>{response.createdBy}</span>
//                             )}
//                           </span>
//                           <span>{formatDate(response.createdAt)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                     </svg>
//                     <p className="mt-2 text-gray-600">No responses yet</p>
//                   </div>
//                 )}
                
//                 {/* Add Response Form - only show if request is not closed */}
//                 {activeRequest.status !== 'closed' && (
//                   <div className="mt-6">
//                     <h3 className="text-sm font-medium text-gray-700 mb-2">Add a Response:</h3>
//                     <form onSubmit={handleSubmitResponse}>
//                       <div className="mb-3">
//                         <textarea
//                           value={newResponse}
//                           onChange={(e) => setNewResponse(e.target.value)}
//                           rows="3"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Type your response here..."
//                           required
//                         ></textarea>
//                       </div>
//                       <div className="flex justify-end">
//                         <button
//                           type="submit"
//                           disabled={submittingResponse}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
//                         >
//                           {submittingResponse ? (
//                             <>
//                               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                               </svg>
//                               Submitting...
//                             </>
//                           ) : "Submit Response"}
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeHelpCenter;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeHelpCenter = () => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [newResponse, setNewResponse] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8070/api';

  // Enhanced Colors for UI
  const categoryStyles = {
    'technical': 'bg-blue-50 text-blue-700 border-blue-100',
    'hr': 'bg-purple-50 text-purple-700 border-purple-100',
    'operations': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'other': 'bg-gray-50 text-gray-700 border-gray-100'
  };

  const statusStyles = {
    'open': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800'
  };

  // const priorityStyles = {
  //   'low': 'text-gray-500',
  //   'medium': 'text-orange-500',
  //   'high': 'text-red-600 font-bold'
  // };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/employees/profile`, { withCredentials: true });
        if (!profileResponse.data.success) throw new Error(profileResponse.data.message);
        
        setEmployeeInfo(profileResponse.data.employee);
        
        const requestsResponse = await axios.get(`${API_BASE_URL}/help-requests/employee`, { withCredentials: true });
        const requestsData = Array.isArray(requestsResponse.data) ? requestsResponse.data : [];
        setHelpRequests(requestsData);
        
        // Auto-select first request if available
        if (requestsData.length > 0) fetchRequestDetails(requestsData[0]._id);
        
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Authentication required. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(err.message || 'Failed to load data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/help-requests`, newRequest, { withCredentials: true });
      setHelpRequests([response.data, ...helpRequests]);
      setNewRequest({ title: '', description: '', category: 'other', priority: 'medium' });
      setShowNewRequestForm(false);
      // Auto switch to new request
      setActiveRequest(response.data);
    } catch (err) {
      console.error('Error submitting help request:', err);
      setError('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRequestDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/help-requests/details/${id}`, { withCredentials: true });
      setActiveRequest(response.data);
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to load request details.');
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.trim() || !activeRequest) return;
    setSubmittingResponse(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/help-requests/${activeRequest._id}/responses`,
        { text: newResponse, userName: employeeInfo?.name || 'Employee' },
        { withCredentials: true }
      );
      setActiveRequest(response.data);
      setHelpRequests(helpRequests.map(req => req._id === activeRequest._id ? response.data : req));
      setNewResponse('');
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    // FULL WIDTH CONTAINER
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex flex-col">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
          {employeeInfo && <p className="text-gray-500 text-sm mt-1">Hello {employeeInfo.name}, submit inquiries and track status.</p>}
        </div>
        <button
          onClick={() => setShowNewRequestForm(!showNewRequestForm)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center text-sm font-medium"
        >
          {showNewRequestForm ? 'Cancel Request' : '+ New Support Ticket'}
        </button>
      </div>
      
      {error && <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg border-l-4 border-red-500 text-sm">{error}</div>}
      
      {/* New Request Form (Collapsible) */}
      {showNewRequestForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 animate-fade-in-down">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Submit New Ticket</h2>
          <form onSubmit={handleSubmitRequest}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="title"
                  value={newRequest.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Salary Discrepancy"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={newRequest.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="hr">Human Resources</option>
                    <option value="operations">Operations</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={newRequest.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High - Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* MAIN CONTENT SPLIT VIEW */}
      <div className="flex flex-col lg:flex-row gap-6 items-start flex-1">
        
        {/* LEFT PANEL: Ticket List (Fixed Width on Desktop) */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6 h-[calc(100vh-140px)] flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700">My Tickets</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{helpRequests.length}</span>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {helpRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No tickets yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {helpRequests.map((request) => (
                  <li 
                    key={request._id} 
                    className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer border-l-4 ${activeRequest && activeRequest._id === request._id ? 'bg-blue-50 border-blue-600' : 'border-transparent'}`}
                    onClick={() => fetchRequestDetails(request._id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${categoryStyles[request.category]}`}>
                        {request.category}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(request.createdAt).split(',')[0]}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{request.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-2">{request.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                      {request.responses?.length > 0 && (
                        <span className="text-xs text-blue-600 flex items-center">
                           <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                           {request.responses.length}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* RIGHT PANEL: Details & Chat (Flex-1 fills space) */}
        <div className="flex-1 w-full h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {activeRequest ? (
            <>
              {/* Ticket Header */}
              <div className="p-6 border-b border-gray-100 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">{activeRequest.title}</h1>
                    <div className="flex items-center gap-3 text-xs">
                       <span className={`px-2 py-1 rounded border ${categoryStyles[activeRequest.category]} font-medium uppercase`}>{activeRequest.category}</span>
                       <span className="text-gray-400">ID: #{activeRequest._id.slice(-6).toUpperCase()}</span>
                       <span className="text-gray-400">•</span>
                       <span className="text-gray-400">{formatDate(activeRequest.createdAt)}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold border ${activeRequest.status === 'open' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                    {activeRequest.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed">
                  {activeRequest.description}
                </div>
              </div>

              {/* Conversation Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {activeRequest.responses && activeRequest.responses.length > 0 ? (
                  activeRequest.responses.map((response, index) => (
                    <div key={index} className={`flex ${response.isAdmin ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                        response.isAdmin 
                          ? 'bg-white text-gray-800 rounded-tl-none border border-gray-200' 
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        <div className="flex justify-between items-center mb-1 gap-4">
                          <span className={`text-xs font-bold ${response.isAdmin ? 'text-gray-900' : 'text-blue-100'}`}>
                            {response.isAdmin ? 'Support Team' : 'You'}
                          </span>
                          <span className={`text-[10px] ${response.isAdmin ? 'text-gray-400' : 'text-blue-200'}`}>
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{response.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                    <p>No responses yet. Support will reply soon.</p>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              {activeRequest.status !== 'closed' && (
                <div className="p-4 bg-white border-t border-gray-100">
                  <form onSubmit={handleSubmitResponse}>
                    <div className="relative">
                      <textarea
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                        rows="1" // Start small, maybe handle auto-expand if needed or keep simple
                        placeholder="Type your reply here..."
                        style={{minHeight: '50px'}}
                        required
                      ></textarea>
                      <button
                        type="submit"
                        disabled={submittingResponse || !newResponse.trim()}
                        className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <p className="font-medium text-gray-600">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHelpCenter;