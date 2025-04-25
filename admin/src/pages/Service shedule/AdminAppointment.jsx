import React from 'react';
import '../App.css'; //CSS imported
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from 'react-icons/fa';

    
const AdminAppointment = () => {
    
    const [appointments, setAppointments] = useState([]);

    // Fetch appointments from API
    useEffect(() => {
    fetchAppointments();
  }, []); // Only run once when component mounts

   const fetchAppointments = async () => {

    try{
        const response = await axios.get("http://localhost:5000/api/bookings");

        await axios.post("http://localhost:5000/api/notify-status", 
);
        
        console.log("Fetched appointments:", response.data); // Log to verify the data
        setAppointments(response.data);
    } catch(error)
    {
        console.error( "Error fetching appointments", error );
    }

};

//Update appointment status
const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
      alert("✅ Status updated & notification sent!");
      fetchAppointments(); // Refresh list
      
    } 
    catch (error) 
    {
      console.error("Error updating appointment:", error);
      
    }
  };


// Delete an appointment
const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setAppointments(appointments.filter((appt) => appt._id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    
    // Format: "Mar 23, 2025 - 03:30 AM"
    return date.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
    }) + ' - ' + 
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
   

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Admin - Appointment Management</h2>
    
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicle Model</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Service</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Registration Number</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicle Year</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appt, index) => (
            <tr key={appt._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaUserCircle size={30} className="text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{appt.userName || 'Customer'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appt.model}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-blue-100 text-black">
                  {appt.serviceType}
                </span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{appt.registrationNumber}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{appt.year}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDateTime(appt.selectedDateTime)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={appt.status || ""}
                  onChange={(e) => {
                    console.log(`Selected new status: ${e.target.value} for ID: ${appt._id}`); // ✅ Debugging log
                    updateStatus(appt._id, e.target.value)}  }
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset text-sm`}
                >
                  
                  <option value="">Select Service Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Started">Started</option>
                  <option value="Finished">Finished</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => deleteAppointment(appt._id)}
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {appointments.length === 0 && (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No appointments found</p>
      </div>
    )}
  </div>
  )
}

export default AdminAppointment;

