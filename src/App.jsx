import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/SignUp.jsx";
import EmployeeDashboard from "./components/employee/Dashboard.jsx";
import HRDashboard from "./components/hr/Dashboard.jsx";
import ManagerDashboard from "./components/manager/Dashboard.jsx";
import AddEmployee from "./components/hr/AddEmployee.jsx";
import EmployeeList from "./components/hr/EmployeeList.jsx";
import PayrollHistory from "./components/hr/PayrollHistory.jsx";
import RequestLeaveForm from "./components/employee/RequestLeaveForm.jsx";
import LeaveRequests from "./components/hr/LeaveRequest.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ReportDashboard from "./components/hr/ReportDashboard.jsx";

function App() {
  const { user } = useAuth();

  const getDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case "employee":
        return <EmployeeDashboard />;
      case "manager":
        return <ManagerDashboard />;
      case "hr":
      case "admin":
        return <HRDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      {/* All dashboards protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employee", "manager", "hr", "admin"]}>
            {getDashboard()}
          </ProtectedRoute>
        }
      />

      {/* HR Only */}
      <Route
        path="/add-employee"
        element={
          <ProtectedRoute allowedRoles={["hr", "admin"]}>
            <AddEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee-list"
        element={
          <ProtectedRoute allowedRoles={["hr", "admin"]}>
            <EmployeeList />
          </ProtectedRoute>
        }
      />

      {/* HR + Manager */}
      <Route
        path="/payroll-history"
        element={
          <ProtectedRoute allowedRoles={["hr", "manager", "admin"]}>
            <PayrollHistory />
          </ProtectedRoute>
        }
      />

      {/* Employee Only */}
      <Route
        path="/request-leave"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <RequestLeaveForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-request"
        element={
          <ProtectedRoute allowedRoles={["hr", "manager", "admin"]}>
            <LeaveRequests />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/hr-dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/manager-dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/reports/attendance" element={<ReportDashboard type="attendance" />} />
      <Route path="/reports/payroll" element={<ReportDashboard type="payroll" />} />
      <Route path="/reports/leave" element={<ReportDashboard type="leave" />} />
    </Routes>
  );
}

export default App;
