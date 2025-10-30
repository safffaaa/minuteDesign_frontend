import React, { useState, useEffect } from "react";
import { Clock, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2'

export default function Signup() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgCode: "",
    joinExisting: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && token) navigate("/signup");
  }, [user, token, navigate]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("user/register", formData);

      if (res.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Signup Successful",
          text: "Your account has been created successfully!",
          confirmButtonColor: "#2563eb", // blue tone
        });

        navigate("/login"); // only after alert confirmation
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: err.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3 text-white">
          <Clock className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">TimeTrack Pro</h1>
            <p className="text-blue-100 text-sm">HR Management System</p>
          </div>
        </div>

        <div className="text-white">
          <h2 className="text-4xl font-bold mb-4">Join Thousands of Teams</h2>
          <p className="text-blue-100 text-lg">
            Track time, manage attendance, and boost productivity with our HR
            platform.
          </p>
        </div>

        <p className="text-blue-100 text-sm">
          © 2025 TimeTrack Pro. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">TimeTrack Pro</h1>
              <p className="text-gray-600 text-xs">HR Management System</p>
            </div>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600 text-sm">
                Start managing your workforce efficiently
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="orgName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Organization Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="orgName"
                    type="text"
                    name="orgName"
                    placeholder="Enter organization name"
                    onChange={handleChange}
                    value={formData.orgName}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!formData.joinExisting}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={formData.name}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 6 characters"
                    onChange={handleChange}
                    value={formData.password}
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Organization Code */}
              <div>
                <label
                  htmlFor="orgCode"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Organization Code
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="orgCode"
                    type="text"
                    name="orgCode"
                    placeholder="Enter organization code (e.g. TT123)"
                    onChange={handleChange}
                    value={formData.orgCode}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

