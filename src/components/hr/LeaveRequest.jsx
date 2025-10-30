import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function LeaveRequests() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("leave/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 md:p-6 m-2 md:m-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave Requests</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : leaves.length === 0 ? (
        <p className="text-gray-500 text-sm">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-100 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Leave Type</th>
                <th className="px-4 py-3 text-left">Dates</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-3">{l.user?.name}</td>
                  <td className="px-4 py-3">{l.leaveType}</td>
                  <td className="px-4 py-3">
                    {new Date(l.startDate).toLocaleDateString()} -{" "}
                    {new Date(l.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{l.reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        l.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : l.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {l.status}
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
