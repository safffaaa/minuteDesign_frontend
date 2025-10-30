import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, User } from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function PayrollHistory() {
  const { token } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("payroll/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayrolls(res.data.payrolls || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load payroll history");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        Payroll History
      </h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading payroll data...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : payrolls.length === 0 ? (
        <p className="text-gray-500 text-sm">No payroll records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-100 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Employee</th>
                <th className="px-4 py-3 text-left font-medium">Month</th>
                <th className="px-4 py-3 text-left font-medium">Total Hours</th>
                <th className="px-4 py-3 text-left font-medium">Hourly Rate</th>
                <th className="px-4 py-3 text-left font-medium">Total Pay</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p._id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-800">
                    <User className="w-4 h-4 text-blue-600" />
                    {p.user?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {p.month}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.totalHours}</td>
                  <td className="px-4 py-3 text-gray-700">${p.hourlyRate}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">
                    ${p.totalPay.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        p.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : p.status === "Processed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
