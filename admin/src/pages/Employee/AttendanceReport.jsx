// pages/admin/AttendanceReport.jsx
import React from 'react';
import AttendanceHistory from '../../components/AttendanceHistory';

const AttendanceReport = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Attendance Reports</h1>
      <AttendanceHistory />
    </div>
  );
};

export default AttendanceReport;
