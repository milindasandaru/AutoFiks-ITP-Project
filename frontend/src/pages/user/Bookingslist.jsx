import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    model: '',
    year: '',
    registrationNumber: '',
    serviceType: '',
    selectedDateTime: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/bookings');

        // Check the structure of the response and handle appropriately
        if (response.data && Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          // If the response is not as expected, log it for debugging
          console.warn("Unexpected response format:", response.data);
          setBookings([]); // Ensure bookings is an empty array to prevent .map() errors
          setError('Failed to load bookings: Unexpected data format.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditFormData({
      model: booking.model,
      year: booking.year,
      registrationNumber: booking.registrationNumber,
      serviceType: booking.serviceType,
      selectedDateTime: booking.selectedDateTime
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        setBookings(bookings.filter(booking => booking._id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete booking.');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/bookings/${editingId}`, editFormData);
      setBookings(bookings.map(booking =>
        booking._id === editingId ? response.data : booking
      ));
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Failed to update booking.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        All Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {editingId === booking._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={editFormData.model}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        name="year"
                        value={editFormData.year}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={editFormData.registrationNumber}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Service Type
                      </label>
                      <select
                        name="serviceType"
                        value={editFormData.serviceType}
                        onChange={handleEditChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      >
                        <option value="Consultation">Consultation</option>
                        <option value="Check-up">Check-up</option>
                        <option value="Treatment">Treatment</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-semibold text-gray-700">Model:</span>
                      {booking.model}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Year:</span>
                      {booking.year}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Registration:</span>
                      {booking.registrationNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Service:</span>
                      {booking.serviceType}
                    </p>
                  </div>
                  <p className="mt-2">
                    <span className="font-semibold text-gray-700">Date/Time:</span>
                    {booking.selectedDateTime ? new Date(booking.selectedDateTime).toLocaleString() : 'N/A'}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingsList;
