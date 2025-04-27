// UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiClock, 
  FiTruck, 
  FiShoppingCart, 
  FiMessageSquare,
  FiUser,
  FiTool,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
  FiPlus,
  FiRefreshCw,
  FiPackage,
  FiFileText,
  FiTag,
  FiInfo,
  FiHelpCircle,
  FiRotateCw
} from 'react-icons/fi';

const UserDashboard = () => {
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // API base URL
  const API_BASE_URL = 'http://localhost:8070/api';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/user-dashboard`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error fetching user dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate demo data for testing
  const handleGenerateDemoData = async () => {
    setGenerateLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user-dashboard/generate-demo-data`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Refetch dashboard data after generating demo data
        fetchDashboardData();
      } else {
        throw new Error(response.data.message || 'Failed to generate demo data');
      }
    } catch (err) {
      console.error('Error generating demo data:', err);
      setError('Failed to generate demo data. Please try again.');
    } finally {
      setGenerateLoading(false);
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Calculate total cart value
  const getCartTotal = () => {
    if (!dashboardData?.cart?.items?.length) return 0;
    
    return dashboardData.cart.items.reduce((total, item) => {
      return total + (item.sparePart.price * item.quantity);
    }, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg font-medium text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome, {dashboardData?.user?.name || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your service schedule and orders.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {dashboardData?.upcomingBookings?.length > 0 ? (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 flex items-center">
                <FiCalendar className="mr-2" />
                <span className="text-sm font-medium">
                  Next service: {formatDateTime(dashboardData.upcomingBookings[0].selectedDateTime)}
                </span>
              </div>
            ) : (
              <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200 flex items-center">
                <FiClock className="mr-2" />
                <span className="text-sm font-medium">No upcoming services scheduled</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Demo data generator button */}
        <div className="mt-4 border-t border-blue-100 pt-4">
          <button 
            onClick={handleGenerateDemoData}
            disabled={generateLoading}
            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-md flex items-center"
          >
            {generateLoading ? (
              <>
                <FiRotateCw className="animate-spin mr-1" />
                Generating...
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-1" />
                Generate Sample Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <FiUser className="mr-2" />
            Overview
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'services' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('services')}
          >
            <FiTool className="mr-2" />
            Service Bookings
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'cart' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('cart')}
          >
            <FiShoppingCart className="mr-2" />
            My Cart
          </button>
          <button
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'inquiries' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('inquiries')}
          >
            <FiMessageSquare className="mr-2" />
            My Inquiries
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex">
            <FiAlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Upcoming Services */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <FiCalendar className="text-blue-600" />
                </div>
                <h3 className="text-gray-700 font-medium">Upcoming Services</h3>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.upcomingBookings?.length || 0}
                </p>
                <Link to="/bookings" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
            </div>
            
            {/* Service History */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                  <FiTruck className="text-green-600" />
                </div>
                <h3 className="text-gray-700 font-medium">Service History</h3>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.serviceHistory?.length || 0}
                </p>
                <Link to="/service-history" className="text-sm text-green-600 hover:text-green-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                  <FiShoppingCart className="text-purple-600" />
                </div>
                <h3 className="text-gray-700 font-medium">Cart Items</h3>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData?.cart?.items?.length || 0}
                </p>
                <Link to="/cart" className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                  View cart <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
            </div>
            
            {/* Inquiries */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                  <FiMessageSquare className="text-yellow-600" />
                </div>
                <h3 className="text-gray-700 font-medium">Inquiries</h3>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.inquiries?.length || 0}
                </p>
                <Link to="/inquiries" className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Next Service & Cart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Next Service */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" />
                  Next Service Appointment
                </h2>
                <Link to="/bookings" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {dashboardData?.upcomingBookings?.length > 0 ? (
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-50 rounded-full p-3 mr-4">
                        <FiTool className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {dashboardData.upcomingBookings[0].serviceType} - {dashboardData.upcomingBookings[0].model} ({dashboardData.upcomingBookings[0].year})
                        </h3>
                        <p className="text-sm text-gray-600">
                          Registration: {dashboardData.upcomingBookings[0].registrationNumber}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Date & Time</p>
                            <p className="text-sm font-medium">{formatDateTime(dashboardData.upcomingBookings[0].selectedDateTime)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm font-medium">{dashboardData.upcomingBookings[0].status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Scheduled on {formatDate(dashboardData.upcomingBookings[0].createdAt)}
                      </p>
                      <Link to={`/bookings/${dashboardData.upcomingBookings[0]._id}`} className="text-sm text-blue-600 hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiCalendar className="text-blue-500 text-xl" />
                    </div>
                    <h3 className="text-gray-800 font-medium mb-2">No Upcoming Services</h3>
                    <p className="text-gray-600 mb-4">You don't have any upcoming service appointments.</p>
                    <Link to="/bookings/new" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                      <FiPlus className="mr-1" />
                      Schedule Service
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiShoppingCart className="mr-2 text-purple-600" />
                  Cart Summary
                </h2>
                <Link to="/cart" className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                  View cart <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {dashboardData?.cart?.items?.length > 0 ? (
                  <div>
                    <ul className="space-y-3 mb-4">
                      {dashboardData.cart.items.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-center p-2 border border-gray-100 rounded-lg">
                          <div className="bg-gray-100 w-10 h-10 rounded-md flex items-center justify-center mr-3">
                            <FiPackage className="text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 truncate">{item.sparePart.name}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              <span className="text-sm font-medium text-purple-600">{formatCurrency(item.sparePart.price * item.quantity)}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {dashboardData.cart.items.length > 3 && (
                      <p className="text-xs text-gray-500 mb-3">
                        +{dashboardData.cart.items.length - 3} more item(s) in cart
                      </p>
                    )}
                    
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total</span>
                        <span className="text-lg font-bold text-purple-700">{formatCurrency(getCartTotal())}</span>
                      </div>
                      
                      <div className="mt-3 flex justify-center">
                        <Link to="/checkout" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors w-full text-center">
                          Proceed to Checkout
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiShoppingCart className="text-purple-500 text-xl" />
                    </div>
                    <h3 className="text-gray-800 font-medium mb-2">Your Cart is Empty</h3>
                    <p className="text-gray-600 mb-4">Browse our spare parts catalog to add items to your cart.</p>
                    <Link to="/spare-parts" className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                      <FiTag className="mr-1" />
                      Browse Spare Parts
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent History & Recommended Parts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiFileText className="mr-2 text-green-600" />
                  Recent Service History
                </h2>
                <Link to="/service-history" className="text-sm text-green-600 hover:text-green-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {dashboardData?.serviceHistory?.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {dashboardData.serviceHistory.slice(0, 4).map((service) => (
                      <li key={service._id} className="py-3">
                        <div className="flex items-start">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            service.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {service.status === 'Completed' ? <FiCheckCircle /> : <FiXCircle />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{service.serviceType} - {service.model}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(service.selectedDateTime)} • 
                              <span className={`ml-1 ${
                                service.status === 'Completed' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {service.status}
                              </span>
                            </p>
                          </div>
                          <Link to={`/bookings/${service._id}`} className="text-xs text-blue-600 hover:underline">
                            Details
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No service history found
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommended Parts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FiTag className="mr-2 text-orange-600" />
                  Recommended Parts
                </h2>
                <Link to="/spare-parts" className="text-sm text-orange-600 hover:text-orange-800 flex items-center">
                  View all <FiArrowRight className="ml-1" size={14} />
                </Link>
              </div>
              <div className="p-4">
                {dashboardData?.recommendedParts?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dashboardData.recommendedParts.map((part) => (
                      <div key={part._id} className="p-3 border border-gray-100 rounded-lg hover:border-orange-200 transition-colors">
                        <div className="flex items-center">
                          <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                            <FiPackage className="text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-800">{part.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">{part.brand}</span>
                              <span className="text-sm font-medium text-orange-600">{formatCurrency(part.price)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
                          <Link to={`/spare-parts/${part._id}`} className="text-xs text-blue-600 hover:underline">
                            View Details
                          </Link>
                          <button className="text-xs text-orange-600 hover:text-orange-800 flex items-center">
                            Add to Cart <FiPlus className="ml-1" size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No recommended parts available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Bookings Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Service Bookings</h2>
            <Link to="/bookings/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
              <FiPlus className="mr-1" /> 
              Book Service
            </Link>
          </div>
          
          {/* Upcoming Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <FiCalendar className="text-blue-600 mr-2" />
                Upcoming Services
              </h3>
            </div>
            <div className="p-4">
              {!dashboardData?.upcomingBookings?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCalendar className="text-blue-500 text-xl" />
                  </div>
                  <h3 className="text-gray-800 font-medium mb-2">No Upcoming Services</h3>
                  <p className="text-gray-600 mb-4">You don't have any upcoming service appointments.</p>
                  <Link to="/bookings/new" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                    <FiPlus className="mr-1" />
                    Schedule Service
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.upcomingBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {booking.serviceType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.model} ({booking.year})<br />
                            <span className="text-xs">{booking.registrationNumber}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(booking.selectedDateTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link to={`/bookings/${booking._id}`} className="text-blue-600 hover:text-blue-900">
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Service History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <FiFileText className="text-green-600 mr-2" />
                Service History
              </h3>
            </div>
            <div className="p-4">
              {!dashboardData?.serviceHistory?.length ? (
                <div className="text-center py-6 text-gray-500">
                  No past service records found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.serviceHistory.map((service) => (
                        <tr key={service._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {service.serviceType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {service.model} ({service.year})<br />
                            <span className="text-xs">{service.registrationNumber}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(service.selectedDateTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              service.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {service.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link to={`/bookings/${service._id}`} className="text-blue-600 hover:text-blue-900">
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Cart</h2>
            <Link to="/spare-parts" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
              <FiPlus className="mr-1" /> 
              Add More Items
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {!dashboardData?.cart?.items?.length ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiShoppingCart className="text-purple-500 text-xl" />
                </div>
                <h3 className="text-gray-800 font-medium mb-2">Your Cart is Empty</h3>
                <p className="text-gray-600 mb-4">Browse our spare parts catalog to add items to your cart.</p>
                <Link to="/spare-parts" className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                  <FiTag className="mr-1" />
                  Browse Spare Parts
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.cart.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center mr-3">
                                <FiPackage className="text-gray-600" />
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.sparePart.name}
                                <div className="text-xs text-gray-500">{item.sparePart.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.sparePart.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(item.sparePart.price * item.quantity)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Cart Summary */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-gray-700 font-medium">Subtotal ({dashboardData.cart.items.length} items)</p>
                      <p className="text-gray-500 text-sm">Shipping calculated at checkout</p>
                    </div>
                    <div className="text-xl font-bold text-purple-700">{formatCurrency(getCartTotal())}</div>
                  </div>
                  <div className="flex justify-end">
                    <Link to="/checkout" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Recommended Parts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <FiTag className="text-orange-600 mr-2" />
                Recommended For You
              </h3>
            </div>
            <div className="p-4">
              {!dashboardData?.recommendedParts?.length ? (
                <div className="text-center py-6 text-gray-500">
                  No recommended parts available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardData.recommendedParts.map((part) => (
                    <div key={part._id} className="border border-gray-100 rounded-lg p-4 hover:border-orange-200 transition-colors">
                      <div className="flex items-center mb-3">
                        <div className="bg-orange-50 w-10 h-10 rounded-md flex items-center justify-center mr-3">
                          <FiPackage className="text-orange-500" />
                        </div>
                        <h3 className="font-medium text-gray-800 text-sm">{part.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{part.brand}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-orange-600">{formatCurrency(part.price)}</span>
                        <button className="text-xs bg-orange-50 text-orange-700 hover:bg-orange-100 px-2 py-1 rounded border border-orange-200 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Inquiries</h2>
            <Link to="/inquiries/new" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
              <FiPlus className="mr-1" /> 
              New Inquiry
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <FiMessageSquare className="text-yellow-600 mr-2" />
                Recent Inquiries
              </h3>
            </div>
            <div className="p-4">
              {!dashboardData?.inquiries?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiMessageSquare className="text-yellow-500 text-xl" />
                  </div>
                  <h3 className="text-gray-800 font-medium mb-2">No Inquiries Found</h3>
                  <p className="text-gray-600 mb-4">You haven't submitted any inquiries yet.</p>
                  <Link to="/inquiries/new" className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                    <FiPlus className="mr-1" />
                    Submit an Inquiry
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.inquiries.map((inquiry) => (
                        <tr key={inquiry._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {inquiry.serviceID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inquiry.type === 'feedback' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {inquiry.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {inquiry.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inquiry.status === 'normal' ? 'bg-blue-100 text-blue-800' :
                              inquiry.status === 'important' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {inquiry.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(inquiry.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link to={`/inquiries/${inquiry._id}`} className="text-blue-600 hover:text-blue-900">
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Help & Information */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-white p-3 rounded-full shadow-sm mr-6 mb-4 md:mb-0">
                <FiHelpCircle className="text-yellow-500 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                  Our customer service team is here to help you with any questions or concerns about your vehicle service.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/faq" className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-md text-sm border border-gray-200 flex items-center">
                    <FiInfo className="mr-2" />
                    FAQ
                  </Link>
                  <Link to="/contact" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <FiMessageSquare className="mr-2" />
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
