// pages/admin/AttendancePage.jsx
import React from 'react';
import QRScanner from '../../components/QRScanner';

const AttendancePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Employee Attendance</h1>
      <QRScanner />
    </div>
  );
};

export default AttendancePage;