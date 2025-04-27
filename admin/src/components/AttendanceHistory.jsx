import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaSearch, FaDownload } from 'react-icons/fa';
import moment from 'moment';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7))); // Default to last 7 days
  const [endDate, setEndDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A';
    
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      // Validate dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Invalid date';
      }
      
      // Ensure checkout is after checkin
      if (end <= start) {
        return 'Invalid duration';
      }
      
      // Calculate difference in milliseconds for more precision
      const diffMs = end.getTime() - start.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error('Error formatting duration:', error);
      return 'Error';
    }
  };  
  
  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate, currentPage]);
  
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      const response = await axios.get(`http://localhost:8070/api/attendance/all`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          page: currentPage,
          limit: 10
        }
      });
      
      if (response.data.success) {
        setAttendance(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setAttendance([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      setAttendance([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  const exportToCSV = async () => {
    try {
      setExportLoading(true);
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      // Fetch all records for export (no pagination)
      const response = await axios.get(`http://localhost:8070/api/attendance/all`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          limit: 1000 // Get more records for export
        }
      });
      
      if (response.data.success && response.data.data.length > 0) {
        const records = response.data.data;
        
        // Prepare CSV content
        let csvContent = "Employee ID,Employee Name,Position,Check-in Time,Check-out Time,Duration,Status,Location\n";
        
        records.forEach(record => {
          const row = [
            record.employeeId?.employeeId || 'Unknown',
            record.employeeId?.name || 'Unknown',
            record.employeeId?.position || 'N/A',
            record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A',
            record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A',
            formatDuration(record.checkInTime, record.checkOutTime),
            record.status,
            record.location || 'N/A'
          ];
          
          // Escape commas in fields and join with commas
          csvContent += row.map(field => `"${field}"`).join(',') + "\n";
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${formattedStartDate}_to_${formattedEndDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to export attendance:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Attendance History</h2>
      
      <div className="flex flex-col md:flex-row md:items-end gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-none flex space-x-2">
          <button 
            onClick={fetchAttendance} 
            className="px-4 py-2.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
          
          <button 
            onClick={exportToCSV} 
            disabled={exportLoading || attendance.length === 0}
            className="px-4 py-2.5 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center disabled:opacity-50"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading attendance data...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Employee ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Employee Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Position</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Check-in Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Check-out Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Duration</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.length > 0 ? (
                attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{record.employeeId?.employeeId || 'Unknown'}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{record.employeeId?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{record.employeeId?.position || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(record.checkInTime)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(record.checkOutTime)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDuration(record.checkInTime, record.checkOutTime)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'half-day' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{record.location || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 px-4 text-center text-gray-500 bg-gray-50">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-lg font-medium">No attendance records found</p>
                    <p className="mt-1">Try selecting a different date range</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {attendance.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-white text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded bg-white text-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Showing {attendance.length} records for the period {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AttendanceHistory;
