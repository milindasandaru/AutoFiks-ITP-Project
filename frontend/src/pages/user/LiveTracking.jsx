import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import axios from "axios";
import { FaCarSide } from "react-icons/fa";

const socket = io("http://localhost:8070"); // backend URL

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();

    socket.on('statusUpdated', (updatedBooking) => {
      setAppointments(prev => 
        prev.map(appt => 
          appt._id === updatedBooking._id ? updatedBooking : appt
        )
      );
    });

    return () => {
      socket.off('statusUpdated');
    };
  }, []);

  const fetchAppointments = async () => {
    const response = await axios.get("http://localhost:8070/api/bookings");
    setAppointments(response.data);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">🚗 Your Service Appointments</h2>

      {appointments.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {appointments.map(appt => (
            <div key={appt._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <FaCarSide className="text-indigo-500 text-3xl mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{appt.serviceType}</h3>
                  <p className="text-sm text-gray-500">{formatDateTime(appt.selectedDateTime)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600"><strong>Vehicle Model:</strong> {appt.model}</p>
                <p className="text-gray-600"><strong>Registration:</strong> {appt.registrationNumber}</p>
              </div>

              <div>
                <span 
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full 
                    ${appt.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                      appt.status === "Started" ? "bg-blue-100 text-blue-800" : 
                      appt.status === "Finished" ? "bg-green-100 text-green-800" : 
                      "bg-gray-100 text-gray-800"}`}
                >
                  {appt.status || "Not Available"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">You have no appointments booked yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserAppointments;
