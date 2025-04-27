import { BrowserRouter, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceTicket from "./pages/Service shedule/ServiceTicket";
import Employee from "./pages/Employee/Employee";
import Customer from "./pages/Customer";
import Billing from "./pages/CustomerAffairs";
import SpareParts from "./pages/SpareParts/SpareParts";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import CreateEmployee from "./pages/Employee/CreateEmployee";
import UpdateEmployee from "./pages/Employee/UpdateEmployee";
import AttendancePage from "./pages/Employee/AttendancePage";
import AttendanceReport from "./pages/Employee/AttendanceReport";
import TaskManagement from "./pages/Employee/TaskManagement";
import LeaveManagementAdmin from "./pages/Employee/LeaveManagementAdmin";
import CreateNewSparePart from "./pages/SpareParts/CreateNewSparePart";
import UpdateSparePart from "./pages/SpareParts/UpdateSparePart";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-[#f3f4f6]">
      <FloatingShape
        color="bg-[#2563eb]"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-[#2563eb]"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#2563eb]"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="service_ticket" element={<ServiceTicket />} />
            <Route path="employee" element={<Employee />} />
            <Route path="customer" element={<Customer />} />
            <Route path="billing" element={<Billing />} />
            <Route path="spare_parts" element={<SpareParts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="setting" element={<Setting />} />
            <Route
              path="create-new-sparepart"
              element={<CreateNewSparePart />}
            />
            <Route
              path="update-sparepart/:sparePartId"
              element={<UpdateSparePart />}
            />
            <Route path="updateEmployee/:id" element={<UpdateEmployee />} />
            <Route path="createEmployee" element={<CreateEmployee />} />
            <Route path="attendancePage" element={<AttendancePage />} />
            <Route path="attendanceReport" element={<AttendanceReport />} />
            <Route path="taskManagement" element={<TaskManagement />} />
            <Route path="leaveManagementAdmin" element={<LeaveManagementAdmin />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
