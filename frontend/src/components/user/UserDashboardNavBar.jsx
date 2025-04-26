import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faTicketAlt,
  faTruckMoving,
  faWallet,
  faUser,
  faLifeRing,
  faHome,
  faBell,
  faCogs,
  faPhoneSquare,
  faShoppingCart,
  faStoreAlt 
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/AMS_logo2.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // Get current route

  const menuItems = [
    { name: "Overview", path: "/overview", icon: faHome },
    { name: "Store", path: "/overview/spare-parts", icon: faCogs },
    { name: "Cart", path: "/overview/cart", icon: faShoppingCart },
    {
      name: "Shedule a Service",
      path: "/overview/service-ticket",
      icon: faTicketAlt,
    },
    { name: "Live Tracking", path: "/overview/tracking", icon: faTruckMoving },
    { name: "Payment", path: "/overview/payment", icon: faWallet },
    
    { name: "Contact us", path: "/overview/inquiries/manage", icon: faPhoneSquare },
  ];

  const settingItems = [
    { name: "Profile", path: "/overview/user-profile", icon: faUser },
    { name: "Help Center", path: "/overview/help-center", icon: faLifeRing },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-80" : "w-0"
        } bg-white h-screen shadow-md fixed top-0 left-0 transition-all duration-300 z-10 overflow-hidden`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Header with Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="w-max-content h-20 place-items-center">
            <img src={logo} className="h-[75px]" alt="Logo" />
          </div>
          <button onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <h3 className="text-gray-400 text-sm px-4 mt-6 uppercase">Menu</h3>
          <ul className="px-2 m-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    location.pathname === item.path
                      ? "text-blue-600 bg-blue-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>

          {/* Settings Section */}
          <h3 className="text-gray-400 text-sm px-4 mt-6 uppercase">
            Settings
          </h3>
          <ul className="px-2 m-4">
            {settingItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    location.pathname === item.path
                      ? "text-blue-600 bg-blue-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div
        className={`${
          isOpen ? "ml-80" : "ml-0"
        } p-4 w-full transition-all duration-300`}
      >
        {/* Toggle Sidebar Button (only visible when the sidebar is closed) */}
        {!isOpen && (
          <button
            className="text-gray-600 bg-white p-2 rounded-lg shadow-md fixed left-4 top-4 z-20"
            onClick={() => setIsOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}

        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Sidebar;
