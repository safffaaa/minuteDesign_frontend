import React, { useState } from "react";
import { Calendar, FileText, Send } from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function RequestLeaveForm() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) {
      return alert("Please fill in all required fields.");
    }

    try {
      setLoading(true);
      const res = await API.post("/leave/request", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message || "Leave request submitted!");
      setForm({
        leaveType: "Sick Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-10">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-800">Request Time Off</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Leave Type</label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option>Sick Leave</option>
            <option>Vacation</option>
            <option>Unpaid Leave</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Enter your reason..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          <Send className="w-4 h-4" />
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
