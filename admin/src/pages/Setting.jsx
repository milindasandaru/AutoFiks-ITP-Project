import React, { useState } from "react";
import { 
  FaCog, 
  FaPalette, 
  FaBell, 
  FaGlobe, 
  FaLock, 
  FaShieldAlt, 
  FaDatabase, 
  FaInfoCircle,
  FaCheck,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaEnvelope,
  FaMobileAlt,
  FaDownload,
  FaUpload
} from "react-icons/fa";

const AdminSettings = () => {
  // State for active settings section
  const [activeSection, setActiveSection] = useState("appearance");

  // Function to render the settings sidebar item
  const SidebarItem = ({ icon, title, id, badge }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
        activeSection === id 
          ? "bg-blue-50 text-blue-600 font-medium" 
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </div>
      {badge && (
        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      {activeSection === id && (
        <FaChevronRight className="ml-2 h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaCog className="mr-2 text-blue-500" />
        System Settings
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Sidebar */}
          <div className="w-full md:w-1/4 border-r border-gray-100">
            <div className="p-4">
              <div className="space-y-1">
                <SidebarItem 
                  icon={<FaPalette className="h-5 w-5 text-purple-500" />} 
                  title="Appearance" 
                  id="appearance" 
                />
                <SidebarItem 
                  icon={<FaBell className="h-5 w-5 text-orange-500" />} 
                  title="Notifications" 
                  id="notifications"
                  badge="New" 
                />
                <SidebarItem 
                  icon={<FaGlobe className="h-5 w-5 text-green-500" />} 
                  title="Language & Region" 
                  id="language" 
                />
                <SidebarItem 
                  icon={<FaLock className="h-5 w-5 text-red-500" />} 
                  title="Privacy" 
                  id="privacy" 
                />
                <SidebarItem 
                  icon={<FaShieldAlt className="h-5 w-5 text-indigo-500" />} 
                  title="Security" 
                  id="security" 
                />
                <SidebarItem 
                  icon={<FaDatabase className="h-5 w-5 text-teal-500" />} 
                  title="Data Management" 
                  id="data" 
                />
                <SidebarItem 
                  icon={<FaInfoCircle className="h-5 w-5 text-blue-500" />} 
                  title="About System" 
                  id="about" 
                />
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="w-full md:w-3/4 p-6">
            {/* Appearance Settings */}
            {activeSection === "appearance" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Theme</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="border border-blue-200 bg-white rounded-lg p-3 flex items-center cursor-pointer relative hover:bg-blue-50 transition-colors">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <FaSun className="text-blue-500" />
                        </div>
                        <span className="ml-3 text-gray-700">Light Mode</span>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaCheck className="text-white text-xs" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 bg-white rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                          <FaMoon className="text-gray-100" />
                        </div>
                        <span className="ml-3 text-gray-700">Dark Mode</span>
                      </div>
                      
                      <div className="border border-gray-200 bg-white rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <FaCog className="text-white" />
                        </div>
                        <span className="ml-3 text-gray-700">System Default</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Color Scheme</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="border border-blue-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:bg-blue-50 transition-colors">
                        <div className="w-full h-8 bg-blue-500 rounded-md mb-2"></div>
                        <span className="text-sm text-gray-700">Blue (Default)</span>
                      </div>
                      
                      <div className="border border-gray-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-full h-8 bg-green-500 rounded-md mb-2"></div>
                        <span className="text-sm text-gray-700">Green</span>
                      </div>
                      
                      <div className="border border-gray-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-full h-8 bg-purple-500 rounded-md mb-2"></div>
                        <span className="text-sm text-gray-700">Purple</span>
                      </div>
                      
                      <div className="border border-gray-200 bg-white rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-full h-8 bg-red-500 rounded-md mb-2"></div>
                        <span className="text-sm text-gray-700">Red</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Layout Options</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700">Compact Sidebar</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700">Fixed Header</span>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Reset to Default
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Settings */}
            {activeSection === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Email Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="text-gray-700">Employee Leave Requests</p>
                          <p className="text-xs text-gray-500">Receive notifications for new leave requests</p>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="text-gray-700">Service Bookings</p>
                          <p className="text-xs text-gray-500">Receive notifications for new service bookings</p>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="text-gray-700">Low Inventory Alerts</p>
                          <p className="text-xs text-gray-500">Receive notifications when parts stock is low</p>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-gray-700">System Updates</p>
                          <p className="text-xs text-gray-500">Receive notifications about system updates</p>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Notification Delivery</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <FaEnvelope className="text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">Email</p>
                          <p className="text-sm text-gray-600">admin@autofix.lk</p>
                        </div>
                        <button className="ml-auto text-blue-600 text-sm">Change</button>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <FaMobileAlt className="text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">SMS</p>
                          <p className="text-sm text-gray-600">Not configured</p>
                        </div>
                        <button className="ml-auto text-blue-600 text-sm">Set up</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other sections - coming soon */}
            {(activeSection === "language" || 
              activeSection === "privacy" || 
              activeSection === "security" || 
              activeSection === "data" || 
              activeSection === "about") && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {activeSection === "language" && "Language & Region Settings"}
                  {activeSection === "privacy" && "Privacy Settings"}
                  {activeSection === "security" && "Security Settings"}
                  {activeSection === "data" && "Data Management"}
                  {activeSection === "about" && "About System"}
                </h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {activeSection === "language" && <FaGlobe className="text-blue-500 text-2xl" />}
                    {activeSection === "privacy" && <FaLock className="text-blue-500 text-2xl" />}
                    {activeSection === "security" && <FaShieldAlt className="text-blue-500 text-2xl" />}
                    {activeSection === "data" && <FaDatabase className="text-blue-500 text-2xl" />}
                    {activeSection === "about" && <FaInfoCircle className="text-blue-500 text-2xl" />}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Coming Soon</h3>
                  
                  <p className="text-blue-600 mb-4">
                    {activeSection === "language" && "Language preferences and regional settings will be available in the next update."}
                    {activeSection === "privacy" && "Privacy controls and data protection settings will be available soon."}
                    {activeSection === "security" && "Enhanced security features including two-factor authentication will be added soon."}
                    {activeSection === "data" && "Tools for backup, restore and data management will be implemented in a future release."}
                    {activeSection === "about" && "System information, version details and update history will be available soon."}
                  </p>
                  
                  {activeSection === "data" && (
                    <div className="flex justify-center space-x-4 mt-4">
                      <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <FaDownload className="mr-2" /> Export Data
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <FaUpload className="mr-2" /> Import Data
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
