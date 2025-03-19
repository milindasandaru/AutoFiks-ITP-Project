/*import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/employees/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((response) => setEmployee(response.data))
    .catch((error) => console.error("Error fetching employee data", error));
  }, []);

  if (!employee) return <p className="text-center text-lg">Loading...</p>;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = employee.qrCode;
    link.download = `${employee.name}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">{employee.name}</h1>
      <p className="text-gray-600">Employee ID: {employee.employeeId}</p>

      <div className="mt-6">
        <img src={employee.qrCode} alt="Employee QR Code" className="w-48 h-48 border p-2 rounded-lg shadow-md" />
      </div>

      <button
        onClick={handleDownload}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default Profile;
*/
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/employees/me") // ✅ Change port from 5000 to 4000
      .then((response) => {
        console.log("Employee Data:", response.data);
        setEmployee(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data", error);
        setError("Failed to load employee data");
      });
  }, []);

  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
  if (!employee) return <p className="text-center text-lg">Loading...</p>;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = employee.qrCode;
    link.download = `${employee.name}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">{employee.name}</h1>
      <p className="text-gray-600">Employee ID: {employee.employeeId}</p>

      <div className="mt-6">
        <img src={employee.qrCode} alt="Employee QR Code" className="w-48 h-48 border p-2 rounded-lg shadow-md" />
      </div>

      <button
        onClick={handleDownload}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default Profile;
