import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [error, setError] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // Backend API URL - Updated to correct port
  const API_BASE_URL = 'http://localhost:8070';

  useEffect(() => {
    if (isScanning) {
      try {
        const scanner = new Html5QrcodeScanner('reader', {
          qrbox: { width: 250, height: 250 },
          fps: 5,
        });

        scanner.render(onScanSuccess, onScanFailure);
        setScannerInstance(scanner);

        function onScanSuccess(decodedText) {
          console.log("QR code detected:", decodedText);
          setScanResult(decodedText);
          setIsScanning(false);
          
          // Process employee attendance with the scanned ID
          recordAttendance(decodedText);
        }

        function onScanFailure(error) {
          // Don't log every frame error
          // console.warn(`QR scan error: ${error}`);
        }

        return () => {
          if (scanner) {
            try {
              scanner.clear();
            } catch (err) {
              console.error("Error clearing scanner:", err);
            }
          }
        };
      } catch (err) {
        console.error("Scanner initialization error:", err);
        setError(err.message);
        setIsScanning(false);
      }
    }
  }, [isScanning]);

  // Function to mark attendance
  const recordAttendance = async (employeeId) => {
    try {
      setStatus('processing');
      setMessage('Processing attendance...');
      setEmployeeDetails(null);

      console.log("Sending request to mark attendance for employee:", employeeId);

      const response = await axios.post(`${API_BASE_URL}/api/attendance/mark`, {
        employeeId: employeeId,
        location: "Office" // Add location as your backend expects it
      });

      console.log("API response:", response.data);

      if (response.data.success) {
        setStatus('success');
        
        // Set employee details if available
        if (response.data.employee) {
          setEmployeeDetails(response.data.employee);
        }
        
        // Set appropriate message based on check-in or check-out
        if (response.data.isCheckIn) {
          setMessage(`Checked In: ${response.data.message}`);
        } else {
          setMessage(`Checked Out: ${response.data.message}`);
        }
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Attendance processing error:', error);
      setStatus('error');
      
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || `Server error (${error.response.status})`}`);
      } else if (error.request) {
        setMessage('Error: No response from server. Please check your connection.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
    }

    // Restart scanner after 5 seconds
    setTimeout(() => {
      if (scannerInstance) {
        try {
          scannerInstance.clear();
        } catch (err) {
          console.error("Error clearing scanner:", err);
        }
      }
      startScanning();
    }, 5000);
  };

  const startScanning = () => {
    setScanResult(null);
    setMessage('');
    setStatus('');
    setError(null);
    setEmployeeDetails(null);
    setIsScanning(true);
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Attendance Scanner</h2>
      
      {error && (
        <div className="w-full mb-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">
          <p className="font-bold text-red-700">Error:</p>
          <p className="mt-1">{error}</p>
          <button 
            onClick={() => { setError(null); setIsScanning(false); }}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {!isScanning && !scanResult && !error && (
        <button
          onClick={startScanning}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Start Scanning
        </button>
      )}

      {isScanning && !error && (
        <div className="w-full mb-6">
          <div id="reader" className="w-full border-2 border-gray-300 rounded-lg overflow-hidden"></div>
          <p className="mt-3 text-center text-sm text-gray-600">Position QR code within the frame</p>
        </div>
      )}

      {scanResult && !error && (
        <div className="text-center mb-6 w-full">
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-gray-700">Employee ID: <span className="font-semibold text-gray-900">{scanResult}</span></p>
          </div>
          
          {employeeDetails && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Employee Details</h3>
              <p className="text-gray-700">Name: <span className="font-semibold">{employeeDetails.name}</span></p>
              <p className="text-gray-700">Position: <span className="font-semibold">{employeeDetails.position}</span></p>
            </div>
          )}
          
          {status === 'processing' && (
            <div className="text-yellow-700 p-4 rounded-lg bg-yellow-100 w-full border border-yellow-200">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{message}</span>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-700 p-4 rounded-lg bg-green-100 w-full border border-green-200">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{message}</span>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-700 p-4 rounded-lg bg-red-100 w-full border border-red-200">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{message}</span>
              </div>
            </div>
          )}
          
          <p className="text-gray-500 mt-4 italic">Scanner will restart automatically in 5 seconds...</p>
        </div>
      )}
      
      <div className="mt-2 p-4 text-sm text-gray-600 bg-gray-50 rounded-lg w-full">
        <h3 className="font-medium text-gray-700 mb-2">Instructions:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Scan employee QR codes to mark attendance</li>
          <li>Ensure adequate lighting for better scanning</li>
          <li>Hold the QR code steady within the scanner frame</li>
        </ul>
      </div>
    </div>
  );
};

export default QRScanner;
