import React from 'react';
import LeaveRequestsAdmin from '../../components/LeaveRequestsAdmin';

const LeaveManagementAdmin = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Management</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <LeaveRequestsAdmin />
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementAdmin;
