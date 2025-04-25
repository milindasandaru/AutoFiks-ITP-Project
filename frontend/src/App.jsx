import { Routes, Route, Navigate } from "react-router-dom";
import FloatingShape from "./components/user/FloatingShape";
import SignUpPage from "./pages/user/SignUpPage";
import LoginPage from "./pages/user/LoginPage";
import EmailVerificationPage from "./pages/user/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import OverviewPage from "./pages/user/OverviewPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import EditUserProfilePage from "./pages/user/EditUserProfilePage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import Layout from "./components/employee/Layout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import WorkSchedule from "./pages/employee/WorkSchedule";
import Leaving from "./pages/employee/Leaving";
import Earning from "./pages/employee/Earning";
import Profile from "./pages/employee/Profile";
import HelpCenter from "./pages/employee/HelpCenter";
import CartPage from "./pages/user/CartPage";
import StorePage from "./pages/user/StorePage";
import SparePartViewPage from "./pages/user/SparePartViewPage";
import UserLayout from "./components/user/UserLayout";
import ServiceSchedule from "./pages/user/Appointmentbookingform";
import BookingsList from "./pages/user/Bookingslist"; // ✅ FIXED: Capitalized

// Protected route that requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("ProtectedRoute state:", isAuthenticated, user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Redirect authenticated users to appropriate home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, role } = useAuthStore();

  if (isAuthenticated && user?.isVerified && role === "user") {
    return <Navigate to="/overview" replace />;
  } else if (isAuthenticated && user?.isVerified && role === "employee") {
    return <Navigate to="/employee-dashboard" replace />;
  }

  return children;
};

function App() {
  const { checkAuth, isAuthenticated, user, role, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("App.jsx - Is authenticated: ", isAuthenticated);
  console.log("App.jsx - User: ", user);
  console.log("App.jsx - Role: ", role);

  if (isCheckingAuth) {
    return <div className="text-center p-10">Checking authentication...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center relative overflow-hidden">
      {/* Floating shapes */}
      <FloatingShape color="bg-[#2563eb]" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-[#2563eb]" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-[#2563eb]" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <Routes>
        {/* Redirect base path */}
        <Route path="/" element={<Navigate to="/overview" replace />} />

        {/* Auth Routes */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/resetpassword/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* User Routes */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="spare-parts" element={<StorePage />} />
          <Route path="spare-part/:id" element={<SparePartViewPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="service-ticket" element={<ServiceSchedule />} />
          <Route path="booking-list" element={<BookingsList />} />
          <Route path="user-profile" element={<UserProfilePage />} />
          <Route path="edit-user-profile" element={<EditUserProfilePage />} />

          {/* Optional future routes */}
          {/*
            <Route path="tracking" element={<LiveTrackingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="help-center" element={<HelpCenterPage />} />
          */}
        </Route>

        {/* Employee Routes */}
        <Route path="/employee-dashboard" element={<Layout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="workSchedule" element={<WorkSchedule />} />
          <Route path="leaving" element={<Leaving />} />
          <Route path="earning" element={<Earning />} />
          <Route path="profile" element={<Profile />} />
          <Route path="helpcenter" element={<HelpCenter />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
