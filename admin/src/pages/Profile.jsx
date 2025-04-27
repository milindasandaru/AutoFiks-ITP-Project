import React, { useState } from "react";
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaCog, FaLock, FaBell, FaHistory } from "react-icons/fa";

const AdminProfile = () => {
  // State for admin and company details (in a real app, this would come from an API)
  const [adminInfo] = useState({
    name: "Admin User",
    email: "admin@autofix.lk",
    phone: "+94 77 123 4567",
    role: "System Administrator",
    joinedDate: "January 15, 2023",
    lastLogin: "April 28, 2025, 09:14 AM"
  });

  const [companyInfo] = useState({
    name: "Autofix Lanka",
    address: "123 Galle Road, Colombo 03, Sri Lanka",
    phone: "+94 11 234 5678",
    email: "info@autofix.lk",
    website: "www.autofix.lk",
    regNumber: "REG789012345",
    vatNumber: "VAT123456789",
    businessHours: "Mon-Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 5:00 PM"
  });

  // Tabs for profile sections
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="bg-white p-2 rounded-full shadow-sm border border-blue-100 mb-4 md:mb-0 md:mr-6">
              <div className="bg-blue-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl">
                {adminInfo.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{adminInfo.name}</h1>
              <p className="text-indigo-600 font-medium mb-2">{adminInfo.role}</p>
              <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" />
                  {adminInfo.email}
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  {adminInfo.phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="px-6 border-b border-gray-100">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-4 font-medium text-sm mr-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "profile" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaUser className="inline-block mr-2" />
              Admin Profile
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`py-4 px-4 font-medium text-sm mr-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "company" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaBuilding className="inline-block mr-2" />
              Company Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-4 font-medium text-sm mr-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "security" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaLock className="inline-block mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "settings" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaCog className="inline-block mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FaHistory className="mr-2" /> Activity Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-blue-50">
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="font-medium">{adminInfo.joinedDate}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-50">
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-medium">{adminInfo.lastLogin}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">System Access & Permissions</h3>
                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">Employee Management</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
                            Full Access
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">Spare Parts Inventory</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
                            Full Access
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">Service Scheduling</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
                            Full Access
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">Financial Reports</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
                            Full Access
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">User Management</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-50 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
                            Full Access
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 flex flex-col md:flex-row">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{companyInfo.name}</h3>
                  <p className="text-gray-600 mb-4">Automobile Service Center</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                      <span className="text-gray-700">{companyInfo.address}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{companyInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{companyInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FaGlobe className="text-gray-500 mr-2" />
                      <span className="text-gray-700">{companyInfo.website}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center md:ml-6 mt-6 md:mt-0">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="w-32 h-32 flex items-center justify-center text-blue-600">
                      <FaBuilding className="w-full h-full opacity-20" />
                      <div className="absolute text-xl font-bold text-blue-600">LOGO</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Business Information</h3>
                  <div className="bg-white p-5 rounded-lg border border-gray-100 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Registration Number</p>
                      <p className="font-medium text-gray-800">{companyInfo.regNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">VAT Number</p>
                      <p className="font-medium text-gray-800">{companyInfo.vatNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Type</p>
                      <p className="font-medium text-gray-800">Private Limited Company</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Established</p>
                      <p className="font-medium text-gray-800">2015</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Operation Hours</h3>
                  <div className="bg-white p-5 rounded-lg border border-gray-100">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Monday - Friday</span>
                        <span className="text-gray-600">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday</span>
                        <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday</span>
                        <span className="text-gray-600">Closed</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <span className="font-medium">Public Holidays</span>
                        <p className="text-gray-600 mt-1">Closed on all government holidays</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Company Description</h3>
                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  <p className="text-gray-700">
                    Autofix Lanka is a premier automobile service center specializing in repair, maintenance, and spare parts 
                    for all major vehicle brands. With over 8 years of experience, our certified technicians provide top-quality 
                    service using the latest diagnostic equipment and genuine spare parts. We are committed to excellence, 
                    transparency, and customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <p className="text-gray-500 italic">Security settings will be implemented in future updates.</p>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <FaBell className="mr-2" /> Coming Soon
                </h3>
                <p className="text-yellow-700">
                  This section will include password management, two-factor authentication settings, 
                  and login activity monitoring features.
                </p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <p className="text-gray-500 italic">System settings will be implemented in future updates.</p>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <FaBell className="mr-2" /> Coming Soon
                </h3>
                <p className="text-yellow-700">
                  This section will include theme preferences, notification settings, 
                  language options, and system configuration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
