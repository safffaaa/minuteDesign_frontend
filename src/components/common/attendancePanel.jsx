import React, { useState, useEffect } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AttendancePanel() {
  const { token } = useAuth();
  const [status, setStatus] = useState("idle"); // idle, clocked-in, on-break, clocked-out
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch today's status
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("attendance/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const records = res?.data?.records || [];
        const today = new Date();

        const isSameDay = (a, b) =>
          a.getFullYear() === b.getFullYear() &&
          a.getMonth() === b.getMonth() &&
          a.getDate() === b.getDate();

        const todayRecord = records.find((r) =>
          isSameDay(new Date(r.date), today)
        );

        if (todayRecord) {
          if (todayRecord.clockOut) setStatus("clocked-out");
          else if (
            todayRecord.breaks?.length &&
            !todayRecord.breaks[todayRecord.breaks.length - 1].breakIn
          )
            setStatus("on-break");
          else if (todayRecord.clockIn) setStatus("clocked-in");
        } else setStatus("idle");
      } catch (err) {
        console.warn("Failed to load attendance status");
      }
    })();
  }, [token]);

  // API handlers
  const handleClockIn = async () => {
    try {
      setLoading(true);
      await API.post("attendance/clockin", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("clocked-in");
      setLastAction("You clocked in successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || "Clock-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      await API.post("attendance/clockout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("clocked-out");
      setLastAction("You clocked out successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || "Clock-out failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBreakOut = async () => {
    try {
      setLoading(true);
      await API.post("attendance/break-out", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("on-break");
      setLastAction("You are now on a break.");
    } catch (err) {
      alert(err?.response?.data?.message || "Break start failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBreakIn = async () => {
    try {
      setLoading(true);
      await API.post("attendance/break-in", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("clocked-in");
      setLastAction("Break ended. Back to work!");
    } catch (err) {
      alert(err?.response?.data?.message || "Break end failed.");
    } finally {
      setLoading(false);
    }
  };

  // UI render
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-blue-600 w-6 h-6" />
          <h3 className="text-lg font-semibold text-gray-800">
            Attendance Tracker
          </h3>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="font-semibold text-gray-800">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      {/* Status Display */}
      <div
        className={`p-4 rounded-xl mb-6 text-center border ${status === "on-break"
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : status === "clocked-in"
              ? "bg-green-50 text-green-700 border-green-200"
              : status === "clocked-out"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
      >
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">
            {status === "on-break"
              ? "You are on a break"
              : status === "clocked-in"
                ? "You are currently Clocked In"
                : status === "clocked-out"
                  ? "You are Clocked Out"
                  : "You haven’t clocked in yet"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* Clock In */}
        <button
          onClick={handleClockIn}
          disabled={status !== "idle" || loading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-all ${status !== "idle" || loading
              ? "bg-green-300 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          <LogIn className="w-5 h-5" />
          {loading && status === "idle" ? "Processing..." : "Clock In"}
        </button>

        {/* Break Out */}
        <button
          onClick={handleBreakOut}
          disabled={status !== "clocked-in" || loading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-all ${status !== "clocked-in" || loading
              ? "bg-yellow-300 text-white cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
        >
          <Coffee className="w-5 h-5" />
          {loading && status === "clocked-in" ? "Processing..." : "Break Out"}
        </button>

        {/* Break In */}
        <button
          onClick={handleBreakIn}
          disabled={status !== "on-break" || loading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-all ${status !== "on-break" || loading
              ? "bg-yellow-300 text-white cursor-not-allowed"
              : "bg-yellow-700 hover:bg-yellow-800 text-white"
            }`}
        >
          <RotateCcw className="w-5 h-5" />
          {loading && status === "on-break" ? "Processing..." : "Break In"}
        </button>

        {/* Clock Out */}
        <button
          onClick={handleClockOut}
          disabled={status === "idle" || status === "clocked-out" || loading}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-all ${status === "idle" || status === "clocked-out" || loading
              ? "bg-red-300 text-white cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
            }`}
        >
          <LogOut className="w-5 h-5" />
          {loading && status !== "clocked-out" ? "Processing..." : "Clock Out"}
        </button>
      </div>

      {/* Last Action Message */}
      {lastAction && (
        <div className="mt-6 text-center text-sm text-gray-600">
          {lastAction}
        </div>
      )}
    </div>
  );
}
