import React, { useState } from 'react';
import LeaveRequestForm from '../../components/employee/LeaveRequestForm';
import LeaveRequestList from '../../components/employee/LeaveRequestList';
import LeaveStatistics from '../../components/employee/LeaveStatistics';

const LeaveManagement = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleRequestSubmitted = () => {
    // Trigger a refresh of the leave request list
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Statistics */}
          <div className="lg:col-span-3">
            <LeaveStatistics />
          </div>
          
          {/* Leave Request Form */}
          <div className="lg:col-span-1">
            <LeaveRequestForm onRequestSubmitted={handleRequestSubmitted} />
          </div>
          
          {/* Leave Request List */}
          <div className="lg:col-span-2">
            <LeaveRequestList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
