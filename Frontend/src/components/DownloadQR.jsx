import React from "react";

const DownloadQR = ({ qrCode, employeeName }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${employeeName}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
