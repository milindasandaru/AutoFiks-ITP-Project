import React from "react";

const DownloadQR = ({ qrCode, employeeName }) => {
  const handleDownload = () => {
    // Check if qrCode is valid
    if (!qrCode || !qrCode.startsWith('data:image')) {
      console.error('Invalid QR code data URL');
      alert('QR code is not available for download');
      return;
    }

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${employeeName.replace(/\s+/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Validate QR code before rendering
  if (!qrCode || !qrCode.startsWith('data:image')) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">QR Code Not Available</h2>
        <div className="w-48 h-48 border p-2 rounded-lg flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">QR code unavailable</span>
        </div>
        <button
          disabled
          className="mt-3 px-4 py-2 bg-gray-400 text-white rounded-md shadow-md cursor-not-allowed"
        >
          Download QR Code
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Your QR Code</h2>
      <img src={qrCode} alt="Employee QR Code" className="w-48 h-48 border p-2 rounded-lg" />
      <button
        onClick={handleDownload}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default DownloadQR;
