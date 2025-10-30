import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { CalendarDays, FileBarChart, Loader2 } from "lucide-react";

export default function ReportDashboard({ type }) {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint =
    type === "attendance"
      ? "reports/attendance"
      : type === "payroll"
      ? "reports/payroll"
      : "reports/leave";

  const titleMap = {
    attendance: "Attendance Report",
    payroll: "Payroll Summary",
    leave: "Leave Records",
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await API.get(`/${endpoint}?month=${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (type === "attendance" || type === "leave") {
          setData(res.data.summary || []);
        } else {
          setData(res.data.payrolls || []);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, month, endpoint, type]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileBarChart className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {titleMap[type]}
          </h1>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading report...
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : type === "attendance" ? (
        <AttendanceTable data={data} />
      ) : type === "payroll" ? (
        <PayrollTable data={data} />
      ) : (
        <LeaveTable data={data} />
      )}
    </div>
  );
}

// 🧾 Attendance Report Table
function AttendanceTable({ data }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-50 text-blue-700 font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-center">Total Days</th>
            <th className="px-4 py-3 text-center">Present</th>
            <th className="px-4 py-3 text-center">Pending</th>
            <th className="px-4 py-3 text-center">Total Hours</th>
            <th className="px-4 py-3 text-center">Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{r.user.name}</td>
              <td className="px-4 py-3">{r.user.role}</td>
              <td className="px-4 py-3 text-center">{r.totalDays}</td>
              <td className="px-4 py-3 text-center">{r.presentDays}</td>
              <td className="px-4 py-3 text-center">{r.pendingDays}</td>
              <td className="px-4 py-3 text-center">{r.totalHours}</td>
              <td className="px-4 py-3 text-center text-green-700 font-semibold">
                {r.attendanceRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 💰 Payroll Summary Table
function PayrollTable({ data }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-green-50 text-green-700 font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-center">Month</th>
            <th className="px-4 py-3 text-center">Hours</th>
            <th className="px-4 py-3 text-center">Overtime</th>
            <th className="px-4 py-3 text-center">Unpaid Leaves</th>
            <th className="px-4 py-3 text-center">Total Pay ($)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{p.user?.name}</td>
              <td className="px-4 py-3">{p.user?.role}</td>
              <td className="px-4 py-3 text-center">{p.month}</td>
              <td className="px-4 py-3 text-center">{p.totalHours}</td>
              <td className="px-4 py-3 text-center">{p.overtimeHours}</td>
              <td className="px-4 py-3 text-center">{p.unpaidLeaveDays}</td>
              <td className="px-4 py-3 text-center text-green-700 font-semibold">
                ${p.totalPay?.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 🌴 Leave Summary Table
function LeaveTable({ data }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-purple-50 text-purple-700 font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-center">Total Leaves</th>
            <th className="px-4 py-3 text-center">Approved</th>
            <th className="px-4 py-3 text-center">Rejected</th>
            <th className="px-4 py-3 text-center">Pending</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{r.user.name}</td>
              <td className="px-4 py-3">{r.user.role}</td>
              <td className="px-4 py-3 text-center">{r.totalLeaves}</td>
              <td className="px-4 py-3 text-center text-green-700 font-semibold">
                {r.approved}
              </td>
              <td className="px-4 py-3 text-center text-red-600 font-semibold">
                {r.rejected}
              </td>
              <td className="px-4 py-3 text-center text-amber-600 font-semibold">
                {r.pending}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
