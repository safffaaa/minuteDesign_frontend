import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RequestLeaveForm from "./RequestLeaveForm";
import API from "../../api/axios";
import Attendance from "../common/Attendance";
import AttendanceTable from "../common/AttendanceTable";
import MyLeaves from "./MyLeaves";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await API.get("attendance/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res?.data?.records || []);
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to load attendance";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Employee Dashboard
            </h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Track your work hours, manage attendance, and view your performance at a glance.
          </p>
        </div>

        {/* Dashboard Grid */}
        <Attendance records={records} loading={loading} error={error} />

        {/* My Attendance Table */}
        <AttendanceTable records={records} loading={loading} error={error} />
        <RequestLeaveForm />
        <MyLeaves />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-8">
        © 2025 TimeTrack Pro. All rights reserved.
      </footer>
    </div>
  );
}
