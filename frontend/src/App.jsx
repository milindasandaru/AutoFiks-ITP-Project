import { Routes, Route, Navigate } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import OverviewPage from "./pages/OverviewPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import UserProfilePage from "./pages/UserProfilePage";

//protected routees that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("ProtectedRoute state:", isAuthenticated, user); // Debugging

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

//Redirect authenticated users into home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/overview" replace />;
  }

  return children;
};

function App() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("App.jsx - Is authenticated: ", isAuthenticated);
  console.log("App.jsx - User: ", user);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center relative overflow-hidden">
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

      {/*Main sections*/}
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <OverviewPage />
            </ProtectedRoute>
          }
        ></Route>

        {/*Authentication sections*/}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage></SignUpPage>
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        {/*Main navigations*/}
        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        ></Route>
        <Route path="/user-profile" element={<UserProfilePage />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
