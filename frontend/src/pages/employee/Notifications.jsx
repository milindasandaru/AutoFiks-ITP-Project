// pages/Notifications.jsx
import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/NotificationService';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaTools, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call the API
      // For now, we'll use dummy data
      setTimeout(() => {
        setNotifications([
          {
            id: 1,
            type: 'leave',
            message: 'Your leave request has been approved',
            time: '2 hours ago',
            date: '2025-04-27T10:30:00',
            isRead: false,
            icon: <FaCheckCircle className="text-green-500" />
          },
          {
            id: 2,
            type: 'task',
            message: 'New task assigned: Oil Change Service',
            time: '3 hours ago',
            date: '2025-04-27T09:15:00',
            isRead: false,
            icon: <FaTools className="text-blue-500" />
          },
          {
            id: 3,
            type: 'attendance',
            message: 'You forgot to check out yesterday',
            time: '1 day ago',
            date: '2025-04-26T17:00:00',
            isRead: true,
            icon: <FaClock className="text-amber-500" />
          },
          {
            id: 4,
            type: 'schedule',
            message: 'Reminder: Team meeting tomorrow at 10 AM',
            time: '1 day ago',
            date: '2025-04-26T15:30:00',
            isRead: true,
            icon: <FaCalendarAlt className="text-purple-500" />
          },
          {
            id: 5,
            type: 'task',
            message: 'Task completed: Brake Pad Replacement',
            time: '2 days ago',
            date: '2025-04-25T14:20:00',
            isRead: true,
            icon: <FaTools className="text-green-500" />
          },
          {
            id: 6,
            type: 'leave',
            message: 'John Doe has requested leave approval',
            time: '3 days ago',
            date: '2025-04-24T11:45:00',
            isRead: true,
            icon: <FaCalendarAlt className="text-red-500" />
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // In a real app, would call API
      // await markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError('Failed to mark notifications as read');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // In a real app, would call API
      // await markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">Notifications</h1>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'unread' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button 
              onClick={() => setFilter('task')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'task' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Tasks
            </button>
            <button 
              onClick={() => setFilter('leave')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'leave' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Leaves
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <p className="text-gray-600 text-sm">
            {filter === 'all' 
              ? 'All notifications' 
              : filter === 'unread' 
                ? 'Unread notifications' 
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} notifications`
            }
          </p>
          <button 
            onClick={handleMarkAllRead}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Mark all as read
          </button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50" : ""}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                      {notification.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? "font-semibold" : ""} text-gray-800`}>{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {filteredNotifications.length > 0 && (
          <div className="p-4 text-center text-gray-500 bg-gray-50 border-t border-gray-200">
            You've reached the end of your notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
