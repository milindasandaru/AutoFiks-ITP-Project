import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EmployeeSalaryView = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSalary, setActiveSalary] = useState(null);
  const navigate = useNavigate();

  // Base URL for API requests
  const API_BASE_URL = 'http://localhost:8070/api';

  // Fetch salary data
  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/salary/my-salaries`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setSalaries(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to load salary data');
        }
      } catch (err) {
        console.error('Error fetching salaries:', err);
        setError(err.message || 'Failed to load salary data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [API_BASE_URL]);

  // Fetch salary details
  const fetchSalaryDetails = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/salary/detail/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setActiveSalary(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to load salary details');
      }
    } catch (err) {
      console.error('Error fetching salary details:', err);
      setError(err.message || 'Failed to load salary details. Please try again.');
    }
  };

  // PDF generation function
  const generatePDF = async () => {
    if (!activeSalary) return;

    const salaryElement = document.getElementById('salary-details');
    if (!salaryElement) return;

    try {
      // Show loading state
      setGeneratingPDF(true);

      // Create canvas from the salary details div
      const canvas = await html2canvas(salaryElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Initialize PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Add title
      pdf.setFontSize(16);
      pdf.text('Salary Slip', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(activeSalary.period.label, 105, 22, { align: 'center' });

      // Calculate dimensions
      const imgWidth = 190;
      const pageHeight = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 30; // Starting position after the title

      // Add the canvas as an image
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content overflows
      while (heightLeft > 0) {
        position = 0;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`Salary_Slip_${activeSalary.period.label.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error message to user
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Add state variable
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg font-semibold text-gray-700">Loading salary data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Salary Records</h1>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Salary List */}
          <div className={`bg-white rounded-lg shadow-md overflow-hidden ${activeSalary ? 'hidden md:block md:col-span-1' : 'col-span-3'}`}>
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800">Salary History</h2>
            </div>

            {salaries.length === 0 ? (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="mt-4 text-gray-600">No salary records available yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <li
                    key={salary._id}
                    className={`p-4 hover:bg-gray-50 transition duration-150 cursor-pointer ${activeSalary && activeSalary._id === salary._id ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchSalaryDetails(salary._id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{salary.period.label}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(salary.period.startDate)} - {formatDate(salary.period.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{formatCurrency(salary.calculations.netSalary)}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${salary.status === 'paid' ? 'bg-green-100 text-green-800' :
                            salary.status === 'finalized' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Salary Details */}
          {activeSalary && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
              <div className="p-4 md:flex md:justify-between md:items-center bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-gray-800">Salary Details</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={generatePDF}
                    disabled={generatingPDF || !activeSalary}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
                  >
                    {generatingPDF ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSalary(null)}
                    className="mt-2 md:mt-0 text-gray-600 hover:text-gray-800 md:hidden"
                  >
                    ← Back to list
                  </button>
                </div>
              </div>

              <div id="salary-details" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">{activeSalary.period.label}</h1>
                    <p className="text-sm text-gray-500">
                      {formatDate(activeSalary.period.startDate)} - {formatDate(activeSalary.period.endDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm rounded-full ${activeSalary.status === 'paid' ? 'bg-green-100 text-green-800' :
                        activeSalary.status === 'finalized' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {activeSalary.status.charAt(0).toUpperCase() + activeSalary.status.slice(1)}
                    </span>
                    {activeSalary.paymentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Paid on: {formatDate(activeSalary.paymentDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Salary Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Basic Salary</p>
                      <p className="text-lg font-semibold text-gray-800">{formatCurrency(activeSalary.basicSalary)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Salary</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(activeSalary.calculations.netSalary)}</p>
                    </div>
                  </div>
                </div>

                {/* Rest of your existing components... */}
                {/* Attendance Summary, Leave Summary, Salary Breakdown, etc. */}
                {/* Attendance Summary */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Attendance Summary</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Working Days</p>
                        <p className="text-lg font-semibold text-gray-800">{activeSalary.workingDays.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Present</p>
                        <p className="text-lg font-semibold text-green-600">{activeSalary.workingDays.present}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Half Day</p>
                        <p className="text-lg font-semibold text-yellow-600">{activeSalary.workingDays.halfDay}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Absent</p>
                        <p className="text-lg font-semibold text-red-600">{activeSalary.workingDays.absent}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Late</p>
                        <p className="text-lg font-semibold text-orange-600">{activeSalary.workingDays.late}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leave Summary */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Leave Summary</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total Leave</p>
                        <p className="text-lg font-semibold text-gray-800">{activeSalary.workingDays.leave.approved}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Sick</p>
                        <p className="text-lg font-semibold text-blue-600">{activeSalary.workingDays.leave.sick}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Casual</p>
                        <p className="text-lg font-semibold text-purple-600">{activeSalary.workingDays.leave.casual}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Annual</p>
                        <p className="text-lg font-semibold text-green-600">{activeSalary.workingDays.leave.annual}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Other</p>
                        <p className="text-lg font-semibold text-gray-600">{activeSalary.workingDays.leave.other}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Salary Breakdown</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      <div className="p-4 flex justify-between">
                        <p className="text-gray-700">Basic Salary</p>
                        <p className="font-medium text-gray-900">{formatCurrency(activeSalary.calculations.basicPayment)}</p>
                      </div>

                      <div className="p-4 bg-red-50">
                        <p className="text-gray-700 font-medium mb-2">Deductions</p>

                        <div className="ml-4 space-y-2">
                          <div className="flex justify-between">
                            <p className="text-gray-600">Absent/Late/Half-day</p>
                            <p className="font-medium text-red-600">-{formatCurrency(activeSalary.calculations.deductions.absences)}</p>
                          </div>

                          <div className="flex justify-between">
                            <p className="text-gray-600">Tax</p>
                            <p className="font-medium text-red-600">-{formatCurrency(activeSalary.calculations.deductions.tax)}</p>
                          </div>

                          {activeSalary.calculations.deductions.other > 0 && (
                            <div className="flex justify-between">
                              <p className="text-gray-600">Other Deductions</p>
                              <p className="font-medium text-red-600">-{formatCurrency(activeSalary.calculations.deductions.other)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 flex justify-between font-bold">
                        <p className="text-gray-800">Total Net Salary</p>
                        <p className="text-green-600">{formatCurrency(activeSalary.calculations.netSalary)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {activeSalary.notes && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-700">{activeSalary.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryView;
