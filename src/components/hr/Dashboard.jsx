import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  FileBarChart,
  CalendarCheck2,
  UserPlus,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Swal from "sweetalert2";
import AddEmployee from "./AddEmployee";
import Attendance from "../common/Attendance";

export default function HRDashboard() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPayrollAmount, setTotalPayrollAmount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleGeneratePayroll = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2025-10"

      const confirm = await Swal.fire({
        title: "Generate Payroll?",
        html: `
        <p class="text-gray-600 text-sm">
          This will calculate payroll for all employees based on 
          <b>approved attendance, breaks, overtime, and leaves</b> for 
          <b>${currentMonth}</b>.
        </p>
      `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, generate",
      });

      if (!confirm.isConfirmed) return;

      setLoading(true);

      const res = await API.post(
        "/payroll/generate-all",
        { month: currentMonth },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { payrolls = [], message } = res.data || {};

      if (!payrolls.length) {
        Swal.fire({
          icon: "info",
          title: "No Employees Found",
          text: "No employee records available for payroll generation.",
        });
        return;
      }

      const totalAmount = payrolls.reduce((sum, p) => sum + (p.totalPay || 0), 0);

      Swal.fire({
        icon: "success",
        title: "Payroll Generated ✅",
        html: `
        <p class="text-gray-700 text-sm mb-2">${message}</p>
        <p class="text-gray-600 text-xs">
          <b>${payrolls.length}</b> employees processed<br/>
          Total Amount: <b>$${totalAmount.toLocaleString()}</b>
        </p>
      `,
        timer: 2500,
        showConfirmButton: false,
      });

      // ✅ Update dashboard UI
      setPayrolls(payrolls);
      setTotalPayrollAmount(totalAmount);

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Payroll generation failed";
      Swal.fire({
        icon: "error",
        title: "Error Generating Payroll",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const [records, setRecords] = useState([]);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [empRes, payrollRes, leavesRes] = await Promise.all([
          API.get("employee/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("payroll/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("leave/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const employees = empRes?.data?.employees || [];
        const payrolls = payrollRes?.data?.payrolls || [];
        const leaves = leavesRes?.data?.leaves || [];

        // ✅ Count only pending leaves
        const pendingCount = leaves.filter(
          (leave) => leave.status === "Pending"
        ).length;

        setTotalEmployees(employees.length);
        setPayrolls(payrolls);
        setTotalPayrollAmount(
          payrolls.reduce((sum, p) => sum + (p.totalPay || 0), 0)
        );
        setPendingLeaves(pendingCount);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err.message ||
          "Failed to load dashboard";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              HR Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back, HR Admin
          </h2>
          <p className="text-gray-600">
            Manage employees, process payroll, and monitor organization-wide
            reports efficiently.
          </p>
        </div>

        <Attendance records={records} loading={loading} error={error} />

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            icon={<Users className="text-blue-600 w-6 h-6" />}
            title="Total Employees"
            value={loading ? "…" : String(totalEmployees)}
          />
          <SummaryCard
            icon={<DollarSign className="text-green-600 w-6 h-6" />}
            title="Total Payroll Processed"
            value={
              loading ? "…" : `$${totalPayrollAmount.toLocaleString()}`
            }
          />
          <SummaryCard
            icon={<CalendarCheck2 className="text-purple-600 w-6 h-6" />}
            title="Pending Leave Requests"
            value={loading ? "…" : String(pendingLeaves)}
          />
        </div>

        {/* Payroll + Employee Management */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payroll Processing */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Payroll Processing
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Calculate employee salaries based on attendance, overtime, and
              approved leaves.
            </p>

            <div className="flex flex-wrap gap-4">
              {loading ? (
                <button
                  disabled
                  className="px-5 py-3 bg-green-600 text-white rounded-lg opacity-70 cursor-not-allowed"
                >
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Generating Payroll...
                </button>
              ) : (
                <button
                  onClick={handleGeneratePayroll}
                  className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                >
                  Generate Payroll
                </button>
              )}
              <Link to="/payroll-history">
                <button className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
                  View Payroll History
                </button>
              </Link>
            </div>

            {/* Last Processed Batch */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Last Processed Batch
              </h4>
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : payrolls.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No payrolls processed yet.
                </p>
              ) : (
                (() => {
                  const latest = payrolls[0];
                  const latestMonth = latest?.month;
                  const batch = payrolls.filter((p) => p.month === latestMonth);
                  const processedOn = latest?.createdAt
                    ? new Date(latest.createdAt)
                    : null;
                  const batchAmount = batch.reduce(
                    (sum, p) => sum + (p.totalPay || 0),
                    0
                  );
                  return (
                    <p className="text-sm text-gray-600">
                      • Processed on{" "}
                      <span className="font-medium text-gray-800">
                        {processedOn
                          ? processedOn.toLocaleDateString()
                          : "-"}
                      </span>
                      <br />• Month:{" "}
                      <span className="font-medium">{latestMonth || "-"}</span>
                      <br />• Total Employees Paid:{" "}
                      <span className="font-medium">{batch.length}</span>
                      <br />• Total Amount:{" "}
                      <span className="font-medium text-green-700">
                        ${batchAmount.toLocaleString()}
                      </span>
                    </p>
                  );
                })()
              )}
            </div>
          </div>

          {/* Employee Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Employee Management
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Add, edit, and manage employee information, roles, and salaries.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                Add New Employee
              </button>
              <button
                onClick={() => navigate("/employee-list")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition"
              >
                View Employee List
              </button>
              <button
                onClick={() => navigate("/leave-request")}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-400 text-gray-800 rounded-lg text-sm font-medium transition"
              >
                Leave Requests
              </button>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <FileBarChart className="text-blue-600 w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">
              Reports & Analytics
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Access summaries and detailed reports on payroll, attendance, and
            leave statistics.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard title="Attendance Report" path="/reports/attendance" />
            <ReportCard title="Payroll Summary" path="/reports/payroll" />
            <ReportCard title="Leave Records" path="/reports/leave" />
          </div>

        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <AddEmployee
            onClose={() => setShowAddModal(false)}
            onEmployeeAdded={() => console.log("Employee added!")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-8">
        © 2025 TimeTrack Pro. All rights reserved.
      </footer>
    </div>
  );
}

// Sub Components
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

function ReportCard({ title, path }) {
  return (
    <Link to={path}>
      <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-md hover:border-blue-300 transition cursor-pointer">
        <h4 className="text-gray-800 font-medium mb-2">{title}</h4>
        <p className="text-sm text-gray-500">View details & export report</p>
      </div>
    </Link>
  );
}
