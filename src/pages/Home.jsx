import React, { useEffect } from "react";
import {
  Clock,
  Users,
  CalendarCheck,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-8 h-8 text-blue-600" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            TimeTrack Pro
          </h1>
        </div>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium ml-auto">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span className="hover:text-blue-600 transition cursor-default">
            About
          </span>
          <span className="hover:text-blue-600 transition cursor-default">
            Contact
          </span>
        </nav>

        <div className="flex gap-2 sm:gap-3 ml-6 md:ml-10">
          <Link
            to="/login"
            className="px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 py-12 md:py-20 bg-linear-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="max-w-lg text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Empower Your Workforce with{" "}
            <span className="text-blue-200">TimeTrack Pro</span>
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8">
            Simplify attendance tracking, streamline payroll, and manage teams
            efficiently — all in one HR platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 md:mt-0 flex justify-center md:justify-end w-full md:w-1/2">
          <img
            src="https://illustrations.popsy.co/violet/remote-work.svg"
            alt="Team Productivity"
            className="w-72 sm:w-96 md:w-[400px] object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 px-5 sm:px-8 md:px-16 bg-gray-50">
        <h3 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
          Everything You Need in One Platform
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={<Clock className="w-8 h-8 text-blue-600" />}
            title="Time Tracking"
            desc="Clock in/out with ease, monitor work hours, and ensure attendance accuracy."
          />
          <FeatureCard
            icon={<CalendarCheck className="w-8 h-8 text-blue-600" />}
            title="Leave Management"
            desc="Apply, approve, and track employee leaves with transparent workflows."
          />
          <FeatureCard
            icon={<DollarSign className="w-8 h-8 text-blue-600" />}
            title="Payroll Automation"
            desc="Auto-calculate salaries, overtime, and deductions with real-time data."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white text-center py-14 px-6">
        <h3 className="text-2xl sm:text-3xl font-bold mb-3">
          Ready to streamline your HR operations?
        </h3>
        <p className="text-blue-100 mb-6 text-sm sm:text-base">
          Start your journey towards smarter time tracking and payroll
          automation today.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600 text-sm">
        © 2025 TimeTrack Pro. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="mb-4 flex justify-center sm:justify-start">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center sm:text-left">
        {title}
      </h4>
      <p className="text-gray-600 text-sm text-center sm:text-left">{desc}</p>
    </div>
  );
}

