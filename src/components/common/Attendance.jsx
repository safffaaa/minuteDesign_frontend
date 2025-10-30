import React from "react";
import { CalendarDays, BarChart3, Loader2 } from "lucide-react";
import AttendancePanel from "./attendancePanel";

export default function Attendance({records, loading, error}) {

    // Calculate today’s total worked hours
    const today = new Date();
    const todayHours = records
        .filter((r) => {
            const d = new Date(r.date);
            return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
            );
        })
        .reduce((sum, r) => sum + (r.totalHours || 0), 0);

    const year = today.getFullYear();
    const month = today.getMonth();

    // Calculate total workdays in current month (Mon–Fri)
    const getWorkdaysInMonth = (year, month) => {
        let count = 0;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const current = new Date(year, month, day);
            const weekday = current.getDay(); // 0=Sun, 6=Sat
            if (weekday !== 0 && weekday !== 6) count++;
        }
        return count;
    };

    const totalWorkDays = getWorkdaysInMonth(year, month);

    // Calculate how many days user attended
    const presentDays = records.filter((r) => r.clockIn && r.clockOut).length;

    // Attendance percentage based on workdays
    const attendanceRate = totalWorkDays
        ? Math.round((presentDays / totalWorkDays) * 100)
        : 0;

    return (
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Left - Attendance Card */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="text-blue-600 w-5 h-5" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            Clock In / Clock Out
                        </h2>
                    </div>
                    <AttendancePanel />
                </div>
            </div>

            {/* Right - Quick Stats */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="text-sm font-medium text-gray-600">
                        Today's Hours Worked
                    </h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {todayHours.toFixed(2)} hrs
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                    <CalendarDays className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="text-sm font-medium text-gray-600">
                        Attendance Rate
                    </h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {attendanceRate}%
                    </p>
                </div>
            </div>
        </div>
    );
}
