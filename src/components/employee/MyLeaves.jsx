import React, { useEffect, useState } from "react";
import { Calendar, FileText, Loader2 } from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function MyLeaves() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await API.get("/leave/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data.leaves || []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load leave data");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-10">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-800">My Leave Applications</h2>
      </div>

      {/* 🌀 Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading leaves...
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : leaves.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">
          No leave applications found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 font-medium">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((leave) => {
                const statusColor =
                  leave.status === "Approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : leave.status === "Rejected"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700";

                return (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {leave.leaveType}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{leave.reason}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
