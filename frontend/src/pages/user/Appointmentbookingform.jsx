import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


// Import your logo image
import logo from '../../assets/images/AMS_logo2.png'; 

const AppointmentBookingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceType: '',
    notes: '',
    model: '',
    year: '',
    registrationNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const years = Array.from({ length: 36 }, (_, i) => 1990 + i);

  const availableTimeSlots = {
    Sunday: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    Monday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    Tuesday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    Wednesday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    Thursday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    Friday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    Saturday: ['09:00', '10:00', '11:00', '12:00'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedDateTime = new Date(
      `${selectedDate}T${selectedTime}`
    ).toISOString();

    try {
      await axios.post("http://localhost:8070/api/bookings"
        , {
        model: formData.model,
        year: formData.year,
        registrationNumber: formData.registrationNumber,
        serviceType: formData.serviceType,
        selectedDateTime: selectedDateTime,
      });

      setSuccess(true);
      setFormData({
        serviceType: '',
        notes: '',
        model: '',
        year: '',
        registrationNumber: '',
      });
      setSelectedDate('');
      setSelectedTime('');
      setTimeout(() => setSuccess(false), 5000);

      navigate("/overview/booking-list"); //Navigate to bookinglist

    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dateString = nextDay.toISOString().slice(0, 10);
      days.push(dateString);
    }
    return days;
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.getDay();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[weekday];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Logo added here */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Your Logo" className="h-12" />
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Book Your Appointment
      </h2>

      {success && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 rounded border border-green-300">
          Appointment booked successfully!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 text-red-800 bg-red-100 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="model" className="block mb-1 font-medium text-gray-700">
            Vehicle Model <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            placeholder="Enter vehicle model"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
  <label htmlFor="year" className="block mb-1 font-medium text-gray-700">
    Vehicle Year <span className="text-red-500">*</span>
  </label>
  <select
    id="year"
    name="year"
    value={formData.year}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select Year</option>
    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

        <div>
          <label
            htmlFor="registrationNumber"
            className="block mb-1 font-medium text-gray-700"
          >
            Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            placeholder="Enter registration number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-1 font-medium text-gray-700">
            Select Date <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-7 gap-2">
            {getAvailableDays().map((date) => (
              <div key={date} className="text-center">
                <button
                  type="button"
                  onClick={() => handleDateChange({ target: { value: date } })}
                  className={`w-full py-2 rounded-lg ${
                    selectedDate === date
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatDate(date)}
                </button>
                {availableTimeSlots[getDayOfWeek(date)] && (
                  <div className="mt-2">
                    {availableTimeSlots[getDayOfWeek(date)].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeChange({ target: { value: time } })}
                        className={`block w-full py-1 rounded-md text-xs ${
                          selectedTime === time && selectedDate === date
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                        disabled={selectedDate !== date}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="serviceType"
            className="block mb-1 font-medium text-gray-700"
          >
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a service</option>
            {[
              'Brake Inspection & Repair',
              'Oil Change & Filter Replacement',
              'Engine repairs',
              'Tire Rotation & Alignment',
              
            ].map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block mb-1 font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes"
            className="w-full px-3 py-2 border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedTime}
          className={`w-full py-3 text-white font-semibold rounded ${
            loading || !selectedDate || !selectedTime
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBookingForm;
