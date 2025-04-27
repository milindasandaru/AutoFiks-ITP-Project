import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8070/api/leave-requests/statistics',
          { withCredentials: true }
        );
        
        setStatistics(response.data.statistics);
        setError(null);
      } catch (error) {
        console.error('Error fetching leave statistics:', error);
        setError('Failed to load leave statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading statistics...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Leave Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-sm font-medium text-blue-700 mb-1">Total Requests</h3>
          <p className="text-2xl font-bold text-blue-800">{statistics?.totalRequests || 0}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="text-sm font-medium text-green-700 mb-1">Approved</h3>
          <p className="text-2xl font-bold text-green-800">{statistics?.approved || 0}</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <h3 className="text-sm font-medium text-yellow-700 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-yellow-800">{statistics?.pending || 0}</p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <h3 className="text-sm font-medium text-red-700 mb-1">Rejected</h3>
          <p className="text-2xl font-bold text-red-800">{statistics?.rejected || 0}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Leave Days Taken</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">By Leave Type</h4>
          <div className="space-y-2">
            {statistics?.leaveTypeStats && Object.entries(statistics.leaveTypeStats).map(([type, days]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{type} Leave</span>
                  <span>{days} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      type === 'sick' ? 'bg-red-500' :
                      type === 'casual' ? 'bg-blue-500' :
                      type === 'annual' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} 
                    style={{ width: `${statistics.totalDaysTaken > 0 ? (days / statistics.totalDaysTaken) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex flex-col justify-center">
          <h4 className="text-sm font-medium text-indigo-700 mb-2">Total Leave Days</h4>
          <p className="text-3xl font-bold text-indigo-800">{statistics?.totalDaysTaken || 0}</p>
          <p className="text-sm text-indigo-600 mt-1">Days taken this year</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatistics;
