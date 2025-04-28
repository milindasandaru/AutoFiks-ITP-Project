// Header.jsx
import { useState, useEffect, useRef } from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { FaCheckCircle, FaCalendarAlt, FaClock, FaTools } from "react-icons/fa";
import User_img from "../../assets/images/User_img.png";
import axios from "axios";
import { Link } from "react-router-dom";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);
  const [userName, setUserName] = useState("User");

  // Format current date
  const today = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const parts = today.toLocaleDateString("en-US", options).split(", ");
  const formattedDate = `${parts[0]}, ${parts[1].split(" ")[1]} ${
    parts[1].split(" ")[0]
  } ${parts[2]}`;

  // Fetch user profile and notifications
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/employees/profile', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setUserName(response.data.employee.name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // This would be your real API endpoint for notifications
        // For now, we'll use a dummy notification list
        setNotifications([
          {
            id: 1,
            type: "leave",
            message: "Your leave request has been approved",
            time: "2 hours ago",
            isRead: false,
            icon: <FaCheckCircle className="text-green-500" />
          },
          {
            id: 2,
            type: "schedule",
            message: "New task assigned: Oil Change Service",
            time: "3 hours ago",
            isRead: false,
            icon: <FaTools className="text-blue-500" />
          },
          {
            id: 3,
            type: "attendance",
            message: "You forgot to check out yesterday",
            time: "1 day ago",
            isRead: true,
            icon: <FaClock className="text-amber-500" />
          },
          {
            id: 4,
            type: "schedule",
            message: "Reminder: Team meeting tomorrow at 10 AM",
            time: "1 day ago",
            isRead: true,
            icon: <FaCalendarAlt className="text-purple-500" />
          }
        ]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchNotifications();
  }, []);

  // Handle clicks outside the notification panel to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
      <div className="mt-1">
        <h1 className="text-lg font-bold text-gray-800">Welcome, {userName}</h1>
        <p className="text-gray-500 text-sm font-medium">{formattedDate}</p>
      </div>

      <div className="flex items-center space-x-5">
        <div className="relative" ref={notificationRef}>
          <button
            className="relative text-2xl text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <HiOutlineBellAlert size={26} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-red-500 text-white font-bold text-[9px] w-4 h-4 aspect-square rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                <div className="flex gap-2">
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <li 
                        key={notification.id} 
                        className={`p-3 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                              {notification.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">{notification.message}</p>
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
              </div>
              
              <div className="p-2 border-t border-gray-200 text-center">
                <Link to="/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <img
            src={User_img}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
