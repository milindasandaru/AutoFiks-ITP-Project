import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceReport = ({ employeeId = 'EMP12347' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [employee, setEmployee] = useState(null);
  
  // For date filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get employee details
        const employeeResponse = await axios.get(
          `http://localhost:4000/employees?employeeId=${employeeId}`
        );
        
        if (employeeResponse.data && employeeResponse.data.length > 0) {
          setEmployee(employeeResponse.data[0]);
        }
        
        // Get attendance history
        const attendanceResponse = await axios.get(
          `http://localhost:4000/employees/attendance/${employeeId}`
        );
        
        setAttendanceData(attendanceResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId]);
  
  // Filter attendance data based on date range
  const filteredData = attendanceData.filter(record => {
    const recordDate = new Date(record.date);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;
    
    if (filterStartDate && recordDate < filterStartDate) return false;
    if (filterEndDate) {
      // Adjust end date to include the entire day
      const adjustedEndDate = new Date(filterEndDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      if (recordDate >= adjustedEndDate) return false;
    }
    
    return true;
  });
  
  // Calculate summary statistics
  const calculateStats = () => {
    if (!filteredData.length) return { totalHours: 0, avgHours: 0 };
    
    const validRecords = filteredData.filter(record => record.hoursWorked !== null);
    
    if (!validRecords.length) return { totalHours: 0, avgHours: 0 };
    
    const totalHours = validRecords.reduce(
      (sum, record) => sum + parseFloat(record.hoursWorked), 0
    );
    
    return {
      totalHours: totalHours.toFixed(2),
      avgHours: (totalHours / validRecords.length).toFixed(2),
      daysAttended: validRecords.length
    };
  };
  
  const stats = calculateStats();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <p className="text-center">Loading attendance data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Attendance Report</h2>
      
      {employee && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p><span className="font-medium">Employee:</span> {employee.name}</p>
          <p><span className="font-medium">ID:</span> {employee.employeeId}</p>
          <p><span className="font-medium">Position:</span> {employee.position}</p>
        </div>
      )}
      
      {/* Date filter controls */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-1.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-1.5"
          />
        </div>
        <div className="self-end">
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="px-3 py-1.5 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-md text-center">
          <p className="text-sm text-gray-600">Days Attended</p>
          <p className="text-xl font-bold">{stats.daysAttended}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-md text-center">
          <p className="text-sm text-gray-600">Total Hours</p>
          <p className="text-xl font-bold">{stats.totalHours}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-md text-center">
          <p className="text-sm text-gray-600">Avg Hours/Day</p>
          <p className="text-xl font-bold">{stats.avgHours}</p>
        </div>
      </div>
      
      {/* Attendance records table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Clock In
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Clock Out
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Hours
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(record.date)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatTime(record.clockIn)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatTime(record.clockOut)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {record.hoursWorked ? `${record.hoursWorked} hrs` : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;