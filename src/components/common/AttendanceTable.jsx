import React from 'react'
import { Clock } from "lucide-react";

function AttendanceTable({records, loading, error}) {

    const formatTime = (ts) => {
    if (!ts) return "-";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString();
  };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="text-blue-600 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-800">
                    My Attendance Records
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-blue-50 text-blue-700 font-semibold">
                        <tr>
                            <th className="px-4 py-3 border-b">Date</th>
                            <th className="px-4 py-3 border-b">Clock In</th>
                            <th className="px-4 py-3 border-b">Breaks</th>
                            <th className="px-4 py-3 border-b">Clock Out</th>
                            <th className="px-4 py-3 border-b">Total Hours</th>
                            <th className="px-4 py-3 border-b">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                                    Loading...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-red-600" colSpan={6}>
                                    {error}
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                                    No attendance records yet
                                </td>
                            </tr>
                        ) : (
                            records.slice(0, 20).map((r) => (
                                <tr key={r._id} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-3 border-b">{formatDate(r.date)}</td>
                                    <td className="px-4 py-3 border-b">{formatTime(r.clockIn)}</td>
                                    <td className="px-4 py-3 border-b">
                                        {r.breaks && r.breaks.length > 0 ? (
                                            <ul className="space-y-1">
                                                {r.breaks.map((b, i) => (
                                                    <li key={i} className="text-gray-600">
                                                        <span className="text-xs">
                                                            🕒 {formatTime(b.breakOut)} → {formatTime(b.breakIn)}{" "}
                                                            ({b.duration?.toFixed(2)}h)
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 border-b">{formatTime(r.clockOut)}</td>
                                    <td className="px-4 py-3 border-b">
                                        {(r.totalHours || 0).toFixed(2)} hrs
                                    </td>
                                    <td
                                        className={`px-4 py-3 border-b font-medium ${r.clockOut
                                            ? "text-green-600"
                                            : r.clockIn
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {r.clockOut
                                            ? "Present"
                                            : r.clockIn
                                                ? "In-progress"
                                                : "Absent"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AttendanceTable