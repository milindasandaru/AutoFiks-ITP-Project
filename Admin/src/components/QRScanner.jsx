/*import { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";

const QRScanner = () => {
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  const handleScan = async (data) => {
    if (data) {
      const qrValue = data?.text || data;
      setResult(qrValue);

      try {
        const response = await axios.post("http://localhost:5000/attendance/mark", {
          qrCode: qrValue,
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Error marking attendance");
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Scan Employee QR Code</h2>

      <div className="w-72 h-72 border-4 border-gray-500 rounded-lg overflow-hidden">
        <QrReader
          onResult={handleScan}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {result && (
        <p className="mt-4 text-lg font-medium text-blue-600">Scanned QR Code: {result}</p>
      )}
      
      {message && (
        <p className={`mt-2 text-lg font-semibold ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default QRScanner;
*/