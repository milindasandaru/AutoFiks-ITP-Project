import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../store/employeeStore.js";
import DownloadQR from "../../components/employee/DownloadQR.jsx";

const Profile = () => {
  const { fetchEmployeeProfile, downloadQRCode, employee, isLoading, error } = useEmployeeStore();
  const [qrError, setQrError] = useState(null);

  useEffect(() => {
    fetchEmployeeProfile();
  }, [fetchEmployeeProfile]);

  useEffect(() => {
    // Check if employee data is loaded but QR code is missing
    if (employee && (!employee.qrCode || !employee.qrCode.startsWith('data:image'))) {
      setQrError("QR code is not available or invalid");
      console.error("Invalid QR code:", employee.qrCode);
    } else {
      setQrError(null);
    }
  }, [employee]);

  if (isLoading) return (
    <div className="min-h-[815px] flex justify-center items-center">
      <div className="text-center">
        <svg className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-gray-600">Loading profile information...</p>
      </div>
    </div>
  );
  
  if (error || !employee) return (
    <div className="min-h-[815px] flex justify-center items-center">
      <div className="text-center p-8 max-w-md mx-auto bg-red-50 rounded-lg border border-red-200">
        <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-xl font-bold text-red-700 mb-2">Profile Error</h2>
        <p className="text-gray-700">{error || "We couldn't find the employee profile you're looking for."}</p>
      </div>
    </div>
  );

  // Add this console log to check what data we have
  console.log("Employee data:", employee);
  console.log("QR code available:", !!employee.qrCode);

  return (
    <div className="min-h-[600px] max-w-[1535px] mx-auto p-3 lg:p-10 flex flex-col justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 text-white">
          <h1 className="text-2xl font-bold text-center">Employee Profile</h1>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-1 bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <h2 className="text-xl font-semibold mb-6 text-blue-800 border-b pb-2 border-blue-200">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <span className="font-medium text-gray-800 text-lg">{employee.name}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Email Address</span>
                  <span className="font-medium text-gray-800">{employee.mail}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Phone Number</span>
                  <span className="font-medium text-gray-800">{employee.phone}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Date of Birth</span>
                  <span className="font-medium text-gray-800">{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Gender</span>
                  <span className="font-medium text-gray-800">{employee.gender}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">NIC</span>
                  <span className="font-medium text-gray-800">{employee.nic}</span>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Employment Details */}
            <div className="lg:col-span-1 bg-indigo-50 rounded-xl p-6 shadow-sm border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-indigo-800 border-b pb-2 border-indigo-200">Employment Details</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Employee ID</span>
                  <span className="font-medium text-gray-800 bg-white px-3 py-1 rounded-lg inline-block border border-indigo-200">{employee.employeeId}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Position</span>
                  <span className="font-medium text-gray-800">{employee.position}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Salary (Per hour)</span>
                  <span className="font-medium text-gray-800">LKR{employee.salary}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Joined Date</span>
                  <span className="font-medium text-gray-800">{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - QR Code */}
            <div className="lg:col-span-1 bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100 flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold mb-6 text-purple-800 text-center">Employee QR Code</h2>
              
              {qrError ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-16 w-16 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <p className="text-gray-700 mb-2 font-medium">QR Code Error</p>
                  <p className="text-sm text-gray-600">{qrError}</p>
                  <p className="text-sm text-gray-600 mt-2">Please contact your administrator to regenerate your QR code.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                    <DownloadQR qrCode={employee.qrCode} employeeName={employee.name} />
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Scan this QR code to mark your attendance
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            Last updated: {employee.updatedAt ? new Date(employee.updatedAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;