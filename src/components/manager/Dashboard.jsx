import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  CalendarDays,
  Users,
  FileBarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧩 Fetch data (attendance, team, leave)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [attRes, teamRes, leaveRes] = await Promise.all([
          API.get("attendance/all", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("employee/", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("leave/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setAttendanceRecords(attRes?.data?.records || []);
        setTeamMembers(teamRes?.data?.employees || []);
        setLeaveRequests(leaveRes?.data?.leaves || []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // 🔹 Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔹 Leave approval/rejection
  const handleLeaveAction = async (id, action) => {
    try {
      await API.patch(
        `leave/update/${id}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaveRequests((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: action } : l))
      );
      alert(`Leave ${action.toLowerCase()} successfully.`);
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed");
    }
  };

  // 🔹 Timesheet approval/rejection
  const handleTimesheetAction = async (id, action) => {
    try {
      const endpoint =
        action === "approve"
          ? `/attendance/approve/${id}`
          : `/attendance/reject/${id}`;
      await API.patch(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });

      setAttendanceRecords((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: action === "approve" ? "Approved" : "Rejected" }
            : r
        )
      );
      alert(`Timesheet ${action === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed");
    }
  };

  // 📊 Quick Stats
  const today = new Date();
  const isSameDay = (d) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  const isSameMonth = (d) =>
    d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();

  const inProgressToday = attendanceRecords.filter(
    (r) => isSameDay(new Date(r.date)) && r.clockIn && !r.clockOut
  ).length;

  const monthCompletedCount = attendanceRecords.filter(
    (r) => r.clockIn && r.clockOut && isSameMonth(new Date(r.date))
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-50 to-blue-100">
      {/* 🔹 Header */}
      <Header onLogout={handleLogout} />

      {/* 🔹 Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10">
        {/* Welcome Message */}
        <Card title="Welcome Back, Manager">
          <p className="text-gray-600">
            Approve your team’s timesheets, manage schedules, and monitor leave requests.
          </p>
        </Card>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            icon={<ClipboardCheck className="text-blue-600 w-6 h-6" />}
            title="In-progress Today"
            value={loading ? "…" : inProgressToday}
          />
          <SummaryCard
            icon={<Users className="text-green-600 w-6 h-6" />}
            title="Team Members"
            value={loading ? "…" : teamMembers.length}
          />
          <SummaryCard
            icon={<FileBarChart2 className="text-purple-600 w-6 h-6" />}
            title="Completed This Month"
            value={loading ? "…" : monthCompletedCount}
          />
        </div>

        {/* Approve Timesheets */}
        <Section
          title="Approve Timesheets"
          icon={<ClipboardCheck className="text-blue-600 w-5 h-5" />}
          description="Review and approve pending timesheets from your team."
        >
          <TimesheetTable
            loading={loading}
            error={error}
            records={attendanceRecords}
            onAction={handleTimesheetAction}
          />
        </Section>

        {/* Team Schedule */}
        <Section
          title="Team Schedule"
          icon={<CalendarDays className="text-blue-600 w-5 h-5" />}
        >
          <TeamSchedule
            team={teamMembers}
            attendance={attendanceRecords}
            loading={loading}
            error={error}
          />
        </Section>

        {/* Leave Requests */}
        <Section
          title="Leave Requests"
          icon={<CalendarDays className="text-blue-600 w-6 h-6" />}
          description="Review and manage all pending leave applications from your team."
        >
          <LeaveTable
            loading={loading}
            requests={leaveRequests}
            onAction={handleLeaveAction}
          />
        </Section>
      </main>

      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}

/* ------------------- 🔹 Sub Components ------------------- */

function Header({ onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manager Dashboard
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      {children}
    </div>
  );
}

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition">
      <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

function Section({ title, icon, description, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}
      {children}
    </div>
  );
}

function TimesheetTable({ loading, error, records, onAction }) {
  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!records?.length)
    return <p className="text-gray-500 text-sm">No timesheets found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-50 text-blue-700 font-semibold sticky top-0">
          <tr>
            <th className="w-1/4 px-4 py-3 border-b text-left">Employee</th>
            <th className="w-1/6 px-4 py-3 border-b text-left">Date</th>
            <th className="w-1/6 px-4 py-3 border-b text-left">Hours</th>
            <th className="w-1/6 px-4 py-3 border-b text-left">Status</th>
            <th className="w-1/4 px-4 py-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id} className="hover:bg-blue-50 transition border-b border-gray-100">
              <td className="w-1/4 px-4 py-3 text-left">{rec.user?.name || "N/A"}</td>
              <td className="w-1/6 px-4 py-3 text-left">
                {new Date(rec.date).toLocaleDateString()}
              </td>
              <td className="w-1/6 px-4 py-3 text-left">{rec.totalHours || 0} hrs</td>
              <td className="w-1/6 px-4 py-3 text-left font-medium">{rec.status}</td>
              <td className="w-1/4 px-4 py-3 text-center flex justify-center gap-3">
                {rec.status === "Pending" ? (
                  <>
                    <ActionBtn
                      label="Approve"
                      color="green"
                      onClick={() => onAction(rec._id, "approve")}
                    />
                    <ActionBtn
                      label="Reject"
                      color="red"
                      onClick={() => onAction(rec._id, "reject")}
                    />
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      rec.status === "Approved"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {rec.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaveTable({ loading, requests, onAction }) {
  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!requests?.length)
    return <p className="text-gray-500 text-sm">No leave requests found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">From</th>
            <th className="px-4 py-3 text-left">To</th>
            <th className="px-4 py-3 text-left">Reason</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const color =
              req.status === "Approved"
                ? "bg-emerald-500"
                : req.status === "Rejected"
                ? "bg-rose-500"
                : "bg-amber-500";
            return (
              <tr key={req._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{req.user?.name || "N/A"}</td>
                <td className="px-4 py-3">{req.type}</td>
                <td className="px-4 py-3">{new Date(req.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(req.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-500">{req.reason}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${color}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex justify-center gap-3">
                  {req.status === "Pending" ? (
                    <>
                      <ActionBtn
                        label="Approve"
                        color="green"
                        onClick={() => onAction(req._id, "Approved")}
                      />
                      <ActionBtn
                        label="Reject"
                        color="red"
                        onClick={() => onAction(req._id, "Rejected")}
                      />
                    </>
                  ) : (
                    <button
                      disabled
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white ${color}`}
                    >
                      {req.status}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TeamSchedule({ team, attendance, loading, error }) {
  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!team?.length)
    return <p className="text-gray-500 text-sm">No team members found.</p>;

  const today = new Date();
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <ul className="space-y-3 text-gray-700 text-sm">
      {team.map((m) => {
        const rec = attendance.find(
          (r) => r.user?._id === m._id && isSameDay(new Date(r.date), today)
        );
        let badge = "⚪",
          status = "Absent";
        if (rec?.clockIn && !rec?.clockOut) {
          badge = "🟢";
          status = "Working";
        } else if (rec?.clockIn && rec?.clockOut) {
          badge = "🔵";
          status = "Completed";
        }
        return (
          <li key={m._id} className="flex justify-between">
            <span>{badge} {m.name}</span>
            <span className="text-gray-500">{status}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ActionBtn({ label, color, onClick }) {
  const base =
    color === "green"
      ? "bg-emerald-500 hover:bg-emerald-600"
      : "bg-rose-500 hover:bg-rose-600";
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-white text-xs font-medium rounded-md shadow-sm transition ${base}`}
    >
      {label}
    </button>
  );
}

function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-500 border-t mt-8">
      © 2025 TimeTrack Pro. All rights reserved.
    </footer>
  );
}
