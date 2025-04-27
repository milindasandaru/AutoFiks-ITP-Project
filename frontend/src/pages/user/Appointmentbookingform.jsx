import React, { useState, useEffect } from 'react';
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
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState({});
  const [bookedTimeSlots, setBookedTimeSlots] = useState({});
  const [availableDates, setAvailableDates] = useState([]);

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

  // Calculate progress for the progress bar
  const calculateProgress = () => {
    const fields = ['model', 'year', 'registrationNumber', 'serviceType'];
    const filledFields = fields.filter(field => formData[field] !== '').length;
    const dateTimeSelected = selectedDate && selectedTime ? 1 : 0;
    return Math.round(((filledFields + dateTimeSelected) / (fields.length + 1)) * 100);
  };

  // Validate field input
  const validateField = (name, value) => {
    switch (name) {
      case 'model':
        return value.trim() === '' ? 'Vehicle model is required' : '';
      case 'registrationNumber':
        return value.trim() === '' ? 'Registration number is required' : 
               !/^[A-Z0-9]{2,8}$/.test(value) ? 'Enter a valid registration format' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getDatesForSelectedDay = () => {
    if (!selectedDay) return [];
    const days = [];
    const today = new Date();
    for (let i = 0; i < 55; i++) { // check next 3 weeks
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      if (nextDay.toLocaleString('en-US', { weekday: 'long' }) === selectedDay) {
        days.push(nextDay.toISOString().slice(0, 10));
      }
    }
    return days;
  };

  // Update available dates when selected day changes
  useEffect(() => {
    if (selectedDay) {
      const dates = getDatesForSelectedDay();
      setAvailableDates(dates);
      // Clear selected date when day changes
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [selectedDay]);

  // Simulate fetching booked time slots
  useEffect(() => {
    if (selectedDate) {
      // In a real app, you would fetch this data from your API
      // For now, we'll simulate some booked slots
      const simulateBookedSlots = () => {
        const slots = {};
        
        // For demonstration, let's mark some slots as booked
        // In a real app, this would come from your backend
        availableTimeSlots[selectedDay]?.forEach(time => {
          // Randomly mark some slots as booked (for demo purposes)
          slots[time] = Math.random() > 0.7;
        });
        
        setBookedTimeSlots(slots);
      };
      
      simulateBookedSlots();
    }
  }, [selectedDate, selectedDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedDateTime = new Date(
      `${selectedDate}T${selectedTime}`
    ).toISOString();

    try {
      await axios.post("http://localhost:8070/api/bookings", {
        model: formData.model,
        year: formData.year,
        registrationNumber: formData.registrationNumber,
        serviceType: formData.serviceType,
        selectedDateTime: selectedDateTime,
      },
      { 
        withCredentials: true // Ensure credentials (cookies) are sent with the request
      });

      setSuccess(true);
      setFormData({
        serviceType: '',
        notes: '',
        model: '',
        year: '',
        registrationNumber: '',
      });
      setSelectedDay('');
      setSelectedDate('');
      setSelectedTime('');
      setTimeout(() => {
        setSuccess(false);
        navigate("/overview/booking-list"); // Navigate to bookinglist
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Define services with icons
  const services = [
    { id: 'brake', name: 'Brake Inspection & Repair', icon: '🔧', duration: '60 min' },
    { id: 'oil', name: 'Oil Change & Filter Replacement', icon: '🛢️', duration: '30 min' },
    { id: 'engine', name: 'Engine repairs', icon: '⚙️', duration: '120 min' },
    { id: 'tire', name: 'Tire Rotation & Alignment', icon: '🔄', duration: '45 min' },
  ];

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Logo added here */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Your Logo" className="h-12" />
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Book Your Appointment
      </h2>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{calculateProgress()}% complete</p>
      </div>

      {/* Navigation button to BookingsList */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => navigate('/overview/booking-list')}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
        >
          <span>My Bookings</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {success && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 rounded border border-green-300 animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Appointment booked successfully!</span>
          </div>
          <p className="text-sm mt-1">Redirecting to your bookings...</p>
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
            className={`w-full px-3 py-2 border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
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
            className={`w-full px-3 py-2 border ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
        </div>

        {/* Day Dropdown */}
        <div>
          <label htmlFor="day" className="block mb-1 font-medium text-gray-700">
            Select Day <span className="text-red-500">*</span>
          </label>
          <select
            id="day"
            name="day"
            value={selectedDay}
            onChange={e => {
              setSelectedDay(e.target.value);
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a day</option>
            {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {/* Horizontal Date Selector */}
        {selectedDay && (
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              Select Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex space-x-2 py-1">
                  {availableDates.map(date => (
                    <div
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        flex-shrink-0 cursor-pointer transition-all duration-200 px-3 py-2 rounded-lg text-center
                        ${selectedDate === date 
                          ? 'bg-blue-600 text-white transform scale-105 shadow-md' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-xs font-medium">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="font-bold text-lg">
                        {new Date(date).getDate()}
                      </div>
                      <div className="text-xs">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Shadow indicators for scroll */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* Time Slot Buttons */}
        {selectedDate && (
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-700">Select Time</label>
            <div className="grid grid-cols-3 gap-2">
              {(availableTimeSlots[selectedDay] || []).map(time => {
                const isBooked = bookedTimeSlots[time] || false;
                
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={!isBooked ? () => setSelectedTime(time) : undefined}
                    disabled={isBooked}
                    className={`
                      py-2 px-1 rounded-md text-sm border transition-all duration-200
                      ${selectedTime === time 
                        ? 'bg-blue-600 text-white transform scale-105 shadow-md' 
                        : isBooked
                          ? 'bg-red-100 text-red-500 border-red-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 hover:border-blue-300'
                      }
                    `}
                  >
                    {time}
                    {isBooked && (
                      <div className="flex items-center justify-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-xs text-red-500 ml-1">Booked</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected appointment summary */}
        {selectedDate && selectedTime && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-1">Your Selected Appointment</h3>
            <div className="flex items-center text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center text-blue-700 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{selectedTime}</span>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="serviceType"
            className="block mb-1 font-medium text-gray-700"
          >
            Service Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {services.map(service => (
              <div 
                key={service.id}
                onClick={() => handleChange({ target: { name: 'serviceType', value: service.name } })}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.serviceType === service.name 
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-1">{service.icon}</div>
                <h3 className="font-medium text-sm">{service.name}</h3>
                <p className="text-xs text-gray-500">{service.duration}</p>
              </div>
            ))}
          </div>
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
          className={`w-full py-3 text-white font-semibold rounded flex items-center justify-center ${
            loading || !selectedDate || !selectedTime
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking...
            </>
          ) : (
            <>
              Book Appointment
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBookingForm;
