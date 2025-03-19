/*import QRScanner from "../../components/QRScanner";

const AttendancePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">Employee Attendance</h1>
      <QRScanner />
    </div>
  );
};

export default AttendancePage;
*/

//QR Scanner Component

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const AttendancePage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(onScanSuccess, onScanFailure);

      function onScanSuccess(decodedText) {
        scanner.clear();
        setScanResult(decodedText);
        setIsScanning(false);
        processAttendance(decodedText);
      }

      function onScanFailure(error) {
        console.warn(`QR scan error: ${error}`);
      }

      // Cleanup function
      return () => {
        scanner.clear();
      };
    }
  }, [isScanning]);

  const processAttendance = async (employeeId) => {
    try {
      setStatus('processing');
      setMessage('Processing attendance...');

      // Check if the employee exists
      const employeeCheck = await axios.get(`http://localhost:4000/employees?employeeId=${employeeId}`);
      
      if (!employeeCheck.data || employeeCheck.data.length === 0) {
        setStatus('error');
        setMessage('Invalid employee QR code');
        return;
      }

      // Determine if this is clock-in or clock-out
      // For simplicity, we'll always try to clock in first, and if that fails, we'll try to clock out
      try {
        const clockInResponse = await axios.post('http://localhost:4000/employees/attendance/clock-in', {
          employeeId
        });
        setStatus('success');
        setMessage(`Clock in successful at ${new Date().toLocaleTimeString()}`);
      } catch (clockInError) {
        // If clock-in failed, try clock-out
        if (clockInError.response && clockInError.response.status === 400) {
          try {
            const clockOutResponse = await axios.post('http://localhost:4000/employees/attendance/clock-out', {
              employeeId
            });
            setStatus('success');
            setMessage(`Clock out successful at ${new Date().toLocaleTimeString()}. Hours worked: ${clockOutResponse.data.hoursWorked}`);
          } catch (clockOutError) {
            setStatus('error');
            setMessage(clockOutError.response?.data?.message || 'Error processing attendance');
          }
        } else {
          setStatus('error');
          setMessage(clockInError.response?.data?.message || 'Error processing attendance');
        }
      }
    } catch (error) {
      console.error('Error processing attendance:', error);
      setStatus('error');
      setMessage('Error processing attendance. Please try again.');
    }
  };

  const startScanning = () => {
    setScanResult(null);
    setMessage('');
    setStatus('');
    setIsScanning(true);
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee Attendance Scanner</h2>
      
      {!isScanning && !scanResult && (
        <button
          onClick={startScanning}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition mb-4"
        >
          Start Scanning
        </button>
      )}

      {isScanning && (
        <div className="w-full mb-4">
          <div id="reader" className="w-full"></div>
        </div>
      )}

      {scanResult && (
        <div className="text-center mb-4">
          <p className="mb-2">Employee ID: <strong>{scanResult}</strong></p>
          
          {status === 'processing' && (
            <p className="text-yellow-500">{message}</p>
          )}
          
          {status === 'success' && (
            <p className="text-green-500">{message}</p>
          )}
          
          {status === 'error' && (
            <p className="text-red-500">{message}</p>
          )}
          
          <button
            onClick={startScanning}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Scan Another
          </button>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Scan employee QR codes to mark attendance</p>
        <p>Position the QR code within the scanner frame</p>
      </div>
    </div>
  );
};

export default AttendancePage;