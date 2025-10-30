import React, { useState } from "react";
import { UserPlus, Mail, Lock, Briefcase, DollarSign, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function AddEmployee({ onClose, onEmployeeAdded, employee = null }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!employee;
  const [form, setForm] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    role: employee?.role || "employee",
    hourlyRate: employee?.hourlyRate || "",
    password: "",
    joinExisting: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        const { password, ...updateData } = form;
        res = await API.put(`employee/update/${employee._id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Employee updated successfully!',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.data.message || 'Failed to update employee',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } else {
        res = await API.post("employee/add", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Employee added successfully!',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.data.message || 'Failed to add employee',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
      onEmployeeAdded?.();
      if (onClose) {
        onClose();
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} employee`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-fadeIn border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-white" />
            <h2 className="text-lg font-semibold text-white">{isEditMode ? "Edit Employee" : "Add New Employee"}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@company.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                {user.role === "admin" && <option value="hr">HR</option>}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Hourly Rate ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="hourlyRate"
                value={form.hourlyRate}
                onChange={handleChange}
                placeholder="Enter hourly rate"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password {isEditMode && "(leave blank to keep current)"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required={!isEditMode}
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons (Sticky) */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
