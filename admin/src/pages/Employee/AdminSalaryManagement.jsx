import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSalary, setActiveSalary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [generating, setGenerating] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  const API_BASE_URL = 'http://localhost:8070/api';

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [empRes, salRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/employees`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/salary/all`, { withCredentials: true })
        ]);

        if (Array.isArray(empRes.data)) setEmployees(empRes.data);
        if (salRes.data.success) setSalaries(salRes.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSalaryDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/salary/detail/${id}`, { withCredentials: true });
      if (response.data.success) setActiveSalary(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS ---
  const handleGenerateSalary = async () => {
    if (!selectedEmployee || !dateRange.startDate || !dateRange.endDate) return;
    setGenerating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/salary/generate`, {
        employeeId: selectedEmployee,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        // Optional: Let backend decide label, or format it nicely here
      }, { withCredentials: true });

      if (response.data.success) {
        setSalaries([response.data.salary, ...salaries]);
        setShowGenerateForm(false);
        setActiveSalary(response.data.salary);
        // Reset form
        setSelectedEmployee('');
        setDateRange({ startDate: '', endDate: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Generation Failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!activeSalary) return;
    try {
      const response = await axios.patch(`${API_BASE_URL}/salary/${activeSalary._id}/status`, {
        status: newStatus,
        paymentDate: newStatus === 'paid' ? new Date() : null
      }, { withCredentials: true });
      
      if (response.data.success) {
        // Update local state without refetching all
        const updated = response.data.data;
        setActiveSalary(updated);
        setSalaries(prev => prev.map(s => s._id === updated._id ? updated : s));
      }
    } catch (err) {
      console.error(err);
      alert("Status Update Failed");
    }
  };

  const handleDeleteSalary = async () => {
    if (!activeSalary) return;
    
    // Check if it's a draft salary
    if (activeSalary.status !== 'draft') {
      alert(`Cannot delete a ${activeSalary.status} salary. Only draft salaries can be deleted.`);
      return;
    }
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete this draft salary for ${activeSalary.employeeId?.name}?`)) {
      return;
    }
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/salary/${activeSalary._id}`, { withCredentials: true });
      
      if (response.data.success) {
        // Remove from list and clear detail view
        setSalaries(prev => prev.filter(s => s._id !== activeSalary._id));
        setActiveSalary(null);
        alert("Salary record deleted successfully");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete salary");
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'LKR' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print, button, .sidebar { display: none !important; }
          .print-full { width: 100% !important; margin: 0 !important; }
          body { background: white; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto print-full">
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
          <button 
            onClick={() => setShowGenerateForm(!showGenerateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showGenerateForm ? 'Cancel' : 'Generate New'}
          </button>
        </div>

        {/* GENERATE FORM */}
        {showGenerateForm && (
          <div className="bg-white p-6 rounded shadow mb-6 no-print">
            <h2 className="font-bold mb-4">Generate Salary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                className="border p-2 rounded"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.employeeId})</option>)}
              </select>
              <input type="date" className="border p-2 rounded" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate:e.target.value})} />
              <input type="date" className="border p-2 rounded" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate:e.target.value})} />
            </div>
            <button 
              onClick={handleGenerateSalary} 
              disabled={generating}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {generating ? 'Processing...' : 'Calculate & Generate'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LIST SIDEBAR */}
          <div className="bg-white rounded shadow overflow-hidden md:col-span-1 no-print">
            <div className="p-3 bg-gray-100 border-b font-bold">Records</div>
            <div className="max-h-[600px] overflow-y-auto">
              {salaries.map(sal => (
                <div 
                  key={sal._id}
                  onClick={() => fetchSalaryDetails(sal._id)}
                  className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${activeSalary?._id === sal._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                >
                  <div className="font-bold">{sal.employeeId?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{sal.period.label}</div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                      sal.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{sal.status}</span>
                    <span className="font-bold text-green-700">{formatCurrency(sal.calculations.netSalary)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAIL VIEW (THE PAY SLIP) */}
          <div className="md:col-span-2">
            {activeSalary ? (
              <div className="bg-white rounded shadow-lg overflow-hidden print-full">
                
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-start bg-gray-50">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payslip</h1>
                    <p className="text-gray-600">{activeSalary.employeeId?.name}</p>
                    <p className="text-sm text-gray-500">{activeSalary.employeeId?.position} | {activeSalary.employeeId?.employeeId}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Period</div>
                    <div className="font-bold">{formatDate(activeSalary.period.startDate)} - {formatDate(activeSalary.period.endDate)}</div>
                    <div className={`mt-2 inline-block px-3 py-1 rounded text-sm font-bold capitalize ${
                      activeSalary.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{activeSalary.status}</div>
                  </div>
                </div>

                {/* Money Cards */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Basic Salary</p>
                    <p className="text-xl font-bold">{formatCurrency(activeSalary.basicSalary)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Total Deducted</p>
                    <p className="text-xl font-bold text-red-600">
                      -{formatCurrency(
                        (activeSalary.calculations.deductions.absences || 0) +
                        (activeSalary.calculations.deductions.tax || 0) +
                        (activeSalary.calculations.deductions.other || 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Net Salary (Take Home)</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(activeSalary.calculations.netSalary)}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left: Attendance */}
                  <div>
                    <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Attendance & Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Total Days</span> <span className="font-bold">{activeSalary.workingDays.total}</span></div>
                      <div className="flex justify-between"><span>Present Days</span> <span className="text-green-600 font-bold">{activeSalary.workingDays.present}</span></div>
                      <div className="flex justify-between"><span>Absent Days</span> <span className="text-red-600 font-bold">{activeSalary.workingDays.absent}</span></div>
                      <div className="flex justify-between"><span>Paid Leaves</span> <span className="text-blue-600 font-bold">{activeSalary.workingDays.leave.approved}</span></div>
                      
                      <div className="mt-4 pt-2 border-t">
                        <div className="flex justify-between"><span>Total Hours</span> <span>{activeSalary.workingHours.total.toFixed(1)} hrs</span></div>
                        {/* FIXED AVERAGE LOGIC */}
                        <div className="flex justify-between">
                          <span>Daily Avg</span> 
                          <span className="font-bold">
                            {(activeSalary.workingDays.present + (activeSalary.workingDays.halfDay * 0.5)) > 0 
                              ? (activeSalary.workingHours.total / (activeSalary.workingDays.present + (activeSalary.workingDays.halfDay * 0.5))).toFixed(2)
                              : 0} hrs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Financials */}
                  <div>
                    <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Deduction Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      
                      {/* Only show absence deduction if > 0 */}
                      {activeSalary.calculations.deductions.absences > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Absence / No Pay</span>
                          <span>-{formatCurrency(activeSalary.calculations.deductions.absences)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-600">
                        <span>Tax (5%)</span>
                        <span>-{formatCurrency(activeSalary.calculations.deductions.tax)}</span>
                      </div>

                      {activeSalary.calculations.deductions.other > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>Late / Other</span>
                          <span>-{formatCurrency(activeSalary.calculations.deductions.other)}</span>
                        </div>
                      )}

                      <div className="mt-4 pt-2 border-t flex justify-between font-bold text-gray-800">
                        <span>Total Deducted</span>
                        <span className="text-red-600">-{formatCurrency(activeSalary.basicSalary - activeSalary.calculations.netSalary)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-green-700">
                        <span>Net Salary</span>
                        <span>{formatCurrency(activeSalary.calculations.netSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t flex justify-between items-center gap-3 no-print">
                  <div>
                    {activeSalary.status === 'draft' && (
                      <button 
                        onClick={handleDeleteSalary} 
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Delete Draft
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => window.print()} className="bg-gray-700 text-white px-4 py-2 rounded">Print / PDF</button>
                    {activeSalary.status !== 'paid' && (
                      <button 
                        onClick={() => handleUpdateStatus('paid')} 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded shadow text-gray-400">
                Select a salary record to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalaryManagement;